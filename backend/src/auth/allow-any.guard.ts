import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AllowAnyGuard extends AuthGuard('jwt') {
  canActivate(): boolean | Promise<boolean> | Observable<boolean> {

    return true;
  }
}
