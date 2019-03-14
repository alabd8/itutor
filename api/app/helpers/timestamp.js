import pick from 'lodash/pick';

import { debLog, infoLog } from '../utils/logs/logger';
import { PaymentService } from '../modules/users/services';
import { Payment } from '../modules/users';

export default async (user, dbModel) => {
    const date = Date.now();

    if(user.params.time_end >= date){
        let payment = await PaymentService.getPaymentWithPublicFields({ userHash: user.hash });
        
        console.log("PAYMENT------ 1: ", payment);
        if(!payment){

            console.log("PAYMENT------ 2: ");

            payment = {
                ...pick(user, Payment.createFields),
                userHash: user.hash 
            }

            console.log("PAYMENT------ 3: ", payment);

            return await PaymentService.createPayment(payment);
        }
    }

    dbModel.update({ _id: user._id }, { $set: { params: { amount: 0 }}}, { upsert: true }, function(err, doc){
        if (err) return debLog.debug("error: ", err );
        return infoLog.info("succesfully saved");
    });

    return
}   