import { Controller, Get, Param } from '@nestjs/common';
import { KafkaConsumerService } from './kafkaService.service';

@Controller('kafka-consumer')
export class KafkaConsumerController {
  constructor(private readonly kafkaConsumerService: KafkaConsumerService) {}

  @Get('fetch/:topic')
  async fetchMessages(@Param('topic') topic: string) {
    const messages = await this.kafkaConsumerService.fetchMessages(topic);
    const processedData = await this.kafkaConsumerService.processMessages(messages);
    return { data: processedData };
  }
  @Get('fetchDataRate/:topic')
  async fetchMessagesForRate(@Param('topic') topic: string){
    const messages = await this.kafkaConsumerService.fetchMessages(topic);
    const processedData = await this.kafkaConsumerService.processRatings(messages);
    return { data: processedData };
  }


  @Get('fetchWantedData')
  async getBooksForUser(@Param('userId') userId: string) {
    const topic = 'what-wanted-books-topic';
    

  }

}



