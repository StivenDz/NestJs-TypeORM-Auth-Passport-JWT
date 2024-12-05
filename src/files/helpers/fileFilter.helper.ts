import { BadRequestException } from "@nestjs/common";
import { Request } from "express";

export const fileFilter = (req:Request,file:Express.Multer.File,callback:Function) => {
    if(!file) return callback(new BadRequestException("File is empty"),false);
    // if(!file) return new BadRequestException("file is empty");

    const fileExtension = file.mimetype.split("/")[1];
    const validExtensions = ["jpg","jpeg","png","gif"];

    if(validExtensions.includes(fileExtension)){
        return callback(null,true);
    }
    
    callback(null,true);
}