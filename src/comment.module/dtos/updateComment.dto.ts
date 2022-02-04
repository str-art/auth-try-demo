import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class UpdateCommentDto{
    @IsString()
    @MinLength(1,{
        message: 'A comment must be at least $constraint1 characters long'
    })
    @ApiPropertyOptional({
        description: 'You can only change a text of a comment. Provide new text as a property inside body. To do it a user making the request must be the one who created the comment',
        minLength: 1,
        type: String
    })
    text?: string;
}