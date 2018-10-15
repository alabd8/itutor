import { LCService } from '../../lcs/services';
import { TutorService } from '../../tutors/services';
import { UserService } from '../../users/services';
import setCtx from '../../../helpers/setCtx';

export default async (ctx) => {
	const countedLCs = await LCService.count();
	const countedTutors = await TutorService.count();
	const countedUsers = await UserService.count();

	await setCtx(ctx, [{ lcs: countedLCs }, { tutors: countedTutors }, { users: countedUsers }]);
}