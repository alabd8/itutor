import { User } from '../modules/users';
import { LC } from '../modules/lcs';
import { Tutor } from '../modules/tutors';
import { Admin } from '../modules/admin';

export default {
    async login(ctx){
        const { email, password } = ctx.request.body;
    
        const [ user, tutor, lc, admin ] = await Promise.all([
            User.findOne({ email }),
            Tutor.findOne({ email }),
            LC.findOne({ email }),
            Admin.findOne({ email })
            // await Moderator.findOne({ email }),
        ]);
        
        const exist = user || tutor || lc || admin;
        
        infoLog.info('Request to - /menu/auth/signin: ', ctx);
    
        if(!exist){
            ctx.throw(403, { message: 'User not found' });
        }
    
        if(!(exist).comparePasswords(password)){
            ctx.throw(403, { message: 'Invalid password' });
        }		
    
        const token = await jwtService.genToken({ email });
        const refreshToken = await jwtService.refreshToken();

	    await TokenService.add({ email, token: `${refreshToken}${id}` });
    
        infoLog.info('Response to - /menu/auth/signin: ', ctx.body);
        
        ctx.status = 200;
        ctx.body = {
            token,
            refreshToken
        };
    }
}