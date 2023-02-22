import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.strategy';
import { FastifyReply } from 'fastify';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(userDto: UserDto, res: FastifyReply): Promise<any> {
    const user = await this.userService.getUser(userDto);
    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    // generate and sign token
    const token = this._createToken(user._id);
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
    const user = await this.userService.getUserId(payload.id);
    if (!user) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
