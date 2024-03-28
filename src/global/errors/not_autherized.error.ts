import { Type } from "@nestjs/common";
import CustomError from "../models/errors/custom.error";

export default class NotAutherized extends CustomError{
    /**
     *
     */
    constructor() {
        super(`Fobidden`,403,403);
        
    }
}