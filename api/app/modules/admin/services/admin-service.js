import { User } from '../../users';
import { LC } from '../../lcs';
import { Tutor } from '../../tutors';
// import { Moderator } from '../../moderators';

// export default {
// 	async findByStatus(){
// 		const [ user, lc, tutor, moderators ] = await Promise.all([
// 			User.find(),
// 			LC.find(),
// 			Tutor.find(),
// 			// Moderator.find(),
// 		]);

// 		return [{ users: user.email }, { centers: lc.email }, { tutors: tutor.email }];
// 	},
// };