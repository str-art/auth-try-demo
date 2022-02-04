import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Contains, IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto{
    @IsOptional()
    @IsEmail()
    @ApiPropertyOptional({
        description: 'To change users email - put new email in this field'
    })
    newEmail?: string;
    @IsOptional()
    @IsString()
    // //@Contains('[/\d/',{
    //     message: 'Password must contain at least 1 number.'
    // })
    @ApiPropertyOptional(
        {
            description: 'To change password put new password here'
        }
    )
    newPassword?: string;

     @ApiProperty({
         description: 'To make any changes to user a valid current password must be provided.'
     })
     password: string;
}