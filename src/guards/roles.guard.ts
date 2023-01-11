import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/decorators/roles-auth.decorator';
import { AccessTokenService } from 'src/tokens/access-token/access-token.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getClass(),
        context.getHandler(),
      ]);

      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const authHeader: string = req.headers.authorization || '';
      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new HttpException(
          'Пользователь не авторизован (JwtAuthGuard)',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = this.accessTokenService.verify(token);
      const isAccess = user.roles.some((role) => requiredRoles.includes(role));

      if (!isAccess) {
        throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
      }

      return true;
    } catch (e) {
      throw e;
    }
  }
}
