import { Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
export type JwtPayload = {
    id: string;
    email: string;
};
declare const JwtAuthStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtAuthStrategy extends JwtAuthStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(payload: JwtPayload): Promise<{
        Userid: string;
        email: string;
    }>;
}
export {};
