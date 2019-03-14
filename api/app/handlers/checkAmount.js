import { User } from '../modules/users';
import checkTimestamp from '../helpers/timestamp';

export default () => async (ctx, next) => {
    const {
        state: {
            user
        }
    } = ctx;

    if(user){
        try{
            if(user.role !== 'student'){
                await checkTimestamp(user, User, next);
            }
        }catch(ex){
            ctx.throw(404, { message: `${ex}` });
        }
    }

    await next();

}