import { Controller, Get, HttpException, HttpStatus, Param, Req, UseGuards } from '@nestjs/common';
import { games, User } from '@prisma/client';

import { GamesService } from './games.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import RequestWithUser from 'src/interfaces/requestUser.interface';
import { gametodatabase } from './games.gateway';

@Controller('games')
export class GamesController {
    constructor(private gameservice: GamesService){}
@Get('all')
async getgames(){
    const game : games[] = await this.gameservice.getall();
    console.log (game);
    return game;
}
@UseGuards(JwtAuthGuard)
  @Get('history')
  async getme(@Req() req: RequestWithUser) {
    const history= await this.gameservice.gamhistory(req.user.Userid);
    return history; 
  }
  @Get('test')
  async ddd(@Req() req: RequestWithUser) {
    const history= await this.gameservice.pushgame({
      winnerid: "030cddeb-98b6-47f2-a68b-860fc62171a7",
    loserid: "9aac54d8-d89b-4540-ad8c-97d51c3edb10",
  scorewin: 2,
scorelose: 1});
    return history; 
  }

  @UseGuards(JwtAuthGuard)
  @Get('winhistory')
  async getwins(@Req() req: RequestWithUser) {
    const history= await this.gameservice.getwins(req.user.Userid);
    return history; 
  }
  @UseGuards(JwtAuthGuard)
  @Get('losehistory')
  async getloses(@Req() req: RequestWithUser) {
    const history= await this.gameservice.getlose(req.user.Userid);
    return history; 
  }

  @UseGuards(JwtAuthGuard)
  @Get('addgame/:id')
  async getl(@Req() req: RequestWithUser,@Param('id') id: string) {
    let game : gametodatabase=  new gametodatabase();
    if(id == "win"){
      console.log("wi");
      game.winnerid = req.user.Userid;
    game.loserid= '22c8cb8b-5411-4e36-be40-1267d0abb0ed'
    game.scorewin= 3
    game.scorelose= 0}
    else if(id == "lose"){
      console.log("lose")
      game.loserid = req.user.Userid;
    game.winnerid= '22c8cb8b-5411-4e36-be40-1267d0abb0ed'
    game.scorewin= 3
    game.scorelose= 0}
    else
    {
      return("syntax error");
    }
  const history= await this.gameservice.pushgame(game);
    return "game created"; 
  }
}
