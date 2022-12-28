import { games } from '@prisma/client';
import { GamesService } from './games.service';
import RequestWithUser from 'src/interfaces/requestUser.interface';
export declare class GamesController {
    private gameservice;
    constructor(gameservice: GamesService);
    getgames(): Promise<games[]>;
    getme(req: RequestWithUser): Promise<{
        gameswon: games[];
        gameslost: games[];
    }>;
    ddd(req: RequestWithUser): Promise<void>;
    getwins(req: RequestWithUser): Promise<{
        gameslost: games[];
    }>;
    getloses(req: RequestWithUser): Promise<{
        gameslost: games[];
    }>;
    getl(req: RequestWithUser, id: string): Promise<"syntax error" | "game created">;
}
