import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FastifyReply } from 'fastify';
import { UserDtoLogin } from '../user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
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
    return new HttpException('Logout successful', HttpStatus.OK);
  }

  @Get('confirm')
  @UseInterceptors(ClassSerializerInterceptor)
  public async confirm(
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<any> {
    await this.authService.confirm(reply);
    reply.redirect('http://localhost:5173/login');
  }
}
