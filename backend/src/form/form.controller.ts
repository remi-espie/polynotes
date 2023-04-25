import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AllowAnyGuard } from '../auth/allow-any.guard';
import { createFormDTO } from './form.dto';
import { FormService } from './form.service';

@Controller('form')
export class FormController {
  constructor(private readonly service: FormService) {}
  @Post(':id')
  @UseGuards(AllowAnyGuard)
  async sendForm(
    @Param('id') id: string,
    @Body() form: createFormDTO,
    @Req() request,
  ) {
    if (request.user)
      return await this.service.sendForm(id, form, request.user.id);
    else return await this.service.sendForm(id, form, 'anon');
  }

  @Get(':id')
  @UseGuards(UseGuards)
  async getForms(@Param('id') id: string, @Req() request) {
    return await this.service.getForms(id, request.user.id);
  }
}
