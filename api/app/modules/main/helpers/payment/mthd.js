import { SUM, timestamp } from '../../constants';
import { UserService, PaymentService } from '../../../users/services';

function c(ctx, obj) {
    ctx.status = 200;
    ctx.body = obj;

    return ctx;
};

async function create_transaction(ctx, transaction) {
    try {
        if(transaction.params.create_time){
            const payment = await PaymentService
                .updatePayment({
                    params: { state: 1, create_time: transaction.params.create_time },
                    payment_id: ctx.request.body.params.id
                }, transaction);
            const pay = payment.params;
            return c(ctx, {
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
                payment_id: ctx.request.body.params.id
            }, transaction);
        const pay = payment.params;
        return c(ctx, {
            "result": {
                "create_time": pay.create_time,
                "state": pay.state,
                "transaction": `${pay.transaction}`
            }
        });
    } catch (e) {
        ctx.throw(400, `Sorry. Something went wrong. Try later. ${e}`);
    }
};

export default {
    async checkPerformTransaction(ctx, body = null) {
        let payment = await PaymentService.findOne({ id: body.params.account.itutor });

        if (!payment) return c(ctx, { "result": { "allow": -31050 } });

        if (payment.params.state != 1) return c(ctx, { "result": { "allow": -31055 } });

        if (body.params.amount < SUM) return c(ctx, { "result": { "allow": -31001 } });

        return c(ctx, { "result": { "allow": true } });
    },

    async createTransaction(ctx, body = null) {
        const itutor = body.params.account.itutor;
        if (!itutor) return c(ctx, { "result": { "allow": -31050 } });

        let user = await UserService.findOne({ uniqueID: itutor });
        if (!user) return c(ctx, { "result": { "allow": -31050 } });

        let payment = await PaymentService
            .findOne({ userHash: user.hash, id: itutor });

        if (!payment.payment_id)
            payment = await PaymentService.updatePayment({ payment_id: body.params.id },
                payment);   
        
        // if (payment.payment_id != body.params.id) // одноразовый счет
                // return c(ctx, { "result": { "allow": -31050 } });
        
        if (payment) {
            if (payment.params.state != 1)
                return c(ctx, { "result": { "allow": -31008 } });  

            const bool = timestamp() <= payment.time_out;
            if (!bool) {
                await PaymentService.updatePayment({
                    state: -1, reason: 4,
                    payment_id: body.params.id,
                    mock_amount: body.params.amount
                }, payment);
                
                return c(ctx, { "result": { "allow": -31008 } })
            }

            return create_transaction(ctx, payment);
        } else {
            let bool = await checkPerformTransaction(ctx, body);
            if (!bool)
                return c(ctx, { "result": { "allow": -31050 } });

            return create_transaction(ctx, payment);
        }
    },

    async performTransaction(ctx, body = null){
        let payment = await PaymentService.findOne({ payment_id: body.params.id });

        if(!payment) return c(ctx, { "result": { "allow": -31003 } });

        let { state, perform_time, transaction } = payment.params;
        if(state != 1){
            if(state != 2)  return c(ctx, { "result": { "allow": -31008 } });
            
            return c(ctx, { 
                "result": { state, perform_time, transaction } });
        }else if(state = 1){
            const bool = timestamp() <= payment.time_out;

            if (!bool) {
                let a = await PaymentService.updatePayment({
                    params: { state: -1, reason: 4 } }, payment);
                return c(ctx, { "result": { "allow": -31008 } })
            }
            payment = await PaymentService.updatePayment({
                amount: payment.mock_amount,
                params: { state: 2, perform_time: timestamp() }
            }, payment);
            
            let { state, perform_time, transaction } = payment.params;
            return c(ctx, { "result": { state, perform_time, transaction } });
        }
    },

    async checkTransaction(ctx, body = null){
        const payment = await PaymentService.findOne({ payment_id: body.params.id });
        if(!payment) return c(ctx, { "result": { "allow": -31003 } });
        const { 
            create_time, perform_time, cancel_time, transaction, state, reason 
        } = payment.params;
        return c(ctx, { 
            "result": { create_time, perform_time, cancel_time, transaction, state, reason } });
    },
}