import { Type } from "@nestjs/common";
import CustomError from "../models/errors/custom.error";

export default class NotFound extends CustomError{
    /**
     *
     */
    constructor(model:Type) {
        super(`${model.name} Not Found`,404,404);
        
    }
}