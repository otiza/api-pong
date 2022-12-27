import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  block,
  follow,
  Prisma,
  userconfig,
} from '../../node_modules/.prisma/client';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import RequestWithUser from 'src/interfaces/requestUser.interface';
import { UsersService } from './users.service';
import { User } from '../../node_modules/.prisma/client';
import { CreateUser } from './dto/CreateUser.input';
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  //@UseGuards(JwtAuthGuard)

  @Get('all')
  async getall() {
    console.log("called");
    const all: User[] = await this.userService.getAll();
    return all;
  }
  //@UseGuards(JwtAuthGuard)
  @Get('user/username/:name')
  async getuserbyname(@Param('name') name: string) {
    const user: User = await this.userService.findOneByusername(name);
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    return user;
  }
  //@UseGuards(JwtAuthGuard)
  @Get('user/id/:id')
  async getuserbyid(@Param('id') id: string) {
    const user: User = await this.userService.findOneById(id);
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    return user;
  }
  //@UseGuards(JwtAuthGuard)
  @Get('user/email/:email')
  async getuserbyemail(@Param('email') email: string) {
    const user: User = await this.userService.findOneByEmail(email);
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    return user;
  }
  @UseGuards(JwtAuthGuard)
  @Get('user/enable2FA')
  async enable2FA(@Req() req: RequestWithUser) {
    const user: User = await this.userService.findOneByEmail(req.user.email);
    if (!user) throw new HttpException('missing with jwt', HttpStatus.CONFLICT);
    return this.userService.activate2fa(user.Userid);
  }
  @UseGuards(JwtAuthGuard)
  @Get('user/disable2FA')
  async disable2FA(@Req() req: RequestWithUser) {
    const user: User = await this.userService.findOneByEmail(req.user.email);
    if (!user) throw new HttpException('missing with jwt', HttpStatus.CONFLICT);
    return this.userService.deactivate2fa(user.Userid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getme(@Req() req: RequestWithUser) {
    const user: User = await this.userService.findOneByEmail(req.user.email);
    if (!user) throw new HttpException('are u a user', HttpStatus.NOT_FOUND);
    return req.user;
  }
  @Post('add')
  async create(@Body() user: CreateUser) {
    const error = await this.userService.userdatalreadyexist(user);
    if (error)
      throw new HttpException('user already exist', HttpStatus.CONFLICT);
    return this.userService.Create(user);
  }
  @UseGuards(JwtAuthGuard)
  @Get('followers')
  async getf(@Req() req: RequestWithUser) {
    const follow: follow[] = await this.userService.getfollowers(
      req.user.Userid,
    );
    return follow;
  }
  @UseGuards(JwtAuthGuard)
  @Get('follows')
  async getfol(@Req() req: RequestWithUser) {
    const follow: follow[] = await this.userService.getfollowed(
      req.user.Userid,
    );
    return follow;
  }
  @UseGuards(JwtAuthGuard)
  @Get('blocks')
  async getblocks(@Req() req: RequestWithUser) {
    const block: block[] = await this.userService.getblocks(req.user.Userid);
    return block;
  }
  @UseGuards(JwtAuthGuard)
  @Get('blockers')
  async getblockers(@Req() req: RequestWithUser) {
    const block: block[] = await this.userService.getblockers(req.user.Userid);
    return block;
  }
  @UseGuards(JwtAuthGuard)
  @Post('unblock/:id')
  async unblockuser(@Req() req: RequestWithUser, @Param('id') id: string) {
    const user: User = await this.userService.findOneById(id);
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    const blocked = await this.userService.unblock(
      req.user.Userid,
      user.Userid,
    );
    if (blocked) return new HttpException('unblocked', HttpStatus.ACCEPTED);
    else throw new HttpException('failed', HttpStatus.CONFLICT);
  }
  @UseGuards(JwtAuthGuard)
  @Post('block/:id')
  async blockuser(@Req() req: RequestWithUser, @Param('id') id: string) {
    const user: User = await this.userService.findOneById(id);
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    const blocked = await this.userService.block(req.user.Userid, user.Userid);
    if (blocked) return new HttpException('blocked', HttpStatus.ACCEPTED);
    else throw new HttpException('failed', HttpStatus.CONFLICT);
  }
  @UseGuards(JwtAuthGuard)
  @Post('unfollow/:id')
  async unfollow(@Req() req: RequestWithUser, @Param('id') id: string) {
    console.log(id);
    console.log(req.user);
    const user: User = await this.userService.findOneById(id);

    if (user) {
      const sent: boolean = await this.userService.unfollow(
        req.user.Userid,
        user.Userid,
      );
      if (sent) {
        return new HttpException('unfollowed', HttpStatus.ACCEPTED);
      }
    }
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('failed', HttpStatus.CONFLICT);
  }
  @UseGuards(JwtAuthGuard)
  @Post('follow/:id')
  async follow(@Req() req: RequestWithUser, @Param('id') id: string) {
    console.log(id);
    console.log(req.user);
    const user: User = await this.userService.findOneById(id);

    if (user) {
      const sent: boolean = await this.userService.follow(
        req.user.Userid,
        user.Userid,
      );
      if (sent) {
        return new HttpException('followed', HttpStatus.ACCEPTED);
      }
    }
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('failed', HttpStatus.CONFLICT);
  }
  @Get('fakepop')
  async fakepop() {
    await this.userService.faker();
    return 'database populated';
  }
  @Get('deleteall')
  async dalateall() {
    await this.userService.daleteall();
  }
}
