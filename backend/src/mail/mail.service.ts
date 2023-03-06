import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserDto } from '../user/user.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDto, token: string) {
    const url = `http://localhost:3001/api/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Polynotes! Please confirm your Email',
      template: './confirmation',
      context: {
        name: user.nickname,
        url,
      },
    });
  }
}
