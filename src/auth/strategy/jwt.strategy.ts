import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

export type JwtPayload = {
  id: string;
  email: string;
};

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
  ) {
    const extractJwtFromCookie = (req: Request) => {
      let token = null;
      
      if (req && req.cookies) {
        token = req.cookies['jwt'];
      }
      //console.log(token);
      return token;
    };

    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: 'tiza',
    });
  }

  async validate(payload: JwtPayload) {
      return {
        Userid: payload.id,
        email: payload.email,
      };
  }
}
