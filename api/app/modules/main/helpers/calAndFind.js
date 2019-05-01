import calculate from './cal';
import { UserService } from '../../users/services';

export default async (body) => {
    if(body.coords){
        const coords = calculate(body);

        const objects = await UserService.find(); 
        let result = [];
        let rest = [];
        for(let i = 0; i < objects.length; i++){
            if(objects[i].page.course){
                if(objects[i].page.course.length > 0){
                    for(let j = 0; j < objects[i].page.course.length; j++){
                        if(objects[i].page.course[j].coords.lat && objects[i].page.course[j].coords.long){
                            rest.push(objects[i]);
                            break;
                        }
                    }
                }
            }
        }
        
        for(let i = 0; i < rest.length; i++){
            if(rest[i].page.course.length >= 1){
                for(let j = 0; j < rest[i].page.course.length; j++){
                    if(rest[i].page.course[j].coords.lat <= coords.north && rest[i].page.course[j].coords.lat >= coords.south){
                        if(rest[i].page.course[j].coords.long >= coords.west && rest[i].page.course[j].coords.long <= coords.east){
                            result.push(rest[i].page.course[j]);                        
                        }
                    }
                }
            }
        }
        
        return result;
    }else{
        return [];
    }
}