import fs from 'fs'; 

import { SUM, timestamp } from '../../constants';
import { UserService, PaymentService } from '../../../users/services';

import { errLog, debLog } from '../../../../utils/logs/logger';

function c(ctx, obj) {
    ctx.status = 200;
    ctx.body = obj;

    return ctx;
};

async function create_transaction(ctx, transaction) {
    try {
        const body = ctx.request.body;
        if (transaction.params.create_time) {
            const payment = await PaymentService
                .updatePayment({
                    params: { 
                        state: 1, create_time: transaction.params.create_time,
                        time: transaction.params.time
                    },
                    payment_id: body.params.id, mock_amount: body.params.amount,

                }, transaction);
            const pay = payment.params;
            return c(ctx, {
                id: body.id,
                "result": {
                    "create_time": pay.create_time,
                    "state": pay.state,
                    "transaction": `${pay.transaction}`
                }
            });
        }
        const payment = await PaymentService
            .updatePayment({
                params: { state: 1, create_time: body.params.time, time: body.params.time },
                payment_id: body.params.id, mock_amount: body.params.amount
            }, transaction);
        const pay = payment.params;
        return c(ctx, {
            id: body.id,
            "result": {
                "create_time": pay.create_time,
                "state": pay.state,
                "transaction": `${pay.transaction}`
            }
        });
    } catch (e) {
        ctx.status = 200;
        ctx.body = {
            id: body.id, result: null,
            error: { code: -32400, message: "Internal error" }
        };
    }
};

