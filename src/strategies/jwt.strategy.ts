import {Injectable } from "@nestjs/common";
import { ContextIdFactory, ModuleRef } from "@nestjs/core";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "src/auth.module.ts/auth.constants";

import { UserService } from "src/user.module/user.service";




@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwtuser'){
    constructor(private moduleRef: ModuleRef){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: jwtConstants.secret,
            passReqToCallback: true,
        });
    }


    
    async validate(req, payload: any){
        
        const contextId = ContextIdFactory.getByRequest(req)
        const userService = await this.moduleRef.resolve(UserService,contextId)
        
        const user = await userService.getUserById(payload.sub)
        
        if(user)
        {return user;}
        else 
        {return null}
        
    }
}