import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Page, PageSchema} from "./page.schema";

@Module({
  providers: [PageService],
  controllers: [PageController],
  imports: [
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
  ],
})
export class PageModule {}
