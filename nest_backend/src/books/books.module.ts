import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { MigrationService } from './migration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BooksService } from './books.service';

@Module({
  imports:[TypeOrmModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [MigrationService,BooksService],
  exports: [MigrationService,BooksService],
})


export class BooksModule {}
