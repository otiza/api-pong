import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';


import { FortyTwoStrategy } from './strategy/42-strategy';
import { JwtAuthStrategy } from './strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [
    JwtModule.register({
      secret: 'tiza',
      signOptions: { expiresIn: '24h' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy, JwtAuthStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
