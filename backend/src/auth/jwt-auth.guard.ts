import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const f = super.canActivate(context) as Promise<boolean>;

    return f
      .then((v) => {
        return v;
      })
      .catch(() => {
        return false;
      });
  }
}
