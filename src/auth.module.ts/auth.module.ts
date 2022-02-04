import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocalAuthGuard } from "src/guards/login.guard";
import { DtoValidationPipe} from "src/pipes/dtovalidation.pipe";
import { LocalStrategy } from "src/strategies/local.strategy";
import { User } from "src/user.module/user.entity";
import { UserModule } from "src/user.module/user.module";
import { jwtConstants } from "./auth.constants";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports:[
        UserModule,
        JwtModule.register({secret:jwtConstants.secret,}),
        TypeOrmModule.forFeature([User])
    ],
    exports:[
        AuthService
    ],
    providers:[
        AuthService,
        DtoValidationPipe,
        LocalAuthGuard,
        LocalStrategy
    ],
    controllers:[AuthController]
})
export class AuthModule{

}