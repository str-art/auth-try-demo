import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateColumnDto{
    @IsString()
    @MinLength(1,{
        message: "Name must be at least $constraint1 characters long"
    })
    @ApiProperty({
        description: "To create a column just provide its name. User creating it will be added automaticaly"
    })
    name: string;
}