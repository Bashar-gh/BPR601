import  CustomError  from "src/global/models/errors/custom.error";

export class UserAlreadyExists extends CustomError {
    /**
     *
     */
    constructor(code?: number,) {
        super("User is Already Resgistered", 401, code ?? 401);


    }
}