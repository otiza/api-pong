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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const users_service_1 = require("./users.service");
const CreateUser_input_1 = require("./dto/CreateUser.input");
let UsersController = class UsersController {
    constructor(userService) {
        this.userService = userService;
    }
    async getall() {
        console.log("called");
        const all = await this.userService.getAll();
        return all;
    }
    async getuserbyname(name) {
        const user = await this.userService.findOneByusername(name);
        if (!user)
            throw new common_1.HttpException('User Not Found', common_1.HttpStatus.NOT_FOUND);
        return user;
    }
    async getuserbyid(id) {
        const user = await this.userService.findOneById(id);
        if (!user)
            throw new common_1.HttpException('User Not Found', common_1.HttpStatus.NOT_FOUND);
        return user;
    }
    async getuserbyemail(email) {
        const user = await this.userService.findOneByEmail(email);
        if (!user)
            throw new common_1.HttpException('User Not Found', common_1.HttpStatus.NOT_FOUND);
        return user;
    }
    async enable2FA(req) {
        const user = await this.userService.findOneByEmail(req.user.email);
        if (!user)
            throw new common_1.HttpException('missing with jwt', common_1.HttpStatus.CONFLICT);
        return this.userService.activate2fa(user.Userid);
    }
    async disable2FA(req) {
        const user = await this.userService.findOneByEmail(req.user.email);
        if (!user)
            throw new common_1.HttpException('missing with jwt', common_1.HttpStatus.CONFLICT);
        return this.userService.deactivate2fa(user.Userid);
    }
    async getme(req) {
        const user = await this.userService.findOneByEmail(req.user.email);
        if (!user)
            throw new common_1.HttpException('are u a user', common_1.HttpStatus.NOT_FOUND);
        return req.user;
    }
    async create(user) {
        const error = await this.userService.userdatalreadyexist(user);
        if (error)
            throw new common_1.HttpException('user already exist', common_1.HttpStatus.CONFLICT);
        return this.userService.Create(user);
    }
    async getf(req) {
        const follow = await this.userService.getfollowers(req.user.Userid);
        return follow;
    }
    async getfol(req) {
        const follow = await this.userService.getfollowed(req.user.Userid);
        return follow;
    }
    async getblocks(req) {
        const block = await this.userService.getblocks(req.user.Userid);
        return block;
    }
    async getblockers(req) {
        const block = await this.userService.getblockers(req.user.Userid);
        return block;
    }
    async unblockuser(req, id) {
        const user = await this.userService.findOneById(id);
        if (!user)
            throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
        const blocked = await this.userService.unblock(req.user.Userid, user.Userid);
        if (blocked)
            return new common_1.HttpException('unblocked', common_1.HttpStatus.ACCEPTED);
        else
            throw new common_1.HttpException('failed', common_1.HttpStatus.CONFLICT);
    }
    async blockuser(req, id) {
        const user = await this.userService.findOneById(id);
        if (!user)
            throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
        const blocked = await this.userService.block(req.user.Userid, user.Userid);
        if (blocked)
            return new common_1.HttpException('blocked', common_1.HttpStatus.ACCEPTED);
        else
            throw new common_1.HttpException('failed', common_1.HttpStatus.CONFLICT);
    }
    async unfollow(req, id) {
        console.log(id);
        console.log(req.user);
        const user = await this.userService.findOneById(id);
        if (user) {
            const sent = await this.userService.unfollow(req.user.Userid, user.Userid);
            if (sent) {
                return new common_1.HttpException('unfollowed', common_1.HttpStatus.ACCEPTED);
            }
        }
        if (!user) {
            throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
        }
        throw new common_1.HttpException('failed', common_1.HttpStatus.CONFLICT);
    }
    async follow(req, id) {
        console.log(id);
        console.log(req.user);
        const user = await this.userService.findOneById(id);
        if (user) {
            const sent = await this.userService.follow(req.user.Userid, user.Userid);
            if (sent) {
                return new common_1.HttpException('followed', common_1.HttpStatus.ACCEPTED);
            }
        }
        if (!user) {
            throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
        }
        throw new common_1.HttpException('failed', common_1.HttpStatus.CONFLICT);
    }
    async fakepop() {
        await this.userService.faker();
        return 'database populated';
    }
    async dalateall() {
        await this.userService.daleteall();
    }
};
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getall", null);
__decorate([
    (0, common_1.Get)('user/username/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getuserbyname", null);
__decorate([
    (0, common_1.Get)('user/id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getuserbyid", null);
__decorate([
    (0, common_1.Get)('user/email/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getuserbyemail", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('user/enable2FA'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "enable2FA", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('user/disable2FA'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "disable2FA", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getme", null);
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUser_input_1.CreateUser]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('followers'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getf", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('follows'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getfol", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('blocks'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getblocks", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('blockers'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getblockers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('unblock/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "unblockuser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('block/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "blockuser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('unfollow/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "unfollow", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('follow/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "follow", null);
__decorate([
    (0, common_1.Get)('fakepop'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "fakepop", null);
__decorate([
    (0, common_1.Get)('deleteall'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "dalateall", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map