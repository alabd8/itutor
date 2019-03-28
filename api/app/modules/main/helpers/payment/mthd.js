import { SUM } from '../../constants';
import { UserService } from '../../../users/services';

async function c(ctx, obj) {
    ctx.status = 200;
    ctx.body = obj;

    return ctx;
}

export default {
    async checkPerformTransaction(ctx, body = null) {
        console.log("MEME 1");
        let user = await UserService.findOne({ uniqueID: body.params.account.itutor });

        if (!user) {
            console.log("MEME 2");

            return await c(ctx, { "jsonrpc": "2.0", "Error": -31050 });
        }
        if (!user.params.state) {
            console.log("MEME 3");

            return await c(ctx, { "jsonrpc": "2.0", "Error": -31055 });
        }
        if (body.params.amount < SUM) {
            console.log("MEME 4");

            return await c(ctx, { "jsonrpc": "2.0", "Error": -31001 });
        }

        console.log("MEME 5");

        return await c(ctx, { "jsonrpc": "2.0", "allow": 1 });
    },

    // async 
}