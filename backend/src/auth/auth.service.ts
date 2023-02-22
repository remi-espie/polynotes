import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginService } from '../login/login.service';
import { JwtPayload } from './jwt.strategy';
import { LoginDto } from '../login/login.dto';
import { FastifyReply } from 'fastify';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly loginService: LoginService,
  ) {}

  async login(loginDto: LoginDto, res: FastifyReply): Promise<any> {
    const user = await this.loginService.login(loginDto);
    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    // generate and sign token
    const token = this._createToken(user);
    //const expireDate = new Date(process.env.EXPIRESIN)

    res.setCookie('auth-cookie', token, {
      httpOnly: true,
      signed: false,
      maxAge: 100000000000,
      sameSite: 'strict',
      secure: true,
      path: '/',
    });

    return user;
  }

  private _createToken({ id }): any {
    const loginPayload: JwtPayload = { id };
    return this.jwtService.sign(loginPayload);
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.loginService.getLoginId(payload.id);
    if (!user) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
