import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../login/login.dto';
import { FastifyReply } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<any> {
    return await this.authService.login(loginDto, res);
  }

  @Post('logout')
  public async logout(
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<any> {
    res.clearCookie('auth-cookie');
  }
}
