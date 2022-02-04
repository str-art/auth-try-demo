import { Body, Catch, Controller, Delete, Get, HttpCode, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { AccessGuard } from "src/guards/access.guard";
import { JwtUserGuard } from "src/guards/jwt.gurad";
import { ParamGuard } from "src/guards/param.guard";


import { DtoValidationPipe } from "src/pipes/dtovalidation.pipe";
import { ColumnService } from "./column.service";
import { CreateColumnDto } from "./dtos/createColumnDto";
import { UpdateColumnDto } from "./dtos/updateColumnDto";


@Controller()
export class ColumnController{
    constructor(private columnService: ColumnService){}

    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Post()
    createColumn(@Body(new DtoValidationPipe())dto: CreateColumnDto, @Request() req){
        return this.columnService.createColumn(dto,req.user)
    }

    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Get('/:columnId')
    getColumn(@Param('columnId')id: number){
        return this.columnService.getColumnById(id)
    }

    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Get()
    getAllUserColumns(@Request() req){
        return this.columnService.getAllUserColumns(req.user)
    }

    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @Put('/:columnId')
    updateColumn(@Param('columnId')id: number, @Body(DtoValidationPipe)dto: UpdateColumnDto){  
        
        return this.columnService.updateColumn(dto, id)
    }

    @UseGuards(ParamGuard)
    @UseGuards(JwtUserGuard,AccessGuard)
    @HttpCode(204)
    @Delete('/:columnId')
    deleteColumn(@Param('columnId')id: number){
        return this.columnService.deleteColumn(id)
    }




}