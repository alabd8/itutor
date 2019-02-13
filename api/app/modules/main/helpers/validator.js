import setCtx from '../../../helpers/setCtx';

export default async (ctx, body = null) => {
    if(body.params && body.method === 'CheckPerformTransaction'){
        await setCtx(ctx, -32504);
    }else{
        ctx.throw(404, 'Invalid data');
    }
}