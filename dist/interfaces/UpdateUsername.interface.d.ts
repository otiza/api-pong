import { Request } from 'express';
import { User } from '../../node_modules/.prisma/client';
interface UpdateUsernameRequest extends Request {
    user: User;
}
export default UpdateUsernameRequest;
