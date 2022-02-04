import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { CreateCardDto } from "./dtos/card.dto";
import { CardService } from "./card.service";
import { UpdateCardDto } from "./dtos/updateCard.dto";
import { ParamGuard } from "src/guards/param.guard";
import { JwtUserGuard } from "src/guards/jwt.gurad";
import { AccessGuard } from "src/guards/access.guard";
import { DtoValidationPipe } from "src/pipes/dtovalidation.pipe";


@Controller()
export class CardController{
    constructor(private cardService: CardService){}
    

    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Get()
    getCard(@Param('columnId')id: number){
        return this.cardService.getAllColumnCards(id)
    }

    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Get('/:cardId')
    getCardById(@Param('cardId')id: number, @Param('columnId')columnId: number){
        
        return this.cardService.getCardById(id,columnId)
    }

    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Post()
    createCard(@Body(DtoValidationPipe)dto: CreateCardDto, 
    @Param('columnId')columnId: number,
    @Request()req ){
        return this.cardService.createCard(dto,req.user,columnId)
    }

    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Put('/:cardId')
    updateCard(
        @Param('cardId')cardId: number, 
        @Param('columnId')columnId: number,
        @Body(DtoValidationPipe)dto: UpdateCardDto,
        @Request()req
    ){
            return this.cardService.updateCard(cardId,dto,columnId,req.user)
    }
    
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @HttpCode(204)
    @Delete('/:cardId')
    deleteCard(@Param('cardId')id) {
        
        return this.cardService.deleteCard(id)
    }
}