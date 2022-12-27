import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { Game, gametodatabase } from './games.gateway';
import { games } from '@prisma/client';
export declare class GamesService {
    private userservice;
    private authservice;
    private prismaservice;
    constructor(userservice: UsersService, authservice: AuthService, prismaservice: PrismaService);
    gametolive(game: Game): Promise<void>;
    getfromcookie(cookie: string): string;
    getwins(User: string): Promise<{
        gameslost: games[];
    }>;
    getlose(User: string): Promise<{
        gameslost: games[];
    }>;
    changeidtome(game: games, id: string): void;
    gamhistory(User: string): Promise<{
        gameswon: games[];
        gameslost: games[];
    }>;
    pushgame(game: gametodatabase): Promise<void>;
    getall(): Promise<games[]>;
}
