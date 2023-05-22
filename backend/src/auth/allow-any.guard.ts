import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AllowAnyGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const f = super.canActivate(context) as Promise<boolean>;

    return f
      .then(() => {
        return true;
      })
      .catch(() => {
        return true;
      });
  }
}
