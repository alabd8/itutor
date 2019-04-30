import setCtx from '../../../helpers/setCtx';

export default async (ctx, data, user, titles) => {
	switch(data.course){
		case 'languages': 	return await setCtx(ctx, [{ user: user }, { result: titles.languages }]);
						  	
		case 'sciences':  	return await setCtx(ctx, [{ user: user }, { result: titles.sciences }]);
						  	
		case 'information': return await setCtx(ctx, [{ user: user }, { result: titles.information }]);
							
		case 'prof': 		return await setCtx(ctx, [{ user: user }, { result: titles.prof }]);
						  	
		case 'extra': 		return await setCtx(ctx, [{ user: user }, { result: titles.extra }]);
						  	
		case 'сreative': 	return await setCtx(ctx, [{ user: user }, { result: titles.сreative }]);
						  	
		case 'combined': 	return await setCtx(ctx, [{ user: user }, { result: titles.combined }]);
						  	
		case 'unpaid': 		return await setCtx(ctx, [{ user: user }, { result: titles.unpaid }]);
		
		default: 			ctx.throw(400, 'Error. Invalid course type');
							break;
	};
};