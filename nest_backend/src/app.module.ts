import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books/book.entity';
import { KafkaModule } from './kafka/kafka.module';
import { UserEntity } from './auth/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mongodb",
      url:"mongodb://myUserAdmin:abc123@mongodb:27017/admin",
      synchronize: true,
      port:27017,
      entities:[Book,UserEntity],
  }),
  BooksModule, AuthModule, KafkaModule ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {

}