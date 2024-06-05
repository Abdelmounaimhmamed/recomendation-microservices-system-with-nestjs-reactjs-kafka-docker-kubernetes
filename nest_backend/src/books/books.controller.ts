import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { MigrationService } from './migration.service';
import { ObjectId } from 'typeorm';

@Controller('books')
export class BooksController {

    constructor(
        private readonly bookSevice : BooksService,
        private readonly migrationService : MigrationService
    ){}

    @Post("/createMessage")
    async createMessage (@Body() kafkaMessage :any ){
        return "Message created";
    }

    @Get("migration")
    async RunMigration() {
        this.migrationService.migrateData();
        return "Successfull migration !";
    }
    
    @Get("/getAllBooks")
    async getAllBooks(){
        return this.bookSevice.getAllBooks();
    }

    @Get("/getBookById/:id")
    async getBookDetails(@Param("id") id : string){
        
        return await this.bookSevice.getBookDetails(id);
    }

    @Post("/createBook/:id")
    async createNewBook(@Param("id") id : string , @Body()data : any){
        return await this.bookSevice.createBook(id , data);
    }

    @Get("getBooksForUser/:id")
    async getBooksForUser(@Param("id") id: string){
        console.log(id);
        return await this.bookSevice.getBooksForUser(id);
    }

}   
