import { Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "src/auth.module.ts/auth.constants";
import { JwtStrategy } from "src/strategies/jwt.strategy";
import { AuthService } from "src/auth.module.ts/auth.service";
import { DtoValidationPipe } from "src/pipes/dtovalidation.pipe";
import { ParamGuard } from "src/guards/param.guard";
import { AccessGuard } from "src/guards/access.guard";




@Module({
    imports:[
        TypeOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.register({
            secret:jwtConstants.secret,
        })    
],
    exports:[UserService],
    providers:[UserService, JwtStrategy, AuthService, DtoValidationPipe,AccessGuard],
    controllers:[UserController]
})
export class UserModule{

}