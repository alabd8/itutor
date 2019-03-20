import { UserService } from '../../users/services';

export default {
    async getUser(ctx){
        const {
            state: {
                user: {
                    role, 
                    hash
                }
            }
        } = ctx;

        if(!hash || role !== 'moderator'){
            ctx.throw(403, `Forbidden`);
        }

        const moderator = await UserService.findOne({ hash });

        ctx.body = { user: moderator };
    },

    async requestedCenters(ctx){
        const {
            state: {
                user: {
                    role,
                    hash
                }
            }
        } = ctx;

        if(!hash || role !== 'moderator'){
            ctx.throw(403, `Forbidden`);
        }

        const moderator = await UserService.findOne({ hash });

        ctx.body = { 'Requested Centers ': moderator.requests };
    },

    async centers(ctx){
        const {
            state: {
                user: {
                    role,
                    hash
                }
            },
            request : {
                body: { data }
            }
        } = ctx;

        if(!hash || role !== 'moderator'){
            ctx.throw(403, `Forbidden`);
        }

        const center = await UserService.findOne({ email: data });

        if(center.role !== 'center'){
            ctx.throw(400, 'Error. Getting not center');
        }
        ctx.body = { data: center };
    }
}