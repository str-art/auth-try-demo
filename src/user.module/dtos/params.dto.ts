import { IsNumber, IsNumberString, IsOptional, IsPositive, ValidateIf } from "class-validator";

export class ParamDto{
    @IsOptional()
    @IsNumberString({
        message: 'Incorrect user id'
    })
    
    userId: number;

    @ValidateIf(o => o.userid)
    @IsOptional()
    @IsNumberString({
        message: 'Incorrect column id'
    })
    
    columnId: number;

    @ValidateIf(o => o.columnId)
    @IsOptional()
    @IsNumberString({
        message: 'Incorrect card id'
    })
    cardId: number;

    @ValidateIf(o => o.cardId)
    @IsOptional()
    @IsNumberString({
        message: 'Incorrect comment id'
    })
    commentId: number
}