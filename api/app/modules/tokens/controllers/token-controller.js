import findUser from '../../../helpers/findUser';
import issueTokenPair from '../../../helpers/issueTokenPair'; 
import { TokenService } from '../services';

export default {
    async refresh(ctx){
        const { refreshToken } = ctx.request.body;

        const dbToken = await TokenService.findToken({ token: refreshToken });
        if(!dbToken){
            return;
        }

        const exist = await findUser(dbToken.email);

        await TokenService.removeToken({
            token: `${refreshToken}`
        });

        ctx.body = await issueTokenPair(dbToken.email, exist._id);
    },

    async logout(ctx){
        const {
            state: {
                user: {
                    email
                }
            }
        } = ctx;

        await TokenService.removeTokens({ email });

        ctx.body = { success: true };
    },
}