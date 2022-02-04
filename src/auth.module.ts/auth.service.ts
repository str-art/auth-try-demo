import { forwardRef, HttpException, HttpStatus, Inject, Injectable,  } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../user.module/dtos/createUser.dto";
import { UserService } from "../user.module/user.service";




@Injectable()
export class AuthService{
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private jwtService: JwtService,
        ){}

        

        async validateUser(username: string, password: string){
        
        const user = await this.userService.forAuth(username);
        
        if(user && user.password === password){
            const {password,...validatedUser} = user;
            return validatedUser;
    }
        return null;    
    }
    

        async registerUser(dto:CreateUserDto){
            
            const user = await this.userService.forAuth(dto.email);
           
            if(user) {throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'This email is already in use'
            }, HttpStatus.CONFLICT)}
            const newUser = await this.userService.createUser(dto)
            
            return await this.login(newUser);
        }

        async login(userToLogin:any){ 
            
            const {password, ...user} = userToLogin;
            const payload = {sub: userToLogin.id,username: userToLogin.email }
            
            return {
                user,
                access_token: this.jwtService.sign(payload),
            }
        }


    }
