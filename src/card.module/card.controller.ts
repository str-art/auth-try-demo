import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { CreateCardDto } from "./dtos/card.dto";
import { CardService } from "./card.service";
import { UpdateCardDto } from "./dtos/updateCard.dto";
import { ParamGuard } from "src/guards/param.guard";
import { JwtUserGuard } from "src/guards/jwt.gurad";
import { AccessGuard } from "src/guards/access.guard";
import { DtoValidationPipe } from "src/pipes/dtovalidation.pipe";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Working with cards')
@Controller()
export class CardController{
    constructor(private cardService: CardService){}
    

    @ApiOkResponse({description: "Returns all cards present in requested column a user making the request have access to"})
    @ApiForbiddenResponse({description: "User doesnt have access to column requested or JTW token is invalid."})
    @ApiOperation({description:"Use this to get all cards from specifc column"})
    @ApiParam({name: 'columnId',description:'id of column'})
    @ApiParam({name: 'userId',description:'id of user doing a request'})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Get()
    getCard(@Param('columnId')id: number){
        return this.cardService.getAllColumnCards(id)
    }


    @ApiOkResponse({description: "Returns a specific card from specified column if user have access to column"})
    @ApiForbiddenResponse({description: "User doesnt have access to column requested or JTW token is invalid."})
    @ApiOperation({description:"Use this to get certain card from specified column"})
    @ApiParam({name: 'columnId',description:'id of column'})
    @ApiParam({name: 'userId',description:'id of user doing a request'})
    @ApiParam({name: 'cardId',description:'id of card you want to get'})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Get('/:cardId')
    getCardById(@Param('cardId')id: number, @Param('columnId')columnId: number){
        
        return this.cardService.getCardById(id,columnId)
    }

    @ApiCreatedResponse({description: "Creates a new card in specified column and returns it"})
    @ApiForbiddenResponse({description: "User doesnt have access to column requested or JTW token is invalid."})
    @ApiBadRequestResponse({description: 'Card name field isnt provided'})
    @ApiOperation({description:"Use this to create a new card in column"})
    @ApiParam({name: 'columnId',description:'id of column'})
    @ApiParam({name: 'userId',description:'id of user doing a request'})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Post()
    createCard(@Body(DtoValidationPipe)dto: CreateCardDto, 
    @Param('columnId')columnId: number,
    @Request()req ){
        return this.cardService.createCard(dto,req.user,columnId)
    }

    @ApiOkResponse({description: "Changes a specified card and returns modified version"})
    @ApiForbiddenResponse({description: "User doesnt have access to column requested or JTW token is invalid or user doesnt have access to card."})
    @ApiBadRequestResponse({description: "One of fields to change is incorrectly filled. Check if users emails are all unique and are emails."})
    @ApiOperation({description:"Use this to change a card in column. You may change its name or text or add new users as well as delete some of existing users"})
    @ApiParam({name: 'columnId',description:'id of column'})
    @ApiParam({name: 'userId',description:'id of user doing a request'})
    @ApiParam({name: 'cardId',description:'id of card you want to change'})
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
    


    @ApiNoContentResponse({description: "Deletes a specified card and all comments in it"})
    @ApiForbiddenResponse({description: "User doesnt have access to column requested or JTW token is invalid or user doesnt have access to card."})
    @ApiOperation({description:"Use this to delete a card in column. All comments inside this card will be deleted"})
    @ApiParam({name: 'columnId',description:'id of column'})
    @ApiParam({name: 'userId',description:'id of user doing a request'})
    @ApiParam({name: 'cardId',description:'id of card you want to delete'})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @HttpCode(204)
    @Delete('/:cardId')
    deleteCard(@Param('cardId')id) {
        
        return this.cardService.deleteCard(id)
    }
}