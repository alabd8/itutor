import { UserService, PaymentService } from "../../users/services";

export default async (ctx, data, person) => {
    const user = await UserService.updateUser(data, person);
	const payment = await PaymentService.find({ userHash: user.hash, 
												id: user.uniqueID });
    if(payment.length > 0){
        for(let i = 0; i < payment.length; i++){
            if(payment[i].params.state == 1){
                ctx.status = 200;
                ctx.body = { message: 'success' };
                return ctx;
            }
        }	
    }
    await PaymentService.createPayment({ userHash: user.hash, id: user.uniqueID,  
                                         params: { state: user.pay_state } });
    ctx.status = 200;
    ctx.body = { message: 'success' };
    return ctx;
}