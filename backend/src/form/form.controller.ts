import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AllowAnyGuard } from '../auth/allow-any.guard';
import { createFormDTO } from './form.dto';
import { FormService } from './form.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('form')
export class FormController {
  constructor(private readonly service: FormService) {}
  @Post(':id')
  @UseGuards(AllowAnyGuard)
  async sendFormAnswer(
    @Param('id') id: string,
    @Body() form: createFormDTO,
    @Req() request,
  ) {
    if (request.user)
      return await this.service.sendFormAnswer(id, form, request.user.id);
    else return await this.service.sendFormAnswer(id, form, 'anon');
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getFormAnswers(@Param('id') id: string, @Req() request) {
    if (request.user)
      return await this.service.getFormAnswers(id, request.user.id);
    else throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}