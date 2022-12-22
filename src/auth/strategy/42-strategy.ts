import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-42';
import { VerifyCallback } from 'passport-oauth2';

import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private authService: AuthService) {
    super({
      clientID:
        'u-s4t2ud-bb691ee7fbfd3a586f755e8dceb0e16fa9d2ac879097f346e57e7c1cdd8b2c34',
      clientSecret:
        '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',
      callbackURL: 'http://localhost:5000/auth/42/callback',
      scope: ['public'],
      passReqToCallback: true,
    });
  }
  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    console.log(profile.photos);
    const user = await this.authService.validateUser({
      email: profile.emails == undefined ? '' : profile.emails[0].value,
      username: profile.username,
    });

    done(null, user);
  }
}
