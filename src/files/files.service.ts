import { BadRequestException, Injectable } from '@nestjs/common';
import * as Path from 'path';
import * as fs from "fs";

@Injectable()
export class FilesService {


  public getStaticProductImage(imageName: string) {
    const path = Path.join(__dirname,"../../static/uploads",imageName);
    
    if( !fs.existsSync(path) ){
      throw new BadRequestException(`Not product found with image ${imageName}`);
    }
    
    return path;
  }
}
