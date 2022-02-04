import { Body, Controller, Delete, Get, HttpCode, Put, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AccessGuard } from "src/guards/access.guard";

import { JwtUserGuard} from "src/guards/jwt.gurad";
import { LocalAuthGuard } from "src/guards/login.guard";
import { ParamGuard } from "src/guards/param.guard";
import { DtoValidationPipe } from "src/pipes/dtovalidation.pipe";
import { UpdateUserDto } from "./dtos/updateUserDto";
import { UserService } from "./user.service";

@ApiBearerAuth()
@ApiTags('Working with users')
@Controller()
export class UserController{
    constructor(private userService: UserService){}

    @ApiOperation({description:'Returns all information about user: id, email, '})
    @ApiOkResponse({description: "User have access to this entity, all entity fields returned"})
    @ApiForbiddenResponse({description: "User doesnt have access to this entity"})
    @ApiParam({name: 'userId',description:'id of user. Should be the id of user making the request'})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)   
    @Get('/:userId')
    async getUserById(@Request() req){
        return req.user
    }


    @ApiOperation({description:'Change either users email or users password'})
    @ApiOkResponse({description: "Requested properties change, updated entity returned"})
    @ApiForbiddenResponse({description: "An attemp to change other user"})
    @ApiParam({name: 'userId', description:'id of user. Should be the id of user making the request'})
    @UseGuards(ParamGuard)
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)   
    @UseGuards(LocalAuthGuard)
    @Put('/:userId')
    async updateUser(@Request() req, @Body(new DtoValidationPipe())dto: UpdateUserDto,){
        return await this.userService.changeUser(dto, req.user.id);
    }


    @ApiOperation({description:'Delete a user. Must provide a valid password'})
    @ApiNoContentResponse({description: "User deleted, empty body returned"})
    @ApiForbiddenResponse({description: "An attemp to delete other user"})
    @ApiParam({name: 'userId', description:'id of user. Should be the id of user making the request'})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @UseGuards(LocalAuthGuard)
    @HttpCode(204)
    @Delete('/:userId')
    async deleteUser(@Request() req){
        return await this.userService.deleteUser(req.user.id)
    }
}