import { User } from '../../users';
import { UserService } from '../../users/services';
import issueTokenPair from '../../../helpers/issueTokenPair'; 
import { TokenService } from '../services';

export default {
    async refresh(ctx){
        const { refreshToken } = ctx.request.body;

        const dbToken = await TokenService.findToken({ token: refreshToken });
        if(!dbToken){
            return;
        }   
        const user = await UserService.findOne({ email: dbToken.email });
        await TokenService.removeToken({
            token: `${refreshToken}`
        });

        ctx.body = await issueTokenPair(dbToken.email, user._id);
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
        await UserService.updateUser({ status: 0 }, ctx.state.user);

        ctx.body = { success: true };
    },
}