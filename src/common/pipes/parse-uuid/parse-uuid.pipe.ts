import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class ParseUUIDPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if(isUUID(value,"4")){
      return value
    }else{
      throw new BadRequestException("Param id must be a uuid v4");
    }
  }
}
