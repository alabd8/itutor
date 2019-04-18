import { debLog, infoLog } from '../utils/logs/logger';
import { timestamp } from '../modules/main/constants';
import { User } from '../modules/users';

export default async (user) => {
    const date = timestamp();
    
    if(user.time_end <= date){
        User.update({ _id: user._id }, { $set: { params: { amount: 0 } } }, { upsert: true }, 
            function(err){
                if (err) return debLog.debug("error: ", err );
                return infoLog.info("succesfully saved");
            }
        );
    }
    return;
}   