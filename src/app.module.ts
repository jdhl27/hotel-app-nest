import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './client/domain/room.entity';
import { Booking } from './client/domain/booking.entity';
import { TypeRoom } from './client/domain/type-room.entity';
import { ClientModule } from './client/client.module';

@Module({
  imports: [
    ClientModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'hotel',
      entities: [TypeRoom, Room, Booking],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
