import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Accept_Status } from "../decorators/status.decorator";
import { UserStatus } from "src/api/users/enums/user-status.enum";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JWT_Data } from "../types/jwt-data.type";


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector, private configService: ConfigService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const acceptedStatus = this.reflector.getAllAndOverride<UserStatus[]>(Accept_Status, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    if (!isPublic) {
      const token = this.extractJWTFromHeader(request);

      if (!token) {
        return false;
      }

      try {
        const payload: JWT_Data = await this.jwtService.verifyAsync(
          token,
          {
            secret: this.configService.get("JWTSECRET")
          }
        );
        if (acceptedStatus) {

          if (acceptedStatus.some((v) => v != payload.accountStatus)) {

            return false;
          };
        } else {
          if (payload.accountStatus != UserStatus.AllGood) {

            return false;
          };
        }
        request['payload'] = payload;

      } catch {

        return false;
      }
    }



    return true;
  }

  private extractJWTFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }


}