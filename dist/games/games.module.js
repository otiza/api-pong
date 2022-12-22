"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesModule = void 0;
const common_1 = require("@nestjs/common");
const games_service_1 = require("./games.service");
const games_controller_1 = require("./games.controller");
const games_gateway_1 = require("./games.gateway");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("../auth/auth.service");
const users_module_1 = require("../users/users.module");
let GamesModule = class GamesModule {
};
GamesModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule, users_module_1.UsersModule],
        providers: [games_service_1.GamesService, games_gateway_1.gameGateway, auth_service_1.AuthService],
        controllers: [games_controller_1.GamesController],
    })
], GamesModule);
exports.GamesModule = GamesModule;
//# sourceMappingURL=games.module.js.map