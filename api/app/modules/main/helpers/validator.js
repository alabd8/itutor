import payment from './payment/mthd';

export default async (ctx, body = null) => {
    console.log("VALIDATOR 2");

    if (!body) {
        console.log("VALIDATOR 3");
        ctx.status = 408;
        ctx.body = { message: `Body does not exist` };
    } else {
        try {
            switch (body.method) {
                case 'CheckPerformTransaction':
                    console.log("VALIDATOR 4");
                    return await payment.checkPerformTransaction(ctx, body);
                case 'CreateTransaction':
                    console.log("VALIDATOR 5");
                    return await payment.createTransaction(ctx, body);
                case 'PerformTransaction':
                    console.log("VALIDATOR 6");
                    return await payment.performTransaction(ctx, body);
                case 'CancelTransaction':
                    console.log("VALIDATOR 7");
                    return await payment.cancelTransaction(ctx, body);
                case 'CheckTransaction':
                    console.log("VALIDATOR 8");
                    return await payment.checkTransaction(ctx, body);
                case 'GetStatement':
                    console.log("VALIDATOR 9");
                    return await payment.getStatement(ctx, body);
                case 'ChangePassword':
                    console.log("VALIDATOR 10");
                    return await payment.changePassword(ctx, body);
            }
        } catch (e) {
            ctx.status = 200;
            ctx.body = { message: `Something went wrong. Please try later` };
        }
    }
}
