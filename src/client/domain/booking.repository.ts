import { ObjectId } from 'typeorm';
import { Booking } from './booking.entity';
import { RoomType } from './room-type';

export interface BookingRepository {
  createBooking(
    type: RoomType,
    roomId: ObjectId,
    booking: Booking,
  ): Promise<void>;
  searchBooking(code: string): Promise<Booking[]>;
  deleteBooking(code: string): Promise<Booking | null>;
  shouldApplyCancellationPenalty(booking: Booking): number;
  totalPay(checkIn: Date, checkOut: Date, typeRoom: RoomType): Promise<number>;
  generateReservationCode(length: number): string;
}
