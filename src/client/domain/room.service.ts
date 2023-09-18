import { Injectable } from '@nestjs/common';
import { RoomDto } from '../api/dtos/room-dto';
import { RoomRepositoryImpl } from '../infrastructure/room.repositoryimpl';
import { BookingRepositoryImpl } from '../infrastructure/booking.repositoryimpl';
import { Room } from './room.entity';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepositoryImpl,
    private readonly bookingRepository: BookingRepositoryImpl,
  ) {}

  async validate(roomDto: RoomDto): Promise<any> {
    roomDto.check_in_date = new Date(roomDto.check_in_date);
    roomDto.check_out_date = new Date(roomDto.check_out_date);

    const isDateValid = this.roomRepository.isDateValid(
      roomDto.check_in_date,
      roomDto.check_out_date,
    );

    if (!isDateValid)
      throw new Error(
        `La fecha de salida (${roomDto.check_out_date}) no puede ser menor a la de ingreso (${roomDto.check_in_date}) \n o no puede ser una fecha meneor a la actual.`,
      );

    const roomAvailable = await this.roomRepository.findRoomByType(
      roomDto.type_room,
      roomDto.check_in_date,
      roomDto.check_out_date,
    );

    if (!roomAvailable)
      throw new Error(
        'No hay habitaciones disponibles para ' +
          roomDto.type_room +
          ' en las fechas ' +
          roomDto.check_in_date +
          ' - ' +
          roomDto.check_out_date,
      );

    const isTotalPay = await this.bookingRepository.totalPay(
      roomDto.check_in_date,
      roomDto.check_out_date,
      roomDto.type_room,
    );

    return {
      total_pay: isTotalPay,
    };
  }

  async findHistorical(room: string): Promise<Room | Room[]> {
    const response = await this.roomRepository.searchAll(room);
    return response;
  }
}
