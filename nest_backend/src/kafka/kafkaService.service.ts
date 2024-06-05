import { Injectable, Logger } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { Book } from 'src/books/book.entity';
import { BooksService } from 'src/books/books.service';

@Injectable()
export class KafkaConsumerService {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private readonly kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka1:9092'],
  });

  constructor(private readonly booksService: BooksService) {}

  async fetchMessages(topic: string): Promise<any[]> {
    const messages: any[] = [];
    const consumer: Consumer = this.kafka.consumer({ groupId: `my-consumer-group-${Math.random()}` });

    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message } : any) => {
        const parsedMessage = JSON.parse(message.value.toString());
        messages.push(parsedMessage);
      },
    });

    // Allow some time to fetch messages, adjust the timeout as necessary
    await new Promise(resolve => setTimeout(resolve, 5000));

    await consumer.disconnect();

    return messages;
  }

  async processMessages(messages: any[]): Promise<any> {
    const userBooks: { [key: string]: string[] } = {};

    // Group bookIds by userId
    messages.forEach(msg => {
      const { userId, bookId } = msg;
      if (!userBooks[userId]) {
        userBooks[userId] = [];
      }
      userBooks[userId].push(bookId);
    });

    const results: { [key: string]: Book[] } = {};

    for (const userId in userBooks) {
      const bookIds = userBooks[userId];
      const books = await this.booksService.findBooksByIds(bookIds);
      
      const recommendationsMap = new Map<string, Book>();

      for (const book of books) {
        const [similarByCountry, similarByAuthor, similarByPages] = await Promise.all([
          this.booksService.findBooksByCountry(book.country),
          this.booksService.findBooksByAuthor(book.author),
          this.booksService.findBooksByPages(book.pages),
        ]);

        similarByCountry.forEach(book => {
          const key = `${book.author}-${book.title}-${book.pages}`;
          if (!recommendationsMap.has(key)) {
            recommendationsMap.set(key, book);
          }
        });

        similarByAuthor.forEach(book => {
          const key = `${book.author}-${book.title}-${book.pages}`;
          if (!recommendationsMap.has(key)) {
            recommendationsMap.set(key, book);
          }
        });

        similarByPages.forEach(book => {
          const key = `${book.author}-${book.title}-${book.pages}`;
          if (!recommendationsMap.has(key)) {
            recommendationsMap.set(key, book);
          }
        });
      }

      results[userId] = Array.from(recommendationsMap.values());
    }

    return results;
  }

  async processRatings(messages: any[]): Promise<any> {
    const results: { [key: string]: Book[] } = {};

    for (const msg of messages) {
      const { userId, rating } = msg;

      // Find books with a rating greater than or equal to the provided rating
      const books = await this.booksService.findBooksByRating(rating);
      console.log(books);
      results[userId] = books;
    }
    return results;
  }

  async processAndQueryBooks(topic: string): Promise<Book[]> {
    const kafkaMessages = await this.fetchMessages(topic);
    const userId = kafkaMessages.length > 0 ? kafkaMessages[0].userId : null;

    if (!userId) {
      return [];
    }

    const criteria = kafkaMessages.map(msg => ({
      language: msg.bookLanguage,
      country: msg.bookCountry,
      ...(msg.bookpages ? { pages: msg.bookpages } : {})
    }));

    const books = await this.booksService.findBooksByCriteria(criteria);

    return books;
  }
}
