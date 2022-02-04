import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { jwtConstants } from "./auth.module.ts/auth.constants";
import { AuthModule } from "./auth.module.ts/auth.module";
import { CardModule } from "./card.module/card.module";
import { ColumnModule } from "./column.module/column.module";
import { CommentModule } from "./comment.module/comment.module";
import { UserModule } from "./user.module/user.module";





@Module({
    imports: [
        AuthModule,
        ColumnModule,
        UserModule,
        CardModule,
        CommentModule,
        JwtModule.register({secret:jwtConstants.secret,}),
        TypeOrmModule.forRoot(),
        PassportModule,
        RouterModule.register([
            {
                path: 'auth', 
                module: AuthModule,
            },
            {
                path: 'users',
                module: UserModule,
                children: [
                    {
                        path: ':userId/columns',
                        module: ColumnModule,
                        children: [
                            {
                                path: ':columnId/cards',
                                module: CardModule,
                                children:[
                                    {
                                        path: ':cardId/comments',
                                        module: CommentModule
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ])
    ],
    exports: [],
    providers: [],
    controllers: []
})
export class AppModule {

}