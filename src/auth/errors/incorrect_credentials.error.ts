import  CustomError  from "src/global/models/errors/custom.error";

export class IncorrectUserCredentials extends CustomError {
    /**
     *
     */
    constructor(code?: number,) {
        super("User Credentials Not Correct", 403, code ?? 403);


    }
}