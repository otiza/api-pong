import { Request } from 'express';
import { User } from '../../node_modules/.prisma/client';
interface RequestWithUser extends Request {
    user: User;
}
export default RequestWithUser;
