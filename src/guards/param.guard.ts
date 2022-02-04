import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Observable } from "rxjs";
import { ParamDto } from "src/user.module/dtos/params.dto";

@Injectable()
export class ParamGuard implements CanActivate{
    async canActivate(context: ExecutionContext):Promise<boolean> {
        
        const req = context.switchToHttp().getRequest();
        const params = req.params;
        const paramsClass = plainToClass(ParamDto, params);
        const errors = await validate(paramsClass);
        
        if(errors.length > 0) throw new BadRequestException;
        return true;
    }
}