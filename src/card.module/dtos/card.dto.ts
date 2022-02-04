import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayUnique, IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCardDto{
    @IsString()
    @MinLength(1)
    @ApiProperty({
        description: 'This is a card name'
    })
    name: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @ApiPropertyOptional({
        description: 'This is the text inside a card (a description of a task)'
    })
    text?: string;

}