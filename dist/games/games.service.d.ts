import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { gametodatabase } from './games.gateway';
import { games } from '@prisma/client';
interface gametolife {
    p1: string;
    p2: string;
    score1: number;
    score2: number;
    rounds1: number;
    rounds2: number;
}
export declare class GamesService {
    private userservice;
    private authservice;
    private prismaservice;
    constructor(userservice: UsersService, authservice: AuthService, prismaservice: PrismaService);
    index: number;
    gamesliv: Map<number, gametolife>;
    gametolive(game: gametolife): number;
    livenow(): gametolife[];
    getfromcookie(cookie: string): Promise<string>;
    updatescore(id: number, score1: number, score2: number, round: number[]): void;
    getwins(User: string): Promise<{
        gameslost: games[];
    }>;
    getlose(User: string): Promise<{
        gameslost: games[];
    }>;
    changeidtome(game: games, id: string): void;
    getuserhist(name: string): Promise<games[]>;
    gamhistory(User: string): Promise<games[]>;
    checkwinachivements(user: any): Promise<void>;
    checkleaderachivements(user: any): Promise<void>;
    updateachievements(p1: string): Promise<void>;
    pushgame(game: gametodatabase, indx: number): Promise<void>;
    leaderboard(): Promise<{
        Userid: string;
        email: string;
        username: string;
        gameswon: number;
        gameslost: number;
        avatar: string;
    }[]>;
    getmyleader(id: string): Promise<{
        username: string;
        gameswon: number;
        gameslost: number;
        avatar: string;
        rank: number;
    }>;
    getall(): Promise<games[]>;
}
export {};
