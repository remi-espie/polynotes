import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/polynotes'),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserModule],
  exports: [],
})
export class AppModule {}
