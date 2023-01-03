import { Controller, Delete, Get, Req, Res, UseGuards } from '@nestjs/common';
import RequestWithUser from 'src/interfaces/requestUser.interface';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { FortyTwoAuthGuard } from './guard/fortytwo.guard';



@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('42login')
  @UseGuards(FortyTwoAuthGuard)
  get42Login(): string {
    return 'this is 42 login';
  }
  @Get('42/callback')
  @UseGuards(FortyTwoAuthGuard)
  get42call(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = this.authService.loginUser(request);

    res.cookie('jwt', accessToken);
    res.redirect('http://localhost:3000');
  }


  @Get('test')
  async getlb(@Req() request: Request)  {
    console.log(await this.authService.userinfo(request.cookies.jwt));
  }
}
