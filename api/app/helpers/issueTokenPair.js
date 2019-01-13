import jwtService from '../services/jwt-service';
import { TokenService } from '../modules/tokens/services';

export default async (email, id) => {
    const token = await jwtService.genToken({ email });
    const refreshToken = await jwtService.refreshToken();

	await TokenService.add({ email, token: `${refreshToken}${id}` });

    return {
        token,
        refreshToken
    };
}