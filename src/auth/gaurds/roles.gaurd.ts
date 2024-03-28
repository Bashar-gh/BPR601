import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';
import { JWT_Data } from '../types/jwt-data.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {

    const handlerRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),


    ])??[];
    const classRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getClass(),


    ]) ??[];
   
    const requiredRoles = [...classRoles, ...handlerRoles];
    if (requiredRoles.length == 0) {
      return true;
    }
    let request = context.switchToHttp().getRequest();
    const payload: JWT_Data = request.payload;

   
    return requiredRoles.some((role) => role == payload.role);
  }
}