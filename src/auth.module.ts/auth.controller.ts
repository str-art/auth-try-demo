import { Body, Controller, HttpCode, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user.module/dtos/createUser.dto";

import { DtoValidationPipe} from "src/pipes/dtovalidation.pipe";

import { LocalAuthGuard } from "src/guards/login.guard";





@Controller()
export class AuthController{
    constructor(private authService:AuthService){}

    //Email is not in use
    //Returns JWT token
    @Post('/signup')
    async singUp(@Body(new DtoValidationPipe()) dto: CreateUserDto){
        return await this.authService.registerUser(dto)
      
    }

    //Email exists in db
    //Password mathes
    //Returns JWT token
    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    @Post('/login')
    async login(@Request() req){
       return await this.authService.login(req.user)
    }
}