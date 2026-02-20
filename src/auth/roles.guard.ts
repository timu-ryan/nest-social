import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from './types';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles-auth.decorator';

type RequestWithUser = Request & { user?: JwtPayload };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        // доступно всем пользователям
        return true;
      }
      const req = context.switchToHttp().getRequest<RequestWithUser>();
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException({
          message: 'Пользователь неавторизован',
        });
      }
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь неавторизован',
        });
      }

      const user = this.jwtService.verify<JwtPayload>(token);
      req.user = user;

      if (!user.roles.some((role) => requiredRoles.includes(role))) {
        throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
      }
      return true;
    } catch {
      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }
  }
}
