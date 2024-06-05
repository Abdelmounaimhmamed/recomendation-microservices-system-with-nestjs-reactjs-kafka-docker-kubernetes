import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import {   Between, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class BooksService {

    constructor( 
        @InjectRepository(Book) private readonly bookRepository : Repository<Book>
    ){}
    async getAllBooks (){
        return await this.bookRepository.find();
    }

    async createBook(id : string , book : any){
      const newBook = this.bookRepository.create({...book , userId : id});
        return await this.bookRepository.save(newBook);
    }

    async rateBook(id : string){

        const book = await this.bookRepository.findOne({where : {id }});
    }
    async getBookDetails(id : string ){
        const isBookFound = await this.bookRepository.findOne({where : { id  }});
        console.log(isBookFound);

        if(!isBookFound) {
            throw new HttpException("unauthorized access dude !", HttpStatus.BAD_REQUEST);
        }
        
        return isBookFound;
    }

    async findBooksByIds(bookIds: string[]): Promise<Book[]> {
        return this.bookRepository.findByIds(bookIds);
      }
    
    async findBooksByCountry(country: string): Promise<Book[]> {
      return this.bookRepository.find({ where: { country } });
    }
    
    async findBooksByAuthor(author: string): Promise<Book[]> {
      return this.bookRepository.find({ where: { author } });
    }
    
    async findBooksByPages(pages: number): Promise<Book[]> {
        return this.bookRepository.find({
          where: {
            pages: Between(pages - 10, pages + 10),
          },
        });
    }

    async findBooksByRating(rating: number): Promise<Book[]> {
        return this.bookRepository.find({
          where: {
            rating : rating || rating + 1
          },
        });
    }

    async getBooksForUser(id: string){
      const data =  await this.bookRepository.find({where : {userId:id}});
      console.log(data);
      return data;
    }
    async findBooksByCriteria(criteria: any[]): Promise<Book[]> {
      const books: Book[] = [];
  
      for (const c of criteria) {
        const query = {
          language: c.language,
          country: c.country,
          ...(c.pages ? { pages: parseInt(c.pages, 10) } : {})
        };
  
        const result = await this.bookRepository.find({ where: query });
        books.push(...result);
      }
      return books;
    }

}
