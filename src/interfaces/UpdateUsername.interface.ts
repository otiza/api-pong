
import { Request } from 'express';
import { updateUsername } from 'src/users/dto/CreateUser.input';
import { User } from '../../node_modules/.prisma/client';
interface UpdateUsernameRequest extends Request {
  user: User;
 
}
export default UpdateUsernameRequest;