import { Body, Controller, Delete, Get, HttpCode, Put, Request, UseGuards } from "@nestjs/common";
import { AccessGuard } from "src/guards/access.guard";

import { JwtUserGuard} from "src/guards/jwt.gurad";
import { LocalAuthGuard } from "src/guards/login.guard";
import { ParamGuard } from "src/guards/param.guard";
import { DtoValidationPipe } from "src/pipes/dtovalidation.pipe";
import { UpdateUserDto } from "./dtos/updateUserDto";
import { UserService } from "./user.service";



@Controller()
export class UserController{
    constructor(private userService: UserService){}

    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)   
    @Get('/:userId')
    async getUserById(@Request() req){
        return req.user
    }

    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)   
    @UseGuards(LocalAuthGuard)
    @Put('/:userId')
    async updateUser(@Request() req, @Body(new DtoValidationPipe())dto: UpdateUserDto,){
        return await this.userService.changeUser(dto, req.user.id);
    }


    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @UseGuards(LocalAuthGuard)
    @HttpCode(204)
    @Delete('/:userId')
    async deleteUser(@Request() req){
        return await this.userService.deleteUser(req.user.id)
    }
}