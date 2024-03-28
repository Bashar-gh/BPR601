import  CustomError  from "src/global/models/errors/custom.error";

export class IncorrectOtpCode extends CustomError {
    /**
     *
     */
    constructor(code?: number,) {
        super("Incorrect Code", 403, code ?? 403);


    }
}