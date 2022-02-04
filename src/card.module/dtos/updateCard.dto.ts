import { ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayUnique, IsEmail, IsNumber, IsOptional, IsString,  MinLength } from "class-validator";

export class UpdateCardDto{
    @IsOptional()
    @IsString()
    @MinLength(1)
    @ApiPropertyOptional({
        description: 'To change cards name - put new name here'
    })
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @ApiPropertyOptional({
        description: 'To change cards text - put new text here'
    })
    text?: string;

    @ApiPropertyOptional({
        description: 'To add users to a card - put their emails here. This users must be added to a column this card belongs to, '
    })
    @IsOptional()
    @IsEmail(this,{
        each:true,
    })
    @ArrayUnique()
    usersToAdd?: string[];


    @ApiPropertyOptional({
        description: 'To delete a user from card - put its email here'
    })
    @IsOptional()
    @IsEmail(this,{
        each:true,
    })
    @ArrayUnique()
    usersToDelete?: string[];

    @ApiPropertyOptional({
        description: 'To move card to another column put its id in this field, the user doing this and all other users added to card must have access to the column'
    })
    @IsOptional()
    @IsNumber()
    newColumn?: number;
}