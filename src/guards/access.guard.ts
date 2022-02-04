import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Card } from "src/card.module/card.entity";
import { Columns } from "src/column.module/column.entity";
import { Comments } from "src/comment.module/comment.entity";

@Injectable()
export class AccessGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const params = req.params;
        const user = req.user;
        
        if(params.commentId && req.method != 'GET' && req.method != 'POST'){
            const allow = user.comments.find((comment: Comments) => comment.id == params.commentId);
            if(!allow) throw new ForbiddenException(this.exceptionOptions);
        };
        
        if(params.cardId && req.method != 'GET'){
            const allow = user.cards.find((card: Card) => card.id == params.cardId);
            if(!allow) throw new ForbiddenException(this.exceptionOptions);
        };

        if(params.columnId){
            
            const allow = user.columns.find((columns: Columns) => columns.id == params.columnId);
            
            if(!allow) throw new ForbiddenException(this.exceptionOptions);
        };

        if(params.userId != user.id){
            throw new ForbiddenException(this.exceptionOptions);
        };
        return true;
    }


    exceptionOptions = {
        status: 403,
        message: 'Acess denied'
    }
}