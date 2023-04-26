import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { PageModule } from './page/page.module';
import { sanitizePlugin } from './provider/sanitizePlugin';
import { FormModule } from './form/form.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://mongodb:27017/polynotes', {
      connectionFactory: (connection) => {
        connection.plugin(sanitizePlugin);
        return connection;
      },
    }),
    UserModule,
    AuthModule,
    MailModule,
    PageModule,
    FormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
