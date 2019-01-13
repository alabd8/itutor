import app from './app';
import { PORT } from './config';
import { errLog } from './utils/logs/logger';

const server = app.listen(PORT, (err) => {
	if (err) errLog.error(err);
  
	console.log(`Itutor Server running on port: ${PORT}`);
  });

export default server;


// ---- TESTING ----
// function createApp(){
// 	return app;
// }

// if(!module.parent){
// 	createApp().listen(PORT, (err) => {
// 		if(err) console.log(err);
// 		console.log(`Server started on port \'${PORT}\'`);
// 	})
// }

// export default createApp;