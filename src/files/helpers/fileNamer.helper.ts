import { randomUUID as uuid } from "crypto";
import { Request } from "express";

export const fileNamer = (req:Request,file:Express.Multer.File,callback:Function) => {
    if(!file) return callback(new Error("File is empty"),false);

    const fileExtension = file.mimetype.split("/")[1];
    
    const fileName = `${uuid()}.${fileExtension}` ;
    
    callback(null,fileName);
}