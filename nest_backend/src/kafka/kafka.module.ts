import { Module, OnModuleInit } from '@nestjs/common';
import { ClientsModule, Transport, ClientKafka } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { KafkaController } from './kafka.controller';
import { KafkaConsumerController } from './KafkaConsumer.controller';
import { KafkaConsumerService } from './kafkaService.service';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [BooksModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka1:9092'],
          },
          consumer: {
            groupId: 'my-consumer-group-' + Math.random(),
          },
        },
      },
    ]),
  ],
  controllers: [KafkaController, KafkaConsumerController],
  providers: [KafkaService, KafkaConsumerService],
  exports: [KafkaService, KafkaConsumerService],
})
export class KafkaModule {}
