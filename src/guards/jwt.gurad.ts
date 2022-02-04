import {
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';


  
@Injectable()
export class JwtUserGuard extends AuthGuard('jwtuser') {

    canActivate(context: ExecutionContext) {
      
      return super.canActivate(context);
    }
  
  handleRequest(err, user, info, context, status) {
      
      if (err || !user) {
          throw err || new HttpException({
            status: HttpStatus.FORBIDDEN,
            message: 'Invalid token',
            error: 'Invalid token'
          }, HttpStatus.FORBIDDEN);
      }
      return user;

  }

}

  