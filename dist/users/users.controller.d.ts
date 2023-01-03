import { HttpException } from '@nestjs/common';
import { block, follow, userconfig } from '../../node_modules/.prisma/client';
import RequestWithUser from 'src/interfaces/requestUser.interface';
import { UsersService } from './users.service';
import { User } from '../../node_modules/.prisma/client';
import { CreateUser, updateUsername } from './dto/CreateUser.input';
import { Response } from 'express';
import multer from 'multer';
export declare const storage: {
    storage: multer.StorageEngine;
};
export declare const imageFileInterceptor: import("@nestjs/common").Type<import("@nestjs/common").NestInterceptor<any, any>>;
export declare class UsersController {
    private userService;
    constructor(userService: UsersService);
    changeusername(request: RequestWithUser, body: updateUsername): Promise<void>;
    logout(request: RequestWithUser, res: Response): Promise<void>;
    getall(): Promise<User[]>;
    uploadFile(file: any, req: RequestWithUser): Promise<any>;
    getuserbyname(name: string): Promise<User>;
    getuserbyid(id: string): Promise<User>;
    getuserbyemail(email: string): Promise<User>;
    enable2FA(req: RequestWithUser): Promise<boolean | userconfig>;
    disable2FA(req: RequestWithUser): Promise<boolean | userconfig>;
    getme(req: RequestWithUser): Promise<User>;
    getachievements(name: string): Promise<User>;
    getachieved(req: RequestWithUser): Promise<User>;
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