export default {
    async checkPerformTransaction(ctx, body) {
        let payment = await PaymentService.findOne({ id: body.params.account.itutor });
        if (!payment) return c(ctx, {
            id: body.id,
            result: null, error: { code: -31050, message: "Login not found." }
        });

        if (payment.params.state != 1)
            return c(ctx, {
                id: body.id,
                result: null, error: {
                    code: -31055,
                    message: "Acceptance of payment is not possible."
                }
            });

        if (body.params.amount <= SUM) return c(ctx, {
            id: body.id,
            result: null, error: { code: -31001, message: "Incorrect amount." }
        });

        return c(ctx, { id: body.id, result: { "allow": true } });
    },

    async createTransaction(ctx, body) {
        const itutor = body.params.account.itutor;
        if (!itutor || typeof itutor != 'number') return c(ctx, {
            id: body.id,
            result: null, error: { code: -31050, message: "Login not found." }
        });

        let user = await UserService.findOne({ uniqueID: itutor });
        if (!user) return c(ctx, {
            id: body.id,
            result: null, error: { code: -31050, message: "Login not found." }
        });

        if (body.params.amount <= SUM) return c(ctx, {
            id: body.id,
            result: null, error: { code: -31001, message: "Incorrect amount." }
        });

        let payment = await PaymentService
            .findOne({ userHash: user.hash, id: itutor });

        if (!payment.payment_id)
            payment = await PaymentService.updatePayment({ payment_id: body.params.id },
                payment);

        // if (payment.payment_id != body.params.id) // одноразовый счет
        // return c(ctx, { "result": { "allow": -31050 } });

        if (payment) {
            if (payment.params.state != 1) return c(ctx, {
                id: body.id,
                result: null, error: { code: -31008, message: "Unable to perform operation." }
            });

            const bool = timestamp() <= payment.time_out;
            if (!bool) {
                await PaymentService.updatePayment({
                    params: {
                        state: -1, reason: 4,
                    },
                    payment_id: body.params.id
                }, payment);

                return c(ctx, {
                    id: body.id, result: null,
                    error: { code: -31008, message: "Unable to perform operation." }
                });
            }

            return create_transaction(ctx, payment);
        } else {
            let bool = await checkPerformTransaction(ctx, body);
            if (!bool) return c(ctx, {
                id: body.id,
                result: null, error: { code: -31050, message: "Login not found." }
            });

            return create_transaction(ctx, payment);
        }
    },

    async performTransaction(ctx, body) {
        let payment = await PaymentService.findOne({ payment_id: body.params.id });

        if (!payment) return c(ctx, {
            id: body.id,
            result: null, error: { code: -31003, message: "Transaction not found" }
        });

        let { state } = payment.params;
        if (state != 1) {
            if (state != 2) return c(ctx, {
                id: body.id, result: null,
                error: { code: -31008, message: "Unable to perform operation." }
            });
            
            if(payment.params.perform_time){
                return c(ctx, {
                    id: body.id,
                    result: { state, perform_time: 
                              payment.params.perform_time, 
                              transaction: payment.params.transaction 
                    }
                });    
            }
            payment = await PaymentService.updatePayment({
                amount: payment.mock_amount,
                params: { state: 2, perform_time: timestamp() }
            }, payment);

            let { perform_time, transaction } = payment.params;
            return c(ctx, {
                id: body.id,
                result: { state: payment.params.state, perform_time, transaction }
            });
        } else if (state = 1) {
            const bool = timestamp() <= payment.time_out;

            if (!bool) {
                await PaymentService.updatePayment({
                    params: { state: -1, reason: 4 }
                }, payment);
                return c(ctx, {
                    id: body.id, result: null,
                    error: { code: -31008, message: "Unable to perform operation." }
                });
            }
            let user = await UserService.findOne({ uniqueID: payment.id });
            let amount = user.amount + payment.mock_amount;
            await UserService.updateUser({ amount }, user);
            payment = await PaymentService.updatePayment({
                amount: payment.mock_amount,
                params: { state: 2, perform_time: timestamp() }
            }, payment);

            let { perform_time, transaction } = payment.params;
            return c(ctx, {
                id: body.id,
                result: { state: payment.params.state, perform_time, transaction }
            });
        }
    },

    async cancelTransaction(ctx, body) {
        let payment = await PaymentService.findOne({ payment_id: body.params.id });
        if (!payment) return c(ctx, {
            id: body.id,
            result: null, error: { code: -31003, message: "Transaction not found" }
        });

        let { state, cancel_time, transaction } = payment.params;
        if (state != 1) {
            if (state != 2) {
                if(!cancel_time){
                    payment = await PaymentService
                    .updatePayment({
                        params:
                        {
                            state: -2, cancel_time: timestamp(),
                            reason: body.params.reason
                        }, amount: 0
                    }, payment);
                    return c(ctx, {
                        id: body.id,
                        result: {
                            state: payment.params.state,
                            cancel_time: payment.params.cancel_time,
                            transaction: payment.params.transaction
                        }
                    });
                }
                return c(ctx, {
                    id: body.id,
                    result: { state, cancel_time, transaction }
                });
            }

            let user = await UserService.findOne({ uniqueID: payment.id });
            let bool = payment.amount <= user.amount;
            if (!bool) return c(ctx, {
                id: body.id, result: null,
                error: {
                    code: -31007,
                    message: `Order completed. Cannot cancel transaction. 
                    The product or service is provided to the buyer in full.`
                }
            });

            let amount = user.amount - payment.amount;
            await UserService.updateUser({ amount }, user);
            payment = await PaymentService
                .updatePayment({
                    params:
                    {
                        state: -2, cancel_time: timestamp(),
                        reason: body.params.reason
                    }, amount: 0
                }, payment);

            return c(ctx, {
                id: body.id,
                result: {
                    state: payment.params.state,
                    cancel_time: payment.params.cancel_time,
                    transaction: payment.params.transaction
                }
            });
        } else if (state = 1) {
            payment = await PaymentService
                .updatePayment({
                    params:
                    {
                        state: -1, cancel_time: timestamp(),
                        reason: body.params.reason
                    }
                }, payment);
            let { state, cancel_time, transaction } = payment.params;
            return c(ctx, { id: body.id, result: { state, cancel_time, transaction } });
        }
    },

    async checkTransaction(ctx, body) {
        const payment = await PaymentService.findOne({ payment_id: body.params.id });
        if (!payment) return c(ctx, {
            id: body.id,
            result: null, error: { code: -31003, message: "Transaction not found" }
        });
        const {
            create_time, perform_time, cancel_time, transaction, state, reason
        } = payment.params;
        return c(ctx, {
            id: body.id,
            result: { create_time, perform_time, cancel_time, transaction, state, reason }
        });
    },

    async getStatement(ctx, body){
        const { from, to } = body.params;
        const payments = await PaymentService.find();
        if(!payments.length){
            return c(ctx, {
                id: body.id,
                result: { transactions: payments }
            });
        }
        let payment = [];
        for(let i = 0; i < payments.length; i++){
           if(from <= payments[i].params.time && payments[i].params.time <= to){
                payment.push(payments[i].params);
           } 
        }
        return c(ctx, {
            id: body.id,
            result: { transactions: payment }
        });
    },

    async changePassword(ctx, body){
        // let data = body.params.password;
        // let path = '../../../../utils/payme.txt';
        
        // fs.access(path, fs.F_OK, (err) => {
        //     if(err) debLog.debug(`File does not exist - ${err}`);

            
        // }, 
         
        // fs.writeFile(, data, (err) => { 
        //     if (err) return c(ctx, {
        //         id: body.id,
        //         result: null,
        //         error: 
        //         { code: -32504, message: "Not enough privileges to execute method." }
        //     })  
        // }) 
    }
}