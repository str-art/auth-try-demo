import { Body, Controller, HttpCode, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user.module/dtos/createUser.dto";

import { DtoValidationPipe} from "src/pipes/dtovalidation.pipe";

import { LocalAuthGuard } from "src/guards/login.guard";
import { ApiBadRequestResponse, ApiBasicAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";




@ApiTags('Auth and Login')
@Controller()
export class AuthController{
    constructor(private authService:AuthService){}

    @ApiOperation({description:'To create a new user and get a valid JWT token'})
    @ApiCreatedResponse({description:'User succesfully created, its entity and token a returned in body'})
    @ApiBadRequestResponse({description:'Either email or password provided doesnt suit required conditions. Email must not be already used and password must be at least 6 chars long'})
    @Post('/signup')
    async singUp(@Body(new DtoValidationPipe()) dto: CreateUserDto){
        return await this.authService.registerUser(dto)
      
    }

    @ApiBody({
        type: CreateUserDto
    })
    @ApiOperation({description:'To get a valid JWT token by providing password and email used in registration'})
    @ApiOkResponse({description: 'Credentials verified, new JWT token is genereted and sent in body'})
    @ApiUnauthorizedResponse({description: 'Either password or email doesnt match the ones provided with registration'})
    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    @Post('/login')
    async login(@Request() req){
       return await this.authService.login(req.user)
    }
}