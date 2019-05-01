export default function setParamsForImage(ctx){	
	if(!ctx.request.files || !ctx.request.files.img){
		return false;
	}
	const file = ctx.request.files.img;

	if(file.type === 'image/jpeg' || file.type === 'image/png'){
		return {
			fileName: file.path.slice(-43), 
			type : file.type,
			path : file.path.slice(-54),
			lastModifiedDate : file.lastModifiedDate 
		};	
	}else{
		ctx.throw(400, `Error. Cannot read the file format`);
	}
	
};