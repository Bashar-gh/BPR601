import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
    Injectable,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import ErrorDTO from '../models/dtos/error.dto';
import CustomError from '../models/errors/custom.error';
import { JWT_Data } from '../../auth/types/jwt-data.type';

@Injectable()
@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: unknown, host: ArgumentsHost): void {

        const { httpAdapter } = this.httpAdapterHost;
        const errorLogger = new Logger("Error");

        const ctx = host.switchToHttp();
        let url = httpAdapter.getRequestUrl(ctx.getRequest());
        let payLoad = ctx.getRequest().payload;
        if (exception instanceof Error) {
            errorLogger.error(exception.name);
            errorLogger.error(exception.message);
            errorLogger.error(exception.stack);
            let dto = ErrorDTO.fromError(exception);
            if (exception instanceof CustomError) {

                

                httpAdapter.reply(ctx.getResponse(), dto, exception.status);
                return;
            }

            httpAdapter.reply(ctx.getResponse(), dto, dto.status ?? 500);
            return;
        }
        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: url,
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }

}