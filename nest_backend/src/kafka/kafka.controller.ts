import { Body, Controller, Get, Post } from "@nestjs/common";
import { KafkaService } from './kafka.service';




@Controller()
export class KafkaController {

    constructor(
        private readonly Kafkaservice : KafkaService,
    ) { }

    @Post("/createTopic")
    async sendMessagee(@Body() data : any) {
      console.log(data);
         this.Kafkaservice.sendMessagee(data);
         return "topic has been created successfully !";
    }

    // @Get('/getTopics')
    // async getTopics(): Promise<string[]> {
    //   return this.Kafkaservice.getTopics();
    // }

    @Post("/rateBook")
    async rateBook(@Body() rateBookDto: any ){
      await this.Kafkaservice.produceForRate( rateBookDto);
      return { status: 'Rating submitted' };
    }


    @Post("/tellBookwwanted")
    async createWhatwanted(@Body() readData : any ){
       await this.Kafkaservice.createWhatwanted(readData);
       return "data submitted ";
    }


}