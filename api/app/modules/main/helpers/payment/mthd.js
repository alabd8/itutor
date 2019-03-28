import { SUM } from '../../constants';
import { UserService } from '../../../users/services';

async function c(ctx, obj){
    ctx.status = 200;
    ctx.body = obj;
    
    return ctx;
}

export default {
    async checkPerformTransaction(ctx, body = null){

        let user = await UserService.findOne({ uniqueID: body.params.account.itutor });
        
        if(!user){
            return await c(ctx, { 'Error': -31050 });
        }
        if(!user.params.state){
            return await c(ctx, { 'Error': -31055 });                
        }
        if(body.params.amount < SUM){
            return await c(ctx, { 'Error': -31001 });
        }

        return await c(ctx, { 'allow': 1 });
    },

    // async 
}