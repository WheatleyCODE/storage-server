import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccessTokenService } from 'src/tokens/access-token/access-token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private accessTokenService: AccessTokenService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const authHeader: string = req.headers.authorization || '';
      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new HttpException(
          'Пользователь не авторизован (JwtAuthGuard)',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const userTransferData = this.accessTokenService.verify(token);
      req.userTransferData = userTransferData;
      return true;
    } catch (e) {
      throw e;
    }
  }
}
