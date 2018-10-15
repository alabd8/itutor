import setCtx from '../../../helpers/setCtx';

export default async (ctx, data, user, titles) => {
	switch(data.course){
		case 'languages': 	return await setCtx(ctx, [{ user: user }, { result: titles.languages }]);
						  	break;
		case 'sciences':  	return await setCtx(ctx, [{ user: user }, { result: titles.sciences }]);
						  	break;
		case 'information': return await setCtx(ctx, [{ user: user }, { result: titles.information }]);
							break;
		case 'prof': 		return await setCtx(ctx, [{ user: user }, { result: titles.prof }]);
						  	break;
		case 'extra': 		return await setCtx(ctx, [{ user: user }, { result: titles.extra }]);
						  	break;
		case 'сreative': 	return await setCtx(ctx, [{ user: user }, { result: titles.сreative }]);
						  	break;
		case 'combined': 	return await setCtx(ctx, [{ user: user }, { result: titles.combined }]);
						  	break;
		case 'unpaid': 		return await setCtx(ctx, [{ user: user }, { result: titles.unpaid }]);
							break;
		default: 			ctx.throw(400, 'Error. Invalid course type');
							break;
	};
};