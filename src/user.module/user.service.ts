import { forwardRef, HttpCode, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "src/auth.module.ts/auth.service";
import { In, Repository } from "typeorm";
import { CreateUserDto } from "./dtos/createUser.dto";
import { UpdateUserDto } from "./dtos/updateUserDto";
import { User } from "./user.entity";


@Injectable()
export class UserService{

    constructor(
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
        @InjectRepository(User)private usersRepository: Repository<User>
        ){}


   
    async createUser(dto: CreateUserDto): Promise <User>{
        
        const newUser = this.usersRepository.create(dto)
        const userEntity = await this.usersRepository.save(newUser)
        return userEntity;
    }

    async getUserById(id:number): Promise<User>{
        
        return await this.usersRepository.createQueryBuilder('user')
                .leftJoinAndSelect('user.columns','columns')
                .leftJoinAndSelect('user.cards','card')
                .leftJoinAndSelect('user.comments','comment')
                .where('user.id = :userId',{userId:id})
                .getOne()
    }


    async changeUser(dto: UpdateUserDto, userId: number){
        
        if(dto.newEmail) {
            try{
            await this.usersRepository.createQueryBuilder('User')
            .update()
            .set({
                email: dto.newEmail,
            })
            .where('id = :userIdToFind',{userIdToFind: userId})
            .execute()
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.CONFLICT,
                    message: 'This email is already in use'
                }, HttpStatus.CONFLICT
            )
        }
        }
        if(dto.newPassword) {
            try{
                await this.usersRepository.createQueryBuilder('User')
            .update()
            .set({
                password: dto.newPassword,
            })
            .where('id = :userIdToFind',{userIdToFind: userId})
            .execute()
        }catch(err){
            throw new HttpException({
                status: HttpStatus.I_AM_A_TEAPOT,
                message: 'there is no way this wont work but anyways covers with catch'
            },HttpStatus.I_AM_A_TEAPOT)
        }
        }
        
        const updatedUser = await this.usersRepository.createQueryBuilder('User')
            .addSelect('password')
            .where('id= :userIdToFind',{userIdToFind: userId})
            .getOne()
        
        
        return await this.authService.login(updatedUser)
    }

    async deleteUser(id:number){
        const deleted = await this.usersRepository.delete(id);
        if(deleted) return {};
    }

    async getUsersByEmail(emails: string[]): Promise<User[]>{
        return await this.usersRepository.find({
            relations: ['columns','cards'],
            select:['id'],
            where:{
                "email": In(emails),
            }
        })
    }

    async forAuth(email: string){
        return await this.usersRepository.createQueryBuilder('user')
                    .addSelect('user.password')
                    .where('email = :toFind',{toFind:email})
                    .getOne()
    }


}