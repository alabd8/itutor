import { User } from '../modules/users';
import { LC } from '../modules/lcs';
import { Tutor } from '../modules/tutors';
import { Admin } from '../modules/admin';

export default async (email) => {
    const [ user, tutor, lc, admin ] = await Promise.all([
        User.findOne({ email }),
        Tutor.findOne({ email }),
        LC.findOne({ email }),
        Admin.findOne({ email })
        // await Moderator.findOne({ email }),
    ]);
    
    const exist = user || tutor || lc || admin;
    
    return exist;
}
