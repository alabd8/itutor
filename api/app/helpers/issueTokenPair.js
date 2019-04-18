import jwtService from '../services/jwt-service';
import { TokenService } from '../modules/tokens/services';

export default async (email, user) => {
    const token = await jwtService.genToken({ email });
    const refreshToken = await jwtService.refreshToken();

    await TokenService.add({ email, token: `${refreshToken}${user.hash}` });

    return {
        token,
        refreshToken
    };
}