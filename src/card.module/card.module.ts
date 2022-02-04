import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";
import { Card } from "./card.entity";
import { UserService } from "src/user.module/user.service";
import { User } from "src/user.module/user.entity";
import { Columns } from "src/column.module/column.entity";
import { AuthService } from "src/auth.module.ts/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "src/auth.module.ts/auth.constants";
import { ColumnService } from "src/column.module/column.service";




@Module({
    imports:[
        JwtModule.register({
            secret:jwtConstants.secret,
        }),  
        TypeOrmModule.forFeature([Card,User,Columns])
    ],
    exports:[CardService],
    providers:[CardService,UserService,AuthService,ColumnService],
    controllers:[CardController],
})
export class CardModule{
}