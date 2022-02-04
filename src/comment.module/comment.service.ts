import { HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comments } from "./comment.entity";
import { CreateCommentDto } from "./dtos/createComment.dto";
import { UpdateCommentDto } from "./dtos/updateComment.dto";

@Injectable()
export class CommentService{
    constructor(@InjectRepository(Comments)private commentsRepository: Repository<Comments>){}

    async createComment(dto: CreateCommentDto, cardId: number, userId: number){
        const createdComment = this.commentsRepository.create(dto);
        const newComment =  await this.commentsRepository.save(createdComment);
        try{
            await this.setCommentAuthor(newComment,userId);} catch(err){throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Cant add author'
        },HttpStatus.INTERNAL_SERVER_ERROR)}
        try{
            await this.setCommentCard(createdComment,cardId);}catch(err){throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Cant add card'
        },HttpStatus.INTERNAL_SERVER_ERROR)}
        
        return await this.getComment(createdComment.id)
        }

    async deleteComment(commentId: string | number){
        return await this.commentsRepository.createQueryBuilder('comments')
            .delete()
            .from(Comments)
            .where('id = :commentToDelete', { commentToDelete: commentId})
            .execute();
    }   

    async updateComment(dto: UpdateCommentDto, commentId: number){
        return await this.commentsRepository.createQueryBuilder('comments')
                .update(Comments)
                .set({text: dto.text})
                .where('id = :id', { id: commentId})
                .execute();

    }

    async getAllComments(cardId: number): Promise<Comments[]>{
        return await this.commentsRepository.createQueryBuilder('comments')
                .leftJoin('comments.card','card')
                .where('card.id = :cardIdToFind',{cardIdToFind: cardId})
                .getMany()
    }




    

    async getComment(commentId: number){
       return await this.commentsRepository.createQueryBuilder('comments')
            .leftJoinAndSelect('comments.author', 'user')
            .leftJoinAndSelect('comments.card','card')
            .where('comments.id = :commentId', { commentId: commentId })
            .getOne();
    }

    private async setCommentCard(comment: Comments, cardId: number) {
        return await this.commentsRepository
        .createQueryBuilder('comments')
        .relation(Comments, 'card')
        .of(comment)
        .set(cardId);
    }

    private async setCommentAuthor(comment: Comments, userId: number) {
        return await this.commentsRepository
        .createQueryBuilder('comments')
        .relation(Comments, 'author')
        .of(comment)
        .set(userId);
    }
}