import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [JwtModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
