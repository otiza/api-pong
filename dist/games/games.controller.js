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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesController = void 0;
const common_1 = require("@nestjs/common");
const games_service_1 = require("./games.service");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const games_gateway_1 = require("./games.gateway");
let GamesController = class GamesController {
    constructor(gameservice) {
        this.gameservice = gameservice;
    }
    async getgames() {
        const game = await this.gameservice.getall();
        return game;
    }
    async live() {
        const live = this.gameservice.livenow();
        return live;
    }
    async getme(req) {
        const history = await this.gameservice.gamhistory(req.user.Userid);
        return history;
    }
    async ddd(req) {
        const history = await this.gameservice.pushgame({
            winnerid: '030cddeb-98b6-47f2-a68b-860fc62171a7',
            loserid: '9aac54d8-d89b-4540-ad8c-97d51c3edb10',
            scorewin: 2,
            scorelose: 1,
        }, null);
        return history;
    }
    async getachievements(name) {
        const history = await this.gameservice.getuserhist(name);
        return history;
    }
    async getwins(req) {
        const history = await this.gameservice.getwins(req.user.Userid);
        return history;
    }
    async getloses(req) {
        const history = await this.gameservice.getlose(req.user.Userid);
        return history;
    }
    async gev(req) {
        const ret = await this.gameservice.getmyleader(req.user.Userid);
        return ret;
    }
    async getl(req, id) {
        const game = new games_gateway_1.gametodatabase();
        if (id == 'win') {
            game.winnerid = req.user.Userid;
            game.loserid = '22c8cb8b-5411-4e36-be40-1267d0abb0ed';
            game.scorewin = 3;
            game.scorelose = 0;
        }
        else if (id == 'lose') {
            game.loserid = req.user.Userid;
            game.winnerid = '22c8cb8b-5411-4e36-be40-1267d0abb0ed';
            game.scorewin = 3;
            game.scorelose = 0;
        }
        else {
            return 'syntax error';
        }
        const history = await this.gameservice.pushgame(game, null);
        return 'game created';
    }
    async getleader() {
        return await this.gameservice.leaderboard();
    }
};
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getgames", null);
__decorate([
    (0, common_1.Get)('live'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "live", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getme", null);
__decorate([
    (0, common_1.Get)('test'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "ddd", null);
__decorate([
    (0, common_1.Get)('history/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getachievements", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('winhistory'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getwins", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('losehistory'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getloses", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('getmyleader'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "gev", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('addgame/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getl", null);
__decorate([
    (0, common_1.Get)('leaderboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getleader", null);
GamesController = __decorate([
    (0, common_1.Controller)('games'),
    __metadata("design:paramtypes", [games_service_1.GamesService])
], GamesController);
exports.GamesController = GamesController;
//# sourceMappingURL=games.controller.js.map