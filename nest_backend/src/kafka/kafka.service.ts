import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka,EventPattern, MessagePattern } from '@nestjs/microservices';
import { fromEventPattern, Observable } from 'rxjs';



@Injectable()
export class KafkaService {

    private messages: any[] = [];

    constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}

    async sendClickEvent(data: any) {
        this.kafkaClient.emit('click-topic', data);
    }


    async sendMessagee(data : any) {
        this.kafkaClient.emit('message-topic', data);   
    }

    async createWhatwanted(data : any) {
      this.kafkaClient.emit("what-wanted-books-topic" , data);
    }

    async produceForRate(data : any ){
      this.kafkaClient.emit("rate-topic",data);
    }
    
    
   
    
      @MessagePattern('message-topic')
      async handleMessages(data: any): Promise<void> {
        // Handle the response from Kafka server
        console.log('Received messages:', data);
      }
}


