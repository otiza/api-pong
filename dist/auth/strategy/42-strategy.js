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
exports.FortyTwoStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
const auth_service_1 = require("../auth.service");
let FortyTwoStrategy = class FortyTwoStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, '42') {
    constructor(authService) {
        super({
            clientID: 'u-s4t2ud-bb691ee7fbfd3a586f755e8dceb0e16fa9d2ac879097f346e57e7c1cdd8b2c34',
            clientSecret: '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',
            callbackURL: 'http://localhost:5000/auth/42/callback',
            scope: ['public'],
            passReqToCallback: true,
        });
        this.authService = authService;
    }
    async validate(req, accessToken, refreshToken, profile, done) {
        console.log(profile._json.image.link);
        const user = await this.authService.validateUser({
            email: profile.emails == undefined ? '' : profile.emails[0].value,
            username: profile.username,
            avatar: profile._json.image.link == undefined ? '' : profile._json.image.link,
        });
        done(null, user);
    }
};
FortyTwoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], FortyTwoStrategy);
exports.FortyTwoStrategy = FortyTwoStrategy;
//# sourceMappingURL=42-strategy.js.map