import { ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayUnique, IsEmail, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateColumnDto{
    @IsOptional()
    @IsString()
    @MinLength(1,{
        
        message: "A name must be at least $constraints1 characters long"
    })
    @ApiPropertyOptional({
        description:'To change columns name - provide a new name as a name property of passed in body object'
    })
    name?: string;

    @IsOptional()
    @ArrayUnique(this,{message: '$value s mentioned twice'})
    @IsEmail(this,{each:true, message: '$value is not an email'})
    @ApiPropertyOptional({
        description:'To add new users to column provide their emails as an array of strings in usersToAdd property of body. Must be an array even for 1 user'
    })
    usersToAdd?: string[];

    @IsOptional()
    @ArrayUnique(this,{message: '$value s mentioned twice'})
    @IsEmail(this,{each:true, message: '$value is not an email'})
    @ApiPropertyOptional({
        description:'To delete users from column provide their emails as an array of strings in usersToDelete property of body'
    })
    usersToDelete?: string[];

}