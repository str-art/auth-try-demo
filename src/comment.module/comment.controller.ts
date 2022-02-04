import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { AccessGuard } from "src/guards/access.guard";
import { JwtUserGuard } from "src/guards/jwt.gurad";
import { ParamGuard } from "src/guards/param.guard";
import { DtoValidationPipe } from "src/pipes/dtovalidation.pipe";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dtos/createComment.dto";
import { UpdateCommentDto } from "./dtos/updateComment.dto";

@Controller()
export class CommentController{
    constructor(private commentService: CommentService){}

    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Get()
    async getAllColumnComments(@Param('cardId')id: number){
        return await this.commentService.getAllComments(id)
    }

    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Get('/:commentId')
    async getCard(@Param('commentId')id: number){
        return this.commentService.getComment(id)
    }

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


    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Put('/:commentId')
    async updateComment(
        @Param('commentId')id: number, 
        @Body(DtoValidationPipe)dto: UpdateCommentDto){
            return await this.commentService.updateComment(dto,id)
    }

    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @HttpCode(204)
    @Delete('/:commentId')
    async deleteComment(@Param('commentId')id: number){
        return await this.commentService.deleteComment(id)
    }


}