import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiHeader, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { AccessGuard } from "src/guards/access.guard";
import { JwtUserGuard } from "src/guards/jwt.gurad";
import { ParamGuard } from "src/guards/param.guard";
import { DtoValidationPipe } from "src/pipes/dtovalidation.pipe";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dtos/createComment.dto";
import { UpdateCommentDto } from "./dtos/updateComment.dto";



@ApiBearerAuth()
@ApiTags('Working with comments')
@Controller()
export class CommentController{
    constructor(private commentService: CommentService){}

    
    
    @ApiOkResponse({description: "Returns all comments present in specified card"})
    @ApiForbiddenResponse({description: "User doesnt have access to column where requested card is placed."})
    @ApiOperation({description:"Use this to get all comments of chosen card"})
    @ApiParam({name: 'columnId',description:'id of column'})
    @ApiParam({name: 'userId',description:'id of user doing a request'})
    @ApiParam({name: 'cardId',description:'id of card which comments youd like to get'})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Get()
    async getAllColumnComments(@Param('cardId')id: number){
        return await this.commentService.getAllComments(id)
    }

    
    @ApiOkResponse({description: "Returns a specific comment"})
    @ApiForbiddenResponse({description: "User doesnt have access to column where requested card is placed."})
    @ApiOperation({description:"Use this to get certan comment"})
    @ApiParam({name: 'columnId',description:'id of column'})
    @ApiParam({name: 'userId',description:'id of user doing a request'})
    @ApiParam({name: 'cardId',description:'id of card which comments youd like to get'})
    @ApiParam({name: 'commentId',description:'id of specific comment you want to load'})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Get('/:commentId')
    async getCard(@Param('commentId')id: number){
        return this.commentService.getComment(id)
    }

    
    @ApiCreatedResponse({description: "Returns a created comment"})
    @ApiForbiddenResponse({description: "User doesnt have access to column where requested card is placed."})
    @ApiOperation({description:"Use this to create a comment"})
    @ApiParam({name: 'userId',description:'id of user doing a request'})
    @ApiParam({name: 'columnId',description:'id of column this cards belongs to'})
    @ApiParam({name: 'cardId',description:'id of card where you want to leave a comment'})
    
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Post()
    async createCard(
        @Body(DtoValidationPipe)dto: CreateCommentDto,
        @Param('cardId')cardId: number,
        @Request()req
        ){
            return await this.commentService.createComment(dto,cardId,req.user.id)
    }


    
    @ApiOkResponse({description: "Returnes changed version of comment"})
    @ApiForbiddenResponse({description: "User is not the owner of comment or have no access to card or column where this comment is left (deleted from column for example) "})
    @ApiOperation({description:"Use this to change a comment"})
    @ApiParam({name: 'commentId',description:'id of comment youd like to change'})
    @ApiParam({name: 'columnId',description:'id of column'})
    @ApiParam({name: 'userId',description:'id of user doing a request'})
    @ApiParam({name: 'cardId',description:'id of card which comments youd like to get'})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Put('/:commentId')
    async updateComment(
        @Param('commentId')id: number, 
        @Body(DtoValidationPipe)dto: UpdateCommentDto){
            return await this.commentService.updateComment(dto,id)
    }


    
    @ApiNoContentResponse({description: "Returns empty object if comment is succesfuly deleted"})
    @ApiForbiddenResponse({description: "User is not the owner of comment or have no access to card or column where this comment is left"})
    @ApiParam({name: 'commentId',description:'id of comment youd like to delete'})
    @ApiParam({name: 'columnId',description:'id of column'})
    @ApiParam({name: 'userId',description:'id of user doing a request'})
    @ApiParam({name: 'cardId',description:'id of card which comments youd like to get'})
    @ApiOperation({description:"Use this to delete a comment"})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @HttpCode(204)
    @Delete('/:commentId')
    async deleteComment(@Param('commentId')id: number){
        return await this.commentService.deleteComment(id)
    }


}