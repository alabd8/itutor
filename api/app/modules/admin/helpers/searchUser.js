import { UserService } from '../../users/services';

function iterate(arr){
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

export default async (data) => {
    if(data === 'getCenters'){
        const lcs = await UserService.find({ role: 'center' });
        
        return iterate(lcs);
    }
    if(data === 'getTutors'){
        const tutors = await UserService.find({ role: 'tutor' });
        
        return iterate(tutors); 
    }
    if(data === 'getUsers'){
        const students = await UserService.find({ role: 'student' });

        return iterate(students);
    }if(data === 'getModerators'){
        const moderators = await UserService.find({ role: 'moderator' });

        return iterate(moderators);
    }
    if(data === 'getAdmins'){
        const moderators = await UserService.find({ role: 'admin' });

        return iterate(moderators);
    }else{
        throw new AppError({ status: 400, message: 'Error on validating user' });
    }
}