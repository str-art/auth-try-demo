import { Body, Catch, Controller, Delete, Get, HttpCode, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { AccessGuard } from "src/guards/access.guard";
import { JwtUserGuard } from "src/guards/jwt.gurad";
import { ParamGuard } from "src/guards/param.guard";


import { DtoValidationPipe } from "src/pipes/dtovalidation.pipe";
import { ColumnService } from "./column.service";
import { CreateColumnDto } from "./dtos/createColumnDto";
import { UpdateColumnDto } from "./dtos/updateColumnDto";

@ApiBearerAuth()
@ApiTags('Working with columns')
@Controller()
export class ColumnController{
    constructor(private columnService: ColumnService){}

    @ApiCreatedResponse({description: "Column created, created entity is returned"})
    @ApiForbiddenResponse({description: "An attempt to creat a column on behalf of a different user"})
    @ApiOperation({description:"Use it to create a new column"})
    @ApiParam({name: 'userId',description:'Id of user making the request'})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Post()
    createColumn(@Body(new DtoValidationPipe())dto: CreateColumnDto, @Request() req){
        return this.columnService.createColumn(dto,req.user)
    }

    @ApiOkResponse({description: "Credentials are valid, requested column entity is returned"})
    @ApiForbiddenResponse({description: "An attempt to get a column withour access to it"})
    @ApiOperation({description:"Use it to get a certain column"})
    @ApiParam({name: 'userId',description:'Id of user making the request'})
    @ApiParam({name: 'columnId',description:'Id of column you want to get'})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Get('/:columnId')
    getColumn(@Param('columnId')id: number){
        return this.columnService.getColumnById(id)
    }

    @ApiOkResponse({description: "Credentials are valid. All column, a user making the request got access to, returned"})
    @ApiForbiddenResponse({description: "Invalid JWT token is provided"})
    @ApiOperation({description:"Use it to get all columns a users have"})
    @ApiParam({name: 'userId',description:'Id of user making the request'})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Get()
    getAllUserColumns(@Request() req){
        return this.columnService.getAllUserColumns(req.user)
    }

    @ApiOkResponse({description: "Credentials are valid. Column is modified, modified entity returned"})
    @ApiForbiddenResponse({description: "Invalid JWT token is provided or an attempt to modify column without access"})
    @ApiOperation({description:"Use it to change a column. You may change its name, add users or delete users"})
    @ApiParam({name: 'userId',description:'Id of user making the request'})
    @ApiParam({name: 'columnId',description:'Id of column you want to change'})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Put('/:columnId')
    updateColumn(@Param('columnId')id: number, @Body(DtoValidationPipe)dto: UpdateColumnDto){  
        
        return this.columnService.updateColumn(dto, id)
    }

    @ApiNoContentResponse({description: "Credentials are valid. Column is deleted, all entities inside it are deleted."})
    @ApiForbiddenResponse({description: "Invalid JWT token is provided or an attempt to delete column without access"})
    @ApiOperation({description:"Use it to delete a column. All cards inside it will be deleted as well as comments left in this cards."})
    @ApiParam({name: 'userId',description:'Id of user making the request'})
    @ApiParam({name: 'columnId',description:'Id of column you want to delete'})
    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @HttpCode(204)
    @Delete('/:columnId')
    deleteColumn(@Param('columnId')id: number){
        return this.columnService.deleteColumn(id)
    }




}