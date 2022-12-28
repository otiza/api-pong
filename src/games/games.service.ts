import { Injectable } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { Prisma, userconfig } from '../../node_modules/.prisma/client';
import { UsersService } from 'src/users/users.service';
import { Game, gametodatabase } from './games.gateway';
import { games } from '@prisma/client';



//import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GamesService {
  constructor(private userservice: UsersService,
    private authservice: AuthService,
    private prismaservice: PrismaService) {
    
  }
  async gametolive(game : Game){
    console.log(" we are in a live game");
  }
   getfromcookie(cookie: string): string{
  console.log("getfromcookie");
  var a = cookie.substring(4,cookie.length)
  var ret = this.authservice.userinfo(a);
  
  return ( ret);
  
  
 }
 async getwins(User: string)
 {
  const me = await this.prismaservice.user.findUnique({
    where: { Userid: User },
    include : {
      gameswon: true,
    }
  });
  me.gameswon.forEach(element => this.changeidtome(element,User))
  const games = {

    gameslost: me.gameswon
  }
  return games;
 }
 async getlose(User: string)
 {
  const me = await this.prismaservice.user.findUnique({
    where: { Userid: User },
    include : {
      gameslost: true,
    }
  });
  me.gameslost.forEach(element => this.changeidtome(element,User))
  const games = {

    gameslost: me.gameslost
  }
  return games;
 }
 changeidtome(game: games, id: string){
  console.log(game);
  if(game.winnerid === id)
    game.winnerid = "me";
  if(game.loserid === id)
  game.winnerid = "me";
 }
 async gamhistory(User: string)
 {
  const me = await this.prismaservice.user.findUnique({
    where: { Userid: User },
    include : {
      gameslost: true,
      gameswon: true,
    }
  });
  me.gameslost.forEach(element => this.changeidtome(element,User))
  const games = {
    gameswon: me.gameslost,
    gameslost: me.gameswon
  }
  return games;
 }
 async pushgame(game: gametodatabase){

  const done = await this.prismaservice.games.create({
    data: {
      Scorewin: game.scorewin,
      Scorelose: game.scorelose,
      winner: { connect : { Userid: game.winnerid}},
      loser: { connect : { Userid: game.loserid}},
    }
  })

  console.log("game ended and saved to database");


 }

 
 async getall() : Promise<games[]>{
  return await this.prismaservice.games.findMany({include :{ winner :{ select: {username : true}}, loser:{ select: {username : true}},}});
 }
  
}
