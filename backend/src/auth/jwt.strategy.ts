import { Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    console.log(JwtStrategy.extractJWT);
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.SECRETKEY,
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
    console.trace();
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
