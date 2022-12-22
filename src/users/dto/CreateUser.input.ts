import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateUser {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  //@IsUrl()
  //avatar: string;
}
