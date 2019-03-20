import { UserService } from '../../users/services';

async function iterate(arr){
    let on = [], off = [];

    for(let i = 0; i < arr.length; i++){
        if(arr[i].state == 1){
            on.push(arr[i].email);
        }else if(arr[i].state == 0){
            off.push(arr[i].email);
        }
    }

    const all = [{ online: on }, { offline: off }];
    return all;
}

export default async (data, role) => {
    if(data === 'getCenters'){
        const lcs = await UserService.find({ role: 'center' });
        
        return await iterate(lcs);
    }else if(data === 'getTutors'){
        const tutors = await UserService.find({ role: 'tutor' });
        
        return await iterate(tutors); 
    }else if(data === 'getUsers'){
        const students = await UserService.find({ role: 'student' });

        return await iterate(students);
    }else if(data === 'getModerators'){
        const moderators = await UserService.find({ role: 'moderator' });

        return await iterate(moderators);
    }else if(data === 'getAdmins'){
        const moderators = await UserService.find({ role: 'admin' });

        return await iterate(moderators);
    }{
        throw new AppError({ status: 400, message: 'Error on validating user' });
    }
}