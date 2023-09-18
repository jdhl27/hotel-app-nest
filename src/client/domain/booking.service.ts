import { Injectable } from '@nestjs/common';
import { BookingDto } from '../api/dtos/booking-dto';
import { Booking } from './booking.entity';
import { RoomRepositoryImpl } from '../infrastructure/room.repositoryimpl';
import { BookingRepositoryImpl } from '../infrastructure/booking.repositoryimpl';

@Injectable()
export class BookingService {
  constructor(
    private readonly roomRepository: RoomRepositoryImpl,
    private readonly bookingRepository: BookingRepositoryImpl,
  ) {}

  async create(bookingDto: BookingDto): Promise<any> {
    bookingDto.check_in_date = new Date(bookingDto.check_in_date);
    bookingDto.check_out_date = new Date(bookingDto.check_out_date);

    const isDateValid = this.roomRepository.isDateValid(
      bookingDto.check_in_date,
      bookingDto.check_out_date,
    );

    if (!isDateValid)
      throw new Error(
        `La fecha de salida (${bookingDto.check_out_date}) no puede ser menor a la de ingreso (${bookingDto.check_in_date}) \n o no puede ser una fecha meneor a la actual.`,
      );

    const roomAvailable = await this.roomRepository.findRoomByType(
      bookingDto.type_room,
      bookingDto.check_in_date,
      bookingDto.check_out_date,
    );

    if (!roomAvailable)
      throw new Error(
        'No hay habitaciones disponibles para ' +
          bookingDto.type_room +
          ' para las fechas ' +
          bookingDto.check_in_date +
          ' - ' +
          bookingDto.check_out_date,
      );

    const isTotalPay = await this.bookingRepository.totalPay(
      bookingDto.check_in_date,
      bookingDto.check_out_date,
      bookingDto.type_room,
    );

    // Generar codigo de reserva
    const codeGenerate = this.bookingRepository.generateReservationCode(10);

    const booking = new Booking();
    booking.code = codeGenerate;
    booking.customer_document = bookingDto.customer_document;
    booking.customer_name = bookingDto.customer_name;
    booking.check_in_date = bookingDto.check_in_date;
    booking.check_out_date = bookingDto.check_out_date;
    booking.total_pay = isTotalPay;
    booking.is_active = bookingDto?.is_active;

    await this.bookingRepository.createBooking(
      bookingDto.type_room,
      roomAvailable._id,
      booking,
    );

    return {
      code: codeGenerate,
      total_pay: isTotalPay,
    };
  }

  async find(code: string): Promise<Booking[]> {
    const response = await this.bookingRepository.searchBooking(code);
    if (response.length === 0) {
      throw new Error(`No hay reserva con ${code}`);
    }
    return response;
  }

  async deleteBooking(code: string): Promise<Booking | null> {
    const response = await this.bookingRepository.deleteBooking(code);
    if (!response) {
      throw new Error(`No hay reserva con ${code}`);
    }
    return response;
  }
}
