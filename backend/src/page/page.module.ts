import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Page, PageSchema } from './page.schema';
import { UserModule } from '../user/user.module';

@Module({
  providers: [PageService],
  controllers: [PageController],
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
  ],
  exports: [PageService],
})
export class PageModule {}
