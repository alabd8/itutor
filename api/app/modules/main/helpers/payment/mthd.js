import { SUM, timestamp } from '../../constants';
import { UserService, PaymentService } from '../../../users/services';

function c(ctx, obj) {
    ctx.status = 200;
    ctx.body = obj;

    return ctx;
};

async function create_transaction(ctx, transaction) {
    try {
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

        if (!payment) c(ctx, { "result": { "allow": -31050 } });

        if (!payment.params.state) c(ctx, { "result": { "allow": -31055 } });

        if (body.params.amount < SUM) c(ctx, { "result": { "allow": -31001 } });

        return c(ctx, { "result": { "allow": true } });
    },

    async createTransaction(ctx, body = null) {
        const itutor = body.params.account.itutor;
        if (!itutor) c(ctx, { "result": { "allow": -31050 } });

        let user = await UserService.findOne({ uniqueID: itutor });
        if (!user) c(ctx, { "result": { "allow": -31050 } });

        let transaction = await PaymentService
            .findOne({ userHash: user.hash, id: itutor });

        if (!transaction.payment_id)
            transaction = await PaymentService.updatePayment({ payment_id: body.params.id },
                transaction);
        if (transaction.payment_id != body.params.id) c(ctx, { "result": { "allow": -31008 } });

        if (transaction) {
            if (transaction.params.state != 1) c(ctx, { "result": { "allow": -31008 } });

            const bool = timestamp() <= transaction.time_out;
            if (!bool) {
                await PaymentService.updatePayment({
                    state: -1, reason: 4,
                    payment_id: body.params.id
                }, transaction);
                return c(ctx, { "result": { "allow": -31008 } })
            }
    
            return create_transaction(ctx, transaction);
        } else {
            let bool = await checkPerformTransaction(ctx, body);
            if (!bool) c(ctx, { "result": { "allow": -31050 } });

            return create_transaction(ctx, transaction);
        }
    },
}