import { Injectable } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User, userconfig } from '../../node_modules/.prisma/client';
import { UsersService } from 'src/users/users.service';

import { Game, gametodatabase } from './games.gateway';

import { games, achievement } from '@prisma/client';
import internal from 'stream';
import { getSqljsManager } from 'typeorm';
import { identity } from 'rxjs';
import { disconnect } from 'process';
interface gametolife {
  p1: string;
  p2: string;
  score1: number;
  score2: number;
  rounds1: number;
  rounds2: number;
}

@Injectable()
export class GamesService {
  constructor(
    private userservice: UsersService,
    private authservice: AuthService,
    private prismaservice: PrismaService,
  ) {}
  index = 0;
  gamesliv = new Map<number, gametolife>();
  gametolive(game: gametolife): number {
    this.gamesliv.set(this.index, game);
    const a = this.index;
    this.index++;
    console.log(this.gamesliv.get(a));

    return a;
  }
  livenow(): gametolife[] {
    const live: gametolife[] = [];
    for (const it of this.gamesliv.values()) live.push(it);
    return live;
  }
  async getfromcookie(cookie: string): Promise<string> {
    const a = cookie.substring(4, cookie.length);
    const ret = this.authservice.userinfo(a);
    const id = await this.prismaservice.user.findUnique({
      where: { Userid: ret },
    });

    return id.username;
  }
  updatescore(id: number, score1: number, score2: number, round: number[]) {
    this.gamesliv.get(id).rounds1 = round[0];
    this.gamesliv.get(id).rounds2 = round[1];
    this.gamesliv.get(id).score1 = score1;
    this.gamesliv.get(id).score2 = score2;
  }
  async getwins(User: string) {
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
  async getlose(User: string) {
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
  changeidtome(game: games, id: string) {
    if (game.winnerid === id) game.winnerid = 'me';
    if (game.loserid === id) game.winnerid = 'me';
  }
  async getuserhist(name: string){
    const gameswon = await this.prismaservice.user.findUnique({
      where: {
        username: name,
      },
      select: {
        gameswon: {
          orderBy: {
            playedat: 'asc', // or 'desc' for descending order
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
            playedat: 'asc', // or 'desc' for descending order
          },
        },
      },
    });
    const games = gameswon.gameswon.concat(gamesLost.gameslost);
    const sortedGames = games.sort((game1, game2) => {
      const date1: any = new Date(game1.playedat);
      const date2: any = new Date(game2.playedat);
      return date2 - date1; // or date2 - date1 for descending order
    });
    return sortedGames;
  }
  async gamhistory(User: string) {
    const gameswon = await this.prismaservice.user.findUnique({
      where: {
        Userid: User,
      },
      select: {
        gameswon: {
          orderBy: {
            playedat: 'asc', // or 'desc' for descending order
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
            playedat: 'asc', // or 'desc' for descending order
          },
        },
      },
    });
    const games = gameswon.gameswon.concat(gamesLost.gameslost);
    const sortedGames = games.sort((game1, game2) => {
      const date1: any = new Date(game1.playedat);
      const date2: any = new Date(game2.playedat);
      return date2 - date1; // or date2 - date1 for descending order
    });
    return sortedGames;
  }
  async checkwinachivements(user: any) {
    const achieved: achievement = { aId: '', name: '', desc: '' };
    if (user.gameswon.length >= 15) {
      achieved.name = 'win15';
    } else if (user.gameswon.length >= 10) {
      achieved.name = 'win10';
    } else if (user.gameswon.length >= 5) {
      achieved.name = 'win5';
    }
    await this.prismaservice.achievement.update({
      where: { name: achieved.name },
      data: { claimedby: { connect: { Userid: user.Userid } } },
    });
  }
  /*async isleaderachieved(user: any){
    const a = user.achievement.find((a) => {
      a.name === 'top1';
    });
    if (a) return 1;
    const b = user.achievement.find((a) => {
      a.name === 'top2';
    });
    if (b) return 2;
    const c = user.achievement.find((a) => {
      a.name === 'top3';
    });
    if (c) return 3;
    return 4;
  }*/
  async checkleaderachivements(user: any) {
    const achieved: achievement = { aId: '', name: '', desc: '' };
    const myleader = await this.getmyleader(user.Userid);
    console.log('we here');
    if (myleader.rank <= 1) {
      console.log('im top1');
      achieved.name = 'top1';
    } else if (myleader.rank <= 5) {
      achieved.name = 'top5';
    } else if (user.gameswon.length <= 10) {
      achieved.name = 'top10';
    }

    await this.prismaservice.achievement.update({
      where: { name: achieved.name },
      data: { claimedby: { connect: { Userid: user.Userid } } },
    });
  }
  async updateachievements(p1: string) {
    const user: User = await this.prismaservice.user.findUnique({
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
    //this.checkleaderachivements(user);
  }
  async pushgame(game: gametodatabase, indx: number) {
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
  async getmyleader(id: string) {
    const username = (
      await this.prismaservice.user.findUnique({
        where: {
          Userid: id,
        },
      })
    ).username;
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
  async getall(): Promise<games[]> {
    return await this.prismaservice.games.findMany({});
  }
}
