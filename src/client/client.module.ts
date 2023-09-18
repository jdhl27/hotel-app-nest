import { Module } from '@nestjs/common';
import { BookingController } from './api/controllers/booking.controller';
import { RoomController } from './api/controllers/room.controller';
import { BookingService } from './domain/booking.service';
import { RoomService } from './domain/room.service';
import { BookingRepositoryImpl } from './infrastructure/booking.repositoryimpl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './domain/booking.entity';
import { Room } from './domain/room.entity';
import { TypeRoom } from './domain/type-room.entity';
import { RoomRepositoryImpl } from './infrastructure/room.repositoryimpl';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    TypeOrmModule.forFeature([Room]),
    TypeOrmModule.forFeature([TypeRoom]),
  ],
  controllers: [BookingController, RoomController],
  providers: [
    BookingService,
    RoomService,
    BookingRepositoryImpl,
    RoomRepositoryImpl,
  ],
})
export class ClientModule {}
