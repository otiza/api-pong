import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { gameGateway } from './games.gateway';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [JwtModule, UsersModule],
  providers: [GamesService, gameGateway, AuthService, PrismaService],
  controllers: [GamesController],
})
export class GamesModule {}
