import { ApiProperty } from "@nestjs/swagger";
import { Contains, IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto{
    @IsEmail({
        message: "provide a valid email"
    })
    @ApiProperty(
        {
            description: 'User email. It must be unique. If a user with provided email already exists - 401 will be returned'
        }
    )
    email: string;


    @ApiProperty(
        {
            description: 'User password. Must be at least 6 chars long'
        }
    )
    @IsString()
    @MinLength(6,{
        message: 'Password is too short. It should be atleast $constraint1 characters long.'
    })
    password: string;
}