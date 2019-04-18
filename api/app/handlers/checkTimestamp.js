import timestamp from '../helpers/timestamp';

export default () => async (ctx, next) => {
    const { state: { user } } = ctx;

    if(user){
        try{
            if(user.role !== 'student') await timestamp(user);
        }catch(ex){
            ctx.throw(404, { message: `Error on checking timestamp` });
        }
    }
    await next();
}