import { games } from '@prisma/client';
import { GamesService } from './games.service';
import RequestWithUser from 'src/interfaces/requestUser.interface';
export declare class GamesController {
    private gameservice;
    constructor(gameservice: GamesService);
    getgames(): Promise<games[]>;
    live(): Promise<any>;
    getme(req: RequestWithUser): Promise<games[]>;
    ddd(req: RequestWithUser): Promise<void>;
    getachievements(name: string): Promise<games[]>;
    getwins(req: RequestWithUser): Promise<{
        gameslost: games[];
    }>;
    getloses(req: RequestWithUser): Promise<{
        gameslost: games[];
    }>;
    gev(req: RequestWithUser): Promise<{
        username: string;
        gameswon: number;
        gameslost: number;
        avatar: string;
        rank: number;
    }>;
    getl(req: RequestWithUser, id: string): Promise<"syntax error" | "game created">;
    getleader(): Promise<{
        Userid: string;
        email: string;
        username: string;
        gameswon: number;
        gameslost: number;
        avatar: string;
    }[]>;
}
