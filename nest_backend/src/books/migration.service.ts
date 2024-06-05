import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import * as fs from 'fs';
import * as path from 'path';
import  {books} from "./data.include";


@Injectable()
export class MigrationService {

  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ){}

  async migrateData() {
    console.log(books);
    for (const bookData of books) {
      const book = this.bookRepository.create(bookData);
      await this.bookRepository.save(book);
    }
  }
}




