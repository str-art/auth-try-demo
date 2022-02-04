import { ForbiddenException, forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCardDto } from "./dtos/card.dto";
import { Card } from "./card.entity";
import { UpdateCardDto } from "./dtos/updateCard.dto";
import { UserService } from "src/user.module/user.service";
import { ColumnService } from "src/column.module/column.service";
import { User } from "src/user.module/user.entity";



@Injectable()
export class CardService{
    constructor(
        @Inject(forwardRef(() => ColumnService))
        private columnService: ColumnService,
        private userService: UserService,
        @InjectRepository(Card)private cardRepository: Repository<Card>
        ){}

    async getAllColumnCards(columnId: number): Promise<Card[]>{
        return await this.cardRepository.createQueryBuilder('card')
            .leftJoinAndSelect('card.columns','columns')
            .leftJoinAndSelect('card.comments','comments')
            .leftJoinAndSelect('card.users','users')
            .where('columns.id = :columnIdToFind',{columnIdToFind: columnId})
            .getMany();
    }

    async getCardById(id: number, columnId: number): Promise<Card>{
        const card = await this.cardRepository.createQueryBuilder('card')
            .leftJoinAndSelect('card.columns','columns')
            .leftJoinAndSelect('card.comments','comments')
            .leftJoinAndSelect('card.users','users')
            .where('card.id = :cardId',{cardId: id})
            .andWhere('card.columnsId = :columnIdToFind',{columnIdToFind: columnId})
            .getOne()
            if(card){return card;}
            else{throw new NotFoundException(`Card with id ${id} doesnt exist on column with id ${columnId}`)}
        
    }
    
    async createCard(dto: CreateCardDto, user: User, columnId: number){
        
        const newCard = this.cardRepository.create(dto)
        await this.cardRepository.save(newCard)
        try{await this.cardRepository.createQueryBuilder('card')
        .relation(Card,'users')
        .of(newCard)
        .add(user)
        }catch(err){
        throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Failed adding user to newly created card'
        },HttpStatus.INTERNAL_SERVER_ERROR)
        }
        
        try{
        await this.cardRepository.createQueryBuilder('card')
            .relation(Card,'columns')
            .of(newCard)
            .set(columnId)
        } catch(err){
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed adding coluns to newly created card'
            },HttpStatus.INTERNAL_SERVER_ERROR)
        }
        
        return await this.getCardById(newCard.id,columnId);

    }

    async updateCard(cardId: number, dto: UpdateCardDto, columnId: number, user: User){
        
        if(dto.name) await this.cardRepository.createQueryBuilder('card')
                            .update()
                            .set({
                                name: dto.name,
                            })
                            .where('id = :cardToChangeId',{cardToChangeId: cardId})
                            .execute()
        if(dto.newColumn) {
            let allow = user.columns.find((c)=>c.id == dto.newColumn)
            if(allow){
                try{
                await this.changeColumn(cardId,dto.newColumn)
            }catch(err){
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Cant change cards name, contact support if it continues'
                },HttpStatus.INTERNAL_SERVER_ERROR)
            } 
        } else throw new ForbiddenException('You dont have access to the column you are trying to put this card into')
            }
        
        
    
        if(dto.text){
            try{
                await this.cardRepository.createQueryBuilder('card')
                    .update()
                    .set({
                        text: dto.text
                    })
                    .where('id = :cardToChangeId',{cardToChangeId:cardId})
                    .execute()
            }catch(err){
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Cant change cards text, contact support if it continues'
                },HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }

        

        if(dto.usersToAdd) {
            //Gotta redo with promises explicitly to throw an http error inside try catch async block
            try {
                const usersToAdd = await this.userService.getUsersByEmail(dto.usersToAdd)
                if(usersToAdd.length === 0) throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    message: 'No users to add found, make sure these users are present in current column'
                },HttpStatus.NOT_ACCEPTABLE)
                
                usersToAdd.forEach(async (user)=> {
                    
                    let accessToColumn = user.columns.find((c)=>c.id == columnId);
                    let existInCard = user.cards.find((c)=>c.id == cardId)

                    if(accessToColumn && !existInCard){
                        
                        await this.addUser(cardId,user)
                        
                    } 
                })
            } catch(err){
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Cant add users'
                },HttpStatus.INTERNAL_SERVER_ERROR)
            }
            
        }

        
        if(dto.usersToDelete) {
            try{
                const usersToDelete = await this.userService.getUsersByEmail(dto.usersToDelete)
                if(usersToDelete.length === 0){throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    message: 'No users to delete found, make sure these users are present in this card'
                },HttpStatus.NOT_ACCEPTABLE)}
                usersToDelete.forEach(async (user)=> {
                    try{ 
                    await this.deleteUser(cardId,user)
                    } catch(err) {
                        throw err;
                    }
                });
            }catch(err){
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Cant delete users'
                },HttpStatus.INTERNAL_SERVER_ERROR)
            }
            
        }
        if(dto.newColumn) {return await this.getCardById(cardId,dto.newColumn)}
        else{return await this.getCardById(cardId,columnId)}
    }

    async deleteCard(cardId: number){
        try{
            const deleted = await this.cardRepository.delete(cardId)
            if(deleted) return {};
        }catch(err){
            throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Cant delete card'
        },HttpStatus.INTERNAL_SERVER_ERROR)}
        
        
    }

    async deleteUser(cardId: number, user: User){
        return await this.cardRepository.createQueryBuilder('card')
            .relation(Card,'users')
            .of(cardId)
            .remove(user)
    }
    
    private async addUser(cardId: number, user: User){
        return await this.cardRepository.createQueryBuilder('card')
            .relation(Card,'users')
            .of(cardId)
            .add(user)
    }

    private async changeColumn(cardId: number, columnId: number){
        const card = await this.getCardById(cardId,columnId);
        const column = await this.columnService.getColumnById(columnId)
        card.users.forEach(async (u)=>{
            let yes = column.users.find((cu)=>cu.id == u.id)
            if (!yes) await this.deleteUser(cardId,u)
        })
        return await this.cardRepository.createQueryBuilder('card')
            .relation(Card,'columns')
            .of(cardId)
            .set(columnId)
    }


}