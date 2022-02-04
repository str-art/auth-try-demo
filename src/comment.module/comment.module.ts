import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { jwtConstants } from "src/auth.module.ts/auth.constants";
import { AuthService } from "src/auth.module.ts/auth.service";
import { User } from "src/user.module/user.entity";
import { UserService } from "src/user.module/user.service";
import { CommentController } from "./comment.controller";
import { Comments } from "./comment.entity";
import { CommentService } from "./comment.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([Comments,User]),
        JwtModule.register({
            secret:jwtConstants.secret,
        })  ],
    providers:[CommentService,AuthService,UserService],
    controllers:[CommentController],
})
export class CommentModule{

}