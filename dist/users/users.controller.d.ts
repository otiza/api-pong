import { HttpException } from '@nestjs/common';
import { block, follow, userconfig } from '../../node_modules/.prisma/client';
import RequestWithUser from 'src/interfaces/requestUser.interface';
import { UsersService } from './users.service';
import { User } from '../../node_modules/.prisma/client';
import { CreateUser } from './dto/CreateUser.input';
export declare class UsersController {
    private userService;
    constructor(userService: UsersService);
    getall(): Promise<User[]>;
    getuserbyname(name: string): Promise<User>;
    getuserbyid(id: string): Promise<User>;
    getuserbyemail(email: string): Promise<User>;
    enable2FA(req: RequestWithUser): Promise<boolean | userconfig>;
    disable2FA(req: RequestWithUser): Promise<boolean | userconfig>;
    getme(req: RequestWithUser): Promise<User>;
    create(user: CreateUser): Promise<User>;
    getf(req: RequestWithUser): Promise<follow[]>;
    getfol(req: RequestWithUser): Promise<follow[]>;
    getblocks(req: RequestWithUser): Promise<block[]>;
    getblockers(req: RequestWithUser): Promise<block[]>;
    unblockuser(req: RequestWithUser, id: string): Promise<HttpException>;
    blockuser(req: RequestWithUser, id: string): Promise<HttpException>;
    unfollow(req: RequestWithUser, id: string): Promise<HttpException>;
    follow(req: RequestWithUser, id: string): Promise<HttpException>;
    fakepop(): Promise<string>;
    dalateall(): Promise<void>;
}
