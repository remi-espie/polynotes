import { Module } from '@nestjs/common';
import { FormService } from './form.service';

@Module({
  providers: [FormService],
})
export class FormModule {}
