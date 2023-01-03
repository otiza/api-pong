export declare class CreateUser {
    email: string;
    username: string;
    avatar: any;
}
import { ValidationArguments } from 'class-validator';
export declare function IsUsernameLengthValid(validationArguments?: ValidationArguments): (object: Object, propertyName: string) => void;
export declare class updateUsername {
    username: string;
}
