import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateCommentDto{
    @IsString()
    @MinLength(1,{
        message: 'A comment must be at least $constraints1 characters long.'
    })
    @ApiProperty({
        description: 'To create a comment pass its text as text property inside the body. The owner of comment will be the user doing the request',
        minLength: 1,
        type: String
    })
    text: string;

}