import CustomError from '../errors/custom.error';
export default class ErrorDTO {
   
    static fromError(error: Error): ErrorDTO {
        if (error instanceof CustomError) {
            return {
                message:error.message,
                date:error.date,
                code:error.code,
                status:error.status,
            };
        }
        return {
            message:error.message,
            date:new Date().toISOString(),
            code:1277,
        };
    }
    message: string;
    date: string;
    code: number;
    status?:number;
    
}