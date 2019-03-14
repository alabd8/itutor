import issueTokenPair from './issueTokenPair';

import { UserService } from '../modules/users/services';
import { TokenService } from '../modules/tokens/services';

export default async (img, newData, user, ctx) => {
    if(!img){ 
        const updatedUser = await UserService.updateUser(newData, user);
        await TokenService.removeTokens({ email: updatedUser.email });
        ctx.body = { data: updatedUser,
                     tokens: await issueTokenPair(updatedUser.email, updatedUser._id) };
    }else{
        newData.img = img;
        const updatedUser = await UserService.updateUser(newData, user);
        await TokenService.removeTokens({ email: updatedUser.email });				
        ctx.body = { data: updatedUser, 
                     tokens: await issueTokenPair(updatedUser.email, updatedUser._id) };
    }
}