import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user.module/user.entity";
import { UserService } from "src/user.module/user.service";
import { ColumnController } from "./column.controller";
import { ColumnService } from "./column.service";
import { Columns } from "./column.entity";
import { AuthService } from "src/auth.module.ts/auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/auth.module.ts/auth.constants";
import { CardService } from "src/card.module/card.service";
import { Card } from "src/card.module/card.entity";


@Module({
    imports: [
        JwtModule.register({
            secret:jwtConstants.secret,
        }), 
        TypeOrmModule.forFeature([Columns,User,Card]),
        
],
    exports: [ColumnService],
    providers: [ColumnService,UserService,AuthService,CardService],
    controllers: [ColumnController]
})
export class ColumnModule{}

