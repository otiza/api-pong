import { Profile } from 'passport';
import { VerifyCallback } from 'passport-oauth2';
import { AuthService } from '../auth.service';
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any>;
}
export {};
