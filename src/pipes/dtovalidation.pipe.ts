import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DtoValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);

    const errors = await validate(object,{
        skipMissingProperties: false,
        whitelist: false,
        forbidNonWhitelisted: false,
        dismissDefaultMessages: false,
        validationError: {
          target: true,
          value: true
  },
      forbidUnknownValues: true,
      stopAtFirstError: false
 });
 
  
     if (errors.length > 0) {
       console.log(errors)
       throw new BadRequestException;
     }
     return value;
   
}

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }



}