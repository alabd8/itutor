import setCtx from '../../../helpers/setCtx';

export default async (ctx, titles) => {
	const {
		request: {
			body: {
				data,
			}
		}
	} = ctx;
	
	switch(data){
		case 'languages': 	return await setCtx(ctx, titles.languages);
						  	break;
		case 'sciences':  	return await setCtx(ctx, titles.sciences);
						  	break;
		case 'information': return await setCtx(ctx, titles.information);
							break;
		case 'prof': 		return await setCtx(ctx, titles.prof);
						  	break;
		case 'extra': 		return await setCtx(ctx, titles.extra);
						  	break;
		case 'сreative': 	return await setCtx(ctx, titles.сreative);
						  	break;
		case 'combined': 	return await setCtx(ctx, titles.combined);
						  	break;
		case 'unpaid': 		return await setCtx(ctx, titles.unpaid);
							break;
		default: 			ctx.throw(400, 'Error. Invalid data type');
							break;
	};
};