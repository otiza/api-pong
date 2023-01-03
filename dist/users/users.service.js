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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const faker_1 = require("@faker-js/faker");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateavatr(filename, id) {
        const done = await this.prisma.user.update({
            where: { Userid: id },
            data: {
                avatar: 'http://localhost:5000/profileimages/' + filename,
            },
        });
        console.log('done');
        console.log(done);
    }
    async userdatalreadyexist(userData) {
        if (await this.findOneByEmail(userData.email))
            return 'email exist';
        return false;
    }
    async Create(userData) {
        const newUser = await this.prisma.user.create({
            data: {
                email: userData.email,
                username: userData.username,
                avatar: userData.avatar,
                userconfig: {
                    create: { is2FA: false },
                },
            },
        });
        return newUser;
    }
    async getAll() {
        return await this.prisma.user.findMany();
    }
    async activate2fa(id) {
        const user = await this.findOneById(id);
        if (!user)
            return false;
        return this.prisma.userconfig.update({
            where: { Userid: user.Userid },
            data: { is2FA: true },
        });
    }
    async deactivate2fa(id) {
        const user = await this.findOneById(id);
        if (!user)
            return false;
        return this.prisma.userconfig.update({
            where: { Userid: user.Userid },
            data: { is2FA: false },
        });
    }
    async findOne() {
        return await this.prisma.user.findMany();
    }
    async genfakeone() {
        const fakeUser = {
            email: faker_1.faker.internet.email(),
            username: faker_1.faker.name.firstName(),
            avatar: faker_1.faker.image.avatar(),
        };
        return fakeUser;
    }
    async faker() {
        const userData = [];
        for (let i = 0; i < 20; i++) {
            userData.push(await this.genfakeone());
        }
        for (let i = 0; i < 20; i++) {
            this.Create(userData[i]);
        }
        return userData;
    }
    async daleteall() {
        await this.prisma.user.deleteMany({});
    }
    async follow(from, to) {
        const userfrom = await this.prisma.user.findUnique({
            where: { Userid: from },
            include: { userconfig: { select: { is2FA: true } } },
        });
        const userto = await this.prisma.user.findUnique({
            where: { Userid: to },
            include: { userconfig: { select: { is2FA: true } } },
        });
        if (await this.isalreadyfollowing(userfrom, userto))
            return false;
        if (await this.isalreadyblocked(userfrom, userto))
            return false;
        if (userfrom && userto) {
            if (await this.prisma.follow.create({
                data: {
                    follower: { connect: { username: userfrom.username } },
                    followed: { connect: { username: userto.username } },
                },
            })) {
                return true;
            }
            else
                return false;
        }
        return true;
    }
    async unfollow(from, to) {
        const userfrom = await this.prisma.user.findUnique({
            where: { Userid: from },
            include: { userconfig: { select: { is2FA: true } } },
        });
        const userto = await this.prisma.user.findUnique({
            where: { Userid: to },
            include: { userconfig: { select: { is2FA: true } } },
        });
        if (!(await this.isalreadyfollowing(userfrom, userto)))
            return false;
        if (userfrom && userto) {
            if (await this.prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId: userfrom.username,
                        followingId: userto.username,
                    },
                },
            })) {
                return true;
            }
            else
                return false;
        }
        return true;
    }
    async unblock(from, to) {
        const userfrom = await this.prisma.user.findUnique({
            where: { Userid: from },
        });
        const userto = await this.prisma.user.findUnique({
            where: { Userid: to },
        });
        if (userfrom && userto) {
            const done = await this.prisma.block.delete({
                where: {
                    blockerId_blockedId: {
                        blockerId: userfrom.username,
                        blockedId: userto.username,
                    },
                },
            });
            if (done)
                return true;
            else
                return false;
        }
        else
            return false;
    }
    async block(from, to) {
        const userfrom = await this.prisma.user.findUnique({
            where: { Userid: from },
        });
        const userto = await this.prisma.user.findUnique({
            where: { Userid: to },
        });
        if (userfrom && userto) {
            if (await this.isalreadyblocked(userfrom, userto))
                return false;
            if (await this.isalreadyfollowing(userfrom, userto))
                await this.unfollow(userfrom.Userid, userto.Userid);
            if (await this.isalreadyfollowing(userto, userfrom))
                await this.unfollow(userto.Userid, userfrom.Userid);
            const done = await this.prisma.block.create({
                data: {
                    blocker: { connect: { username: userfrom.username } },
                    blocked: { connect: { username: userto.username } },
                },
            });
            if (done)
                return true;
            else
                return false;
        }
        else
            return false;
    }
    async findOneById(id) {
        return this.prisma.user.findUnique({
            where: { Userid: id },
            include: { userconfig: { select: { is2FA: true } } },
        });
    }
    async findOneByusername(username) {
        return this.prisma.user.findUnique({
            where: { username: username },
            include: { userconfig: { select: { is2FA: true } } },
        });
    }
    async isalreadyblocked(userfrom, userto) {
        const bloc = await this.prisma.block.findUnique({
            where: {
                blockerId_blockedId: {
                    blockedId: userfrom.username,
                    blockerId: userto.username,
                },
            },
        });
        const blocks = await this.prisma.block.findUnique({
            where: {
                blockerId_blockedId: {
                    blockedId: userto.username,
                    blockerId: userfrom.username,
                },
            },
        });
        if (bloc || blocks)
            return true;
        else
            return false;
    }
    async isalreadyfollowing(userfrom, userto) {
        const follow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userfrom.username,
                    followingId: userto.username,
                },
            },
        });
        if (follow)
            return true;
        else
            return false;
    }
    async getfollowers(id) {
        const user = await this.findOneById(id);
        return await this.prisma.follow.findMany({
            where: { followingId: user.username },
        });
    }
    async getfollows(id) {
        const user = await this.findOneById(id);
        return await this.prisma.follow.findMany({
            where: { followerId: user.username },
            include: {
                followed: true,
            }
        });
    }
    async getblocks(id) {
        const user = await this.findOneById(id);
        return await this.prisma.block.findMany({
            where: { blockerId: user.username },
        });
    }
    async getblockers(id) {
        const user = await this.findOneById(id);
        console.log('blocks');
        return await this.prisma.block.findMany({
            where: { blockedId: user.username },
        });
    }
    async findOneByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email: email },
            include: { userconfig: { select: { is2FA: true } }, achivements: true },
        });
    }
    async getachieved(email) {
        return this.prisma.user.findUnique({
            where: { email: email },
            include: { achivements: true },
        });
    }
    async getuserachieved(name) {
        return this.prisma.user.findUnique({
            where: { username: name },
            include: { achivements: true },
        });
    }
    async updateusername(user, newname) {
        const usernamexist = await this.prisma.user.findUnique({
            where: { username: newname },
        });
        if (usernamexist) {
            return false;
        }
        else
            await this.prisma.user.update({
                where: { Userid: user.Userid },
                data: { username: newname },
            });
        return true;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map