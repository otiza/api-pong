import { Optional } from '@nestjs/common';
import {IsOptional, IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateUser {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;
  
  @IsOptional()
  avatar: any;


}
import { validate, ValidationArguments, registerDecorator } from 'class-validator';

export function IsUsernameLengthValid(validationArguments?: ValidationArguments) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUsernameLengthValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      validator: {
        validate(value: any) {
          return typeof value === 'string' && value.length <= 30;
        },
      },
    });
  };
}
export class updateUsername {
  @IsUsernameLengthValid()
  @IsNotEmpty()
  @IsString()
  username: string;

}

