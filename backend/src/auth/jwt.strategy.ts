import { Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRETKEY'),
      jwtFromRequest: JwtStrategy.extractJWT,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private static extractJWT(req: FastifyRequest): string | null {
    const data = req?.cookies['auth-cookie'];
    if (!data) {
      return null;
    }
    return data;
  }
}

export interface JwtPayload {
  id: string;
}
