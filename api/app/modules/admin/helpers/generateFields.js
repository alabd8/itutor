import pick from 'lodash/pick';

import { User } from '../../users';

export default async (body) => {
    let data = pick(body, User.createFields);
    data.name = 'user';
    data.firstName = 'user';
    data.lastName = 'user';
    data.role = 'moderator';

    return data;
}