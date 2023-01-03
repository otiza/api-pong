import RequestWithUser from 'src/interfaces/requestUser.interface';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    get42Login(): string;
    get42call(request: RequestWithUser, res: Response): void;
    getlb(request: Request): Promise<void>;
}
