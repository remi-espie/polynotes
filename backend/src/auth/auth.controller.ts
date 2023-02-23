import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FastifyReply } from 'fastify';
import { UserDtoLogin } from '../user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(
    @Body() userDto: UserDtoLogin,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<any> {
    return await this.authService.login(userDto, res);
  }

  @Post('logout')
  public async logout(
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<any> {
    res.clearCookie('auth-cookie');
  }
}
