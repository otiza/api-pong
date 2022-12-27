import { Controller, Get, HttpException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { games, User } from '@prisma/client';

import { GamesService } from './games.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import RequestWithUser from 'src/interfaces/requestUser.interface';
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
}
