import { SUM, timestamp } from '../../constants';
import { UserService, PaymentService } from '../../../users/services';

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
                    params: { state: 1, create_time: transaction.params.create_time },
                    payment_id: body.params.id, mock_amount: body.params.amount,
                    payment_unique_id: body.id
                }, transaction);
            const pay = payment.params;
            return c(ctx, { id: body.id,
                "result": {
                    "create_time": pay.create_time,
                    "state": pay.state,
                    "transaction": `${pay.transaction}`
                }
            });
        }
        const payment = await PaymentService
            .updatePayment({
                params: { state: 1, create_time: timestamp() },
                payment_id: body.params.id, mock_amount: body.params.amount,
                payment_unique_id: body.id
            }, transaction);
        const pay = payment.params;
        return c(ctx, { id: body.id,
            "result": {
                "create_time": pay.create_time,
                "state": pay.state,
                "transaction": `${pay.transaction}`
            }
        });
    } catch (e) {
        ctx.status = 200;
        ctx.body = { id: body.id, result: null, 
            error: { code: -32400, message: "Internal error" }
        };
    }
};

export default {
    async checkPerformTransaction(ctx, body = null) {
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

        return c(ctx, { id: payment_unique_id, "result": { "allow": true } });
    },

    async createTransaction(ctx, body = null) {
        if (body.params.amount <= SUM)  return c(ctx, {
            id: body.id,
            result: null, error: { code: -31001, message: "Incorrect amount." }
        });

        const itutor = body.params.account.itutor;
        if (!itutor) return c(ctx, {
            id: body.id,
            result: null, error: { code: -31050, message: "Login not found." }
        });

        let user = await UserService.findOne({ uniqueID: itutor });
        if (!user) return c(ctx, {
            id: body.id,
            result: null, error: { code: -31050, message: "Login not found." }
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
                    payment_id: body.params.id,
                    payment_unique_id: body.id
                }, payment);

                return c(ctx, { id: body.id, result: null, 
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

    async performTransaction(ctx, body = null) {
        let payment = await PaymentService.findOne({ payment_id: body.params.id });

        if (!payment) return c(ctx, {
            id: payment.payment_unique_id,
            result: null, error: { code: -31003, message: "Transaction not found" }
        });

        let { state, perform_time, transaction } = payment.params;
        if (state != 1) {
            if (state != 2) return c(ctx, { id: payment.payment_unique_id, result: null, 
                error: { code: -31008, message: "Unable to perform operation." }
            });

            return c(ctx, { id: payment.payment_unique_id,
                "result": { state, perform_time, transaction }
            });
        } else if (state = 1) {
            const bool = timestamp() <= payment.time_out;

            if (!bool) {
                await PaymentService.updatePayment({
                    params: { state: -1, reason: 4 }
                }, payment);
                return c(ctx, { id: payment.payment_unique_id, result: null, 
                    error: { code: -31008, message: "Unable to perform operation." }
                });
            }
            let user = await UserService.findOne({ uniqueID: payment.id });
            let amount = user.amount + payment.mock_amount;
            let a = await UserService.updateUser({ amount }, user);
            payment = await PaymentService.updatePayment({
                amount: payment.mock_amount,
                params: { state: 2, perform_time: timestamp() }
            }, payment);

            let { state, perform_time, transaction } = payment.params;
            return c(ctx, { id: payment.payment_unique_id,
                 "result": { state, perform_time, transaction } 
            });
        }
    },

    async cancelTransaction(ctx, body = null) {
        let payment = await PaymentService.findOne({ payment_id: body.params.id });
        if (!payment) return c(ctx, {
            id: payment.payment_unique_id,
            result: null, error: { code: -31003, message: "Transaction not found" }
        });

        let { state, cancel_time, transaction } = payment.params;
        if (state != 1) {
            if (state != 2) return c(ctx, { id: payment.payment_unique_id,
                "result": { state, cancel_time, transaction } 
            });

            let bool = payment.amount >= SUM;
            if (!bool) return c(ctx, { id: payment.payment_unique_id, result: null, 
                error: { code: -31008, message: "Unable to perform operation." }
            });

            let user = await UserService.findOne({ uniqueID: payment.id });
            bool = payment.amount <= user.amount;
            if (!bool) return c(ctx, { id: payment.payment_unique_id, result: null, 
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

            return c(ctx, { id: payment.payment_unique_id,
                "result": {
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
                    }, amount: 0
                });
            let { state, cancel_time, transaction } = payment.params;
            return c(ctx, { id: payment.payment_unique_id,
                "result": { state, cancel_time, transaction } 
            });
        }
    },

    async checkTransaction(ctx, body = null) {
        const payment = await PaymentService.findOne({ payment_id: body.params.id });
        if (!payment) return c(ctx, {
            id: payment.payment_unique_id,
            result: null, error: { code: -31003, message: "Transaction not found" }
        });
        const {
            create_time, perform_time, cancel_time, transaction, state, reason
        } = payment.params;
        return c(ctx, { id: payment.payment_unique_id,
            "result": { create_time, perform_time, cancel_time, transaction, state, reason }
        });
    },
}