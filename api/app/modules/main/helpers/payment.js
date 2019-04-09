import payment from './payment/mthd';

export default async (ctx, body = null) => {
    if (!body) {
        ctx.status = 408;
        ctx.body = { message: `Body does not exist` };
    } else {
        try {
            switch (body.method) {
                case 'CheckPerformTransaction':
                    return await payment.checkPerformTransaction(ctx, body);
                case 'CreateTransaction':
                    return await payment.createTransaction(ctx, body);
                case 'PerformTransaction':
                    return await payment.performTransaction(ctx, body);
                case 'CancelTransaction':
                    return await payment.cancelTransaction(ctx, body);
                case 'CheckTransaction':
                    return await payment.checkTransaction(ctx, body);
                case 'GetStatement':
                    return await payment.getStatement(ctx, body);
                default: break;
            }
        } catch (e) {
            ctx.status = 200;
            ctx.body = { message: e.message };
        }
    }
}
