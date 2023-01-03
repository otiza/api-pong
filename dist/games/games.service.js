"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesService = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const prisma_service_1 = require("../prisma.service");
const users_service_1 = require("../users/users.service");
let GamesService = class GamesService {
    constructor(userservice, authservice, prismaservice) {
        this.userservice = userservice;
        this.authservice = authservice;
        this.prismaservice = prismaservice;
        this.index = 0;
        this.gamesliv = new Map();
    }
    gametolive(game) {
        this.gamesliv.set(this.index, game);
        const a = this.index;
        this.index++;
        console.log(this.gamesliv.get(a));
        return a;
    }
    livenow() {
        const live = [];
        for (const it of this.gamesliv.values())
            live.push(it);
        return live;
    }
    async getfromcookie(cookie) {
        const a = cookie.substring(4, cookie.length);
        const ret = this.authservice.userinfo(a);
        const id = await this.prismaservice.user.findUnique({
            where: { Userid: ret },
        });
        return id.username;
    }
    updatescore(id, score1, score2, round) {
        this.gamesliv.get(id).rounds1 = round[0];
        this.gamesliv.get(id).rounds2 = round[1];
        this.gamesliv.get(id).score1 = score1;
        this.gamesliv.get(id).score2 = score2;
    }
    async getwins(User) {
        const me = await this.prismaservice.user.findUnique({
            where: { Userid: User },
            include: {
                gameswon: true,
            },
        });
        me.gameswon.forEach((element) => this.changeidtome(element, User));
        const games = {
            gameslost: me.gameswon,
        };
        return games;
    }
    async getlose(User) {
        const me = await this.prismaservice.user.findUnique({
            where: { Userid: User },
            include: {
                gameslost: true,
            },
        });
        me.gameslost.forEach((element) => this.changeidtome(element, User));
        const games = {
            gameslost: me.gameslost,
        };
        return games;
    }
    changeidtome(game, id) {
        if (game.winnerid === id)
            game.winnerid = 'me';
        if (game.loserid === id)
            game.winnerid = 'me';
    }
    async getuserhist(name) {
        const gameswon = await this.prismaservice.user.findUnique({
            where: {
                username: name,
            },
            select: {
                gameswon: {
                    orderBy: {
                        playedat: 'asc',
                    },
                },
            },
        });
        const gamesLost = await this.prismaservice.user.findUnique({
            where: {
                username: name,
            },
            select: {
                gameslost: {
                    orderBy: {
                        playedat: 'asc',
                    },
                },
            },
        });
        const games = gameswon.gameswon.concat(gamesLost.gameslost);
        const sortedGames = games.sort((game1, game2) => {
            const date1 = new Date(game1.playedat);
            const date2 = new Date(game2.playedat);
            return date2 - date1;
        });
        return sortedGames;
    }
    async gamhistory(User) {
        const gameswon = await this.prismaservice.user.findUnique({
            where: {
                Userid: User,
            },
            select: {
                gameswon: {
                    orderBy: {
                        playedat: 'asc',
                    },
                },
            },
        });
        const gamesLost = await this.prismaservice.user.findUnique({
            where: {
                Userid: User,
            },
            select: {
                gameslost: {
                    orderBy: {
                        playedat: 'asc',
                    },
                },
            },
        });
        const games = gameswon.gameswon.concat(gamesLost.gameslost);
        const sortedGames = games.sort((game1, game2) => {
            const date1 = new Date(game1.playedat);
            const date2 = new Date(game2.playedat);
            return date2 - date1;
        });
        return sortedGames;
    }
    async checkwinachivements(user) {
        const achieved = { aId: '', name: '', desc: '' };
        if (user.gameswon.length >= 15) {
            achieved.name = 'win15';
        }
        else if (user.gameswon.length >= 10) {
            achieved.name = 'win10';
        }
        else if (user.gameswon.length >= 5) {
            achieved.name = 'win5';
        }
        await this.prismaservice.achievement.update({
            where: { name: achieved.name },
            data: { claimedby: { connect: { Userid: user.Userid } } },
        });
    }
    async checkleaderachivements(user) {
        const achieved = { aId: '', name: '', desc: '' };
        const myleader = await this.getmyleader(user.Userid);
        console.log('we here');
        if (myleader.rank <= 1) {
            console.log('im top1');
            achieved.name = 'top1';
        }
        else if (myleader.rank <= 5) {
            achieved.name = 'top5';
        }
        else if (user.gameswon.length <= 10) {
            achieved.name = 'top10';
        }
        await this.prismaservice.achievement.update({
            where: { name: achieved.name },
            data: { claimedby: { connect: { Userid: user.Userid } } },
        });
    }
    async updateachievements(p1) {
        const user = await this.prismaservice.user.findUnique({
            where: {
                username: p1,
            },
            include: {
                gameswon: true,
                gameslost: true,
                achivements: true,
            },
        });
        this.checkwinachivements(user);
    }
    async pushgame(game, indx) {
        this.gamesliv.delete(indx);
        const done = await this.prismaservice.games.create({
            data: {
                Scorewin: game.scorewin,
                Scorelose: game.scorelose,
                winner: { connect: { username: game.winnerid } },
                loser: { connect: { username: game.loserid } },
            },
        });
        await this.updateachievements(game.winnerid);
    }
    async leaderboard() {
        const leader = await this.prismaservice.user.findMany({
            include: { gameswon: true, gameslost: true },
        });
        const Leaderboard = leader
            .sort((a, b) => {
            return b.gameswon.length - a.gameswon.length;
        })
            .map((user) => {
            return {
                Userid: user.Userid,
                email: user.email,
                username: user.username,
                gameswon: user.gameswon.length,
                gameslost: user.gameslost.length,
                avatar: user.avatar,
            };
        });
        return Leaderboard;
    }
    async getmyleader(id) {
        const username = (await this.prismaservice.user.findUnique({
            where: {
                Userid: id,
            },
        })).username;
        const a = await this.leaderboard();
        const user = a.find((u) => u.username === username);
        const index = a.findIndex((u) => u.username === username);
        return {
            username: user.username,
            gameswon: user.gameswon,
            gameslost: user.gameslost,
            avatar: user.avatar,
            rank: index + 1,
        };
    }
    async getall() {
        return await this.prismaservice.games.findMany({});
    }
};
GamesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_service_1.AuthService,
        prisma_service_1.PrismaService])
], GamesService);
exports.GamesService = GamesService;
//# sourceMappingURL=games.service.js.map