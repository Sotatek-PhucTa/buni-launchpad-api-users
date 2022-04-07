import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppAuthMiddleware } from './middlewares/app-auth.middleware';
import { AppLoggerMiddleware } from './middlewares/app-logger.middleware';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
    consumer.apply(AppAuthMiddleware).forRoutes('*');
  }
}
