import { JwtService } from '@nestjs/jwt';
import RequestWithUser from 'src/interfaces/requestUser.interface';
import { UsersService } from 'src/users/users.service';
import { User } from '../../node_modules/.prisma/client';
import { CreateUser } from 'src/users/dto/CreateUser.input';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UsersService, jwtService: JwtService);
    validateUser(userinfo: CreateUser): Promise<User>;
    loginUser(request: RequestWithUser): {
        accessToken: string;
    };
    userinfo(payload: string): string;
}
