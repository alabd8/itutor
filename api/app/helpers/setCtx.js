export default async (ctx, data, type = 'ordinary') => {
	switch(type){
		case 'ordinary': 	ctx.status = 200;
					   		ctx.body = data;
					   		break;
		case 'data': 		ctx.status = 200;
							ctx.body = { data: data };
							break;
		default: 			ctx.throw(400, `Invalid data format`);
							break;
	};
};