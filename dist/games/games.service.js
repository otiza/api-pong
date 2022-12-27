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
    }
    async gametolive(game) {
        console.log(" we are in a live game");
    }
    getfromcookie(cookie) {
        console.log("getfromcookie");
        var a = cookie.substring(4, cookie.length);
        var ret = this.authservice.userinfo(a);
        return (ret);
    }
    async getwins(User) {
        const me = await this.prismaservice.user.findUnique({
            where: { Userid: User },
            include: {
                gameswon: true,
            }
        });
        me.gameswon.forEach(element => this.changeidtome(element, User));
        const games = {
            gameslost: me.gameswon
        };
        return games;
    }
    async getlose(User) {
        const me = await this.prismaservice.user.findUnique({
            where: { Userid: User },
            include: {
                gameslost: true,
            }
        });
        me.gameslost.forEach(element => this.changeidtome(element, User));
        const games = {
            gameslost: me.gameslost
        };
        return games;
    }
    changeidtome(game, id) {
        console.log(game);
        if (game.winnerid === id)
            game.winnerid = "me";
        if (game.loserid === id)
            game.winnerid = "me";
    }
    async gamhistory(User) {
        const me = await this.prismaservice.user.findUnique({
            where: { Userid: User },
            include: {
                gameslost: true,
                gameswon: true,
            }
        });
        me.gameslost.forEach(element => this.changeidtome(element, User));
        const games = {
            gameswon: me.gameslost,
            gameslost: me.gameswon
        };
        return games;
    }
    async pushgame(game) {
        const winner = await this.prismaservice.user.findUnique({
            where: { Userid: game.winnerid },
        });
        const loser = await this.prismaservice.user.findUnique({
            where: { Userid: game.loserid },
        });
        console.log("the users to push");
        console.log(winner);
        console.log(loser);
        const done = await this.prismaservice.games.create({
            data: {
                Scorewin: game.scorewin,
                Scorelose: game.scorelose,
                winner: { connect: { Userid: winner.Userid } },
                loser: { connect: { Userid: loser.Userid } },
            }
        });
        console.log("game ended and saved to database");
    }
    async getall() {
        return await this.prismaservice.games.findMany();
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