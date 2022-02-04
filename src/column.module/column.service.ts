import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Card } from "src/card.module/card.entity";
import { CardService } from "src/card.module/card.service";
import { User } from "src/user.module/user.entity";
import { UserService } from "src/user.module/user.service";
import { Repository } from "typeorm";
import { Columns } from "./column.entity";
import { CreateColumnDto } from "./dtos/createColumnDto";
import { UpdateColumnDto } from "./dtos/updateColumnDto";


@Injectable()
export class ColumnService{
    constructor(
        @InjectRepository(Columns)private columnRepository: Repository<Columns>,
        @Inject(forwardRef(() => CardService))
        private cardService: CardService,
        private userService: UserService,
        ){}

    async createColumn(dto: CreateColumnDto, user: User): Promise<Columns>{
        
        const newColumn = this.columnRepository.create(dto)
        await this.columnRepository.save(newColumn)
        await this.columnRepository.createQueryBuilder('columns')
            .relation(Columns,'users')
            .of(newColumn)
            .add(user)
        return await this.getColumnById(newColumn.id);    
        
    }

    async getAllUserColumns(user: User): Promise<Columns[]>{
         return await this.columnRepository.createQueryBuilder('columns')
            .leftJoinAndSelect('columns.users','user','user.id = :id',{id:user.id})
            .leftJoinAndSelect('columns.cards','card')
            .orderBy('columns.id')
            .where('user.id = :userId',{userId:user.id})
            .getMany()
    }
    async getColumnById(id:number): Promise<Columns>{
        const columnToFind = await this.columnRepository.createQueryBuilder('columns')
            .leftJoinAndSelect('columns.users','user')
            .leftJoinAndSelect('columns.cards','card')
            .where('columns.id = :columnId',{columnId: id})
            .getOne()
        
        return columnToFind
    }


    async updateColumn(dto: UpdateColumnDto, id: number): Promise<Columns>{
        const columnToChange = await this.getColumnById(id);
        

        if(dto.name) {await this.columnRepository.createQueryBuilder('columns')
                        .update(Columns)
                        .set({name: dto.name})
                        .where('id = :columnId',{columnId:id})
                        .execute();
        }

        if(dto.usersToAdd){
            try{
                const usersToAdd = await this.userService.getUsersByEmail(dto.usersToAdd);
                console.log(usersToAdd)
                if(usersToAdd.length === 0) throw new HttpException({
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    message: 'User doesnt exist'
                }, HttpStatus.UNPROCESSABLE_ENTITY)

                usersToAdd.forEach(async (user) => {
                
                        await this.columnRepository.createQueryBuilder('columns')
                            .relation(Columns,'users')
                            .of(id)
                            .add(user.id)
                    
            })
        } catch(err) {
            throw new HttpException(
                {
                    status: HttpStatus.CONFLICT,
                    message: 'Cant add users'
                }, HttpStatus.CONFLICT
            )
        }
        }    

        if(dto.usersToDelete){
           try{
            const usersToDelete = await this.userService.getUsersByEmail(dto.usersToDelete);

            if(usersToDelete.length === 0) throw new HttpException({
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                message: 'User doesnt exist'
            }, HttpStatus.UNPROCESSABLE_ENTITY)

            usersToDelete.forEach(async (user)=>{
                
                    await this.columnRepository.createQueryBuilder('columns')
                            .relation(Columns,'users')
                            .of(id)
                            .remove(user.id)

                        columnToChange.cards.forEach(async (card: Card) => {

                            let userToDelete = card.users.find((userToDelete) => userToDelete.id === user.id)

                            if(userToDelete){
                                    if(userToDelete) await this.cardService.deleteUser(card.id,user);
                                
                            }
                        })
                    
                
            })
        }catch(err){
            throw new HttpException(
                {
                    status: HttpStatus.CONFLICT,
                    message: 'Cant delete users'
                }, HttpStatus.CONFLICT
            )
        }
        }
        return await this.getColumnById(id);
    }
    
    async deleteColumn(id:number){
        const deleted = await this.columnRepository.delete(id);
        if(deleted) return {};
    }

    
}