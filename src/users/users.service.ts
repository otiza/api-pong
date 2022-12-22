import { Injectable } from '@nestjs/common';
import { block, follow, User } from '../../node_modules/.prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Prisma, userconfig } from '../../node_modules/.prisma/client';
import { faker } from '@faker-js/faker';
import { CreateUser } from './dto/CreateUser.input';
import { IsEmail } from 'class-validator';
import { create } from 'domain';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  //creating the users

  async userdatalreadyexist(userData: CreateUser): Promise<string | boolean> {
    if (await this.findOneByEmail(userData.email)) return 'email exist';
    return false;
  }
  async Create(userData: CreateUser): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        userconfig: {
          create: { is2FA: false },
        },
      },
    });
    return newUser;
  }
  //async findUserwithjwt()
  async getAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }
  async activate2fa(id: string): Promise<userconfig | boolean> {
    const user = await this.findOneById(id);
    if (!user) return false;
    return this.prisma.userconfig.update({
      where: { Userid: user.Userid },
      data: { is2FA: true },
    });
  }

  async deactivate2fa(id: string): Promise<userconfig | boolean> {
    const user = await this.findOneById(id);
    if (!user) return false;
    return this.prisma.userconfig.update({
      where: { Userid: user.Userid },
      data: { is2FA: false },
    });
  }

  async findOne(): Promise<User[] | null> {
    return await this.prisma.user.findMany();
  }
  async genfakeone(): Promise<Prisma.UserCreateInput> {
    const fakeUser: Prisma.UserCreateInput = {
      email: faker.internet.email(),
      username: faker.name.firstName(),
    };
    return fakeUser;
  }
  async faker() {
    const userData: Prisma.UserCreateInput[] = [];
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

  // getName(id: number): Promise<String> {
  //   return this.findOne(id).then((user) => user.displayName);
  // }
  /*async getUsername(id: number): Promise<string> {
    return this.findOne(id).then((user) => {
      if (user == null) return '';
      return user.username;
    });
  }*/
  async follow(from: string, to: string): Promise<boolean> {
    const userfrom = await this.prisma.user.findUnique({
      where: { Userid: from },
      include: { userconfig: { select: { is2FA: true } } },
    });
    const userto = await this.prisma.user.findUnique({
      where: { Userid: to },
      include: { userconfig: { select: { is2FA: true } } },
    });
    if (await this.isalreadyfollowing(userfrom, userto)) return false;
    if (await this.isalreadyblocked(userfrom, userto)) return false;
    if (userfrom && userto) {
      if (
        await this.prisma.follow.create({
          data: {
            follower: { connect: { username: userfrom.username } },
            followed: { connect: { username: userto.username } },
          },
        })
      ) {
        return true;
      } else return false;
    }
    return true;
  }
  async unfollow(from: string, to: string): Promise<boolean> {
    const userfrom = await this.prisma.user.findUnique({
      where: { Userid: from },
      include: { userconfig: { select: { is2FA: true } } },
    });
    const userto = await this.prisma.user.findUnique({
      where: { Userid: to },
      include: { userconfig: { select: { is2FA: true } } },
    });
    if (!(await this.isalreadyfollowing(userfrom, userto))) return false;
    if (userfrom && userto) {
      if (
        await this.prisma.follow.delete({
          where: {
            followerId_followingId: {
              followerId: userfrom.username,
              followingId: userto.username,
            },
          },
        })
      ) {
        return true;
      } else return false;
    }
    return true;
  }
  async unblock(from: string, to: string): Promise<boolean> {
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
      if (done) return true;
      else return false;
    } else return false;
  }
  async block(from: string, to: string): Promise<boolean> {
    const userfrom = await this.prisma.user.findUnique({
      where: { Userid: from },
    });
    const userto = await this.prisma.user.findUnique({
      where: { Userid: to },
    });
    if (userfrom && userto) {
      if (await this.isalreadyblocked(userfrom, userto)) return false;
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
      if (done) return true;
      else return false;
    } else return false;
  }
  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { Userid: id },
      include: { userconfig: { select: { is2FA: true } } },
    });
  }
  async findOneByusername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username: username },
      include: { userconfig: { select: { is2FA: true } } },
    });
  }
  async isalreadyblocked(userfrom: User, userto: User): Promise<boolean> {
    const bloc: block = await this.prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockedId: userfrom.username,
          blockerId: userto.username,
        },
      },
    });
    const blocks: block = await this.prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockedId: userto.username,
          blockerId: userfrom.username,
        },
      },
    });
    if (bloc || blocks) return true;
    else return false;
  }
  async isalreadyfollowing(userfrom: User, userto: User): Promise<boolean> {
    const follow: follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userfrom.username,
          followingId: userto.username,
        },
      },
    });
    if (follow) return true;
    else return false;
  }
  async getfollowers(id: string): Promise<follow[] | null> {
    const user: User = await this.findOneById(id);
    console.log('followers');
    return await this.prisma.follow.findMany({
      where: { followingId: user.username },
    });
  }
  async getfollowed(id: string): Promise<follow[] | null> {
    const user: User = await this.findOneById(id);
    console.log('follower');
    return await this.prisma.follow.findMany({
      where: { followerId: user.username },
    });
  }
  async getblocks(id: string): Promise<block[] | null> {
    const user: User = await this.findOneById(id);
    console.log('blocks');
    return await this.prisma.block.findMany({
      where: { blockerId: user.username },
    });
  }
  async getblockers(id: string): Promise<block[] | null> {
    const user: User = await this.findOneById(id);
    console.log('blocks');
    return await this.prisma.block.findMany({
      where: { blockedId: user.username },
    });
  }
  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email },
      include: { userconfig: { select: { is2FA: true } } },
    });
  }
}
