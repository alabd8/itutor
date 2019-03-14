import setCtx from '../../../helpers/setCtx'; 


export default async (ctx, user) => {
	try{
		return await setCtx(ctx, { user });
	}catch(ex){
		ctx.throw(404, ...ex);
	}
}