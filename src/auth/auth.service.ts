import { Injectable, Req } from '@nestjs/common';
import { access } from 'fs';
import { JwtService } from '@nestjs/jwt';
import RequestWithUser from 'src/interfaces/requestUser.interface';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './strategy/jwt.strategy';
import { User } from '../../node_modules/.prisma/client';
import { CreateUser } from 'src/users/dto/CreateUser.input';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userinfo: CreateUser): Promise<User> {
    const user = await this.userService.findOneByEmail(userinfo.email);
    if (user) {
      return user;
    }
    return await this.userService.Create(userinfo);
  }
  loginUser(request: RequestWithUser) {
    const payload: JwtPayload = {
      email: request.user.email,
      id: request.user.Userid,
    };
    return { accessToken: this.jwtService.sign(payload) };
  }
  userinfo(payload: string): string {
    const user = this.jwtService.decode(payload);
    return user["id"];
  }
}
