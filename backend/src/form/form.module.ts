import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { UserModule } from '../user/user.module';
import { PageModule } from '../page/page.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Form, FormSchema } from './form.schema';

@Module({
  providers: [FormService],
  controllers: [FormController],
  imports: [
    UserModule,
    PageModule,
    MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }]),
  ],
})
export class FormModule {}
