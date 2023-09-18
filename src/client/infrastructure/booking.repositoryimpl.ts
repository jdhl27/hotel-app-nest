import { MongoRepository, ObjectId } from 'typeorm';
import { Booking } from '../domain/booking.entity';
import { BookingRepository } from '../domain/booking.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeRoom } from '../domain/type-room.entity';
import { RoomType } from '../domain/room-type';

export class BookingRepositoryImpl implements BookingRepository {
  constructor(
    @InjectRepository(TypeRoom)
    private readonly typeOrmRepository: MongoRepository<TypeRoom>,
    @InjectRepository(Booking)
    private readonly typeOrmRepositoryBooking: MongoRepository<Booking>,
  ) {}

  async createBooking(
    type: RoomType,
    roomId: ObjectId,
    booking: Booking,
  ): Promise<void> {
    try {
      const typeRoom = await this.typeOrmRepository.findOne({
        where: {
          name: type,
        },
        relations: ['rooms', 'rooms.bookings'],
      });
      if (typeRoom) {
        const roomToUpdate = typeRoom.rooms.find(
          (room) => room._id.toString() === roomId.toString(),
        );

        if (roomToUpdate) {
          if (!roomToUpdate.bookings) {
            roomToUpdate.bookings = [];
          }
          const newBookings = this.typeOrmRepositoryBooking.create(booking);
          roomToUpdate.bookings.push(newBookings);

          await this.typeOrmRepository.save(typeRoom);
        } else {
          throw new Error('No se encontró la habitación seleccionada');
        }
      } else {
        throw new Error('No se encontró el tipo de habitación');
      }
    } catch (error) {
      throw error;
    }
  }

  async totalPay(
    checkIn: Date,
    checkOut: Date,
    typeRoom: RoomType,
  ): Promise<number> {
    try {
      const typeRoomData = await this.typeOrmRepository.findOne({
        where: {
          name: typeRoom,
        },
        relations: ['rooms'],
      });

      if (typeRoomData) {
        // Días de la reserva
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const days = Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / millisecondsPerDay,
        );

        const roomPrice = typeRoomData.price;

        let totalCost = roomPrice * days;

        const ivaRate = 0.19; // 19% de IVA
        const ivaAmount = totalCost * ivaRate;

        if (days > 5) {
          totalCost = totalCost - totalCost * 0.1;
        }

        const totalPay = totalCost + ivaAmount;

        return totalPay;
      } else {
        throw new Error('Tipo de habitación no encontrado');
      }
    } catch (error) {
      throw error;
    }
  }

  generateReservationCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  }

  async searchBooking(code: string): Promise<Booking[]> {
    try {
      const typeRooms = await this.typeOrmRepository.find({
        relations: ['rooms', 'rooms.bookings'],
      });

      const matchingBookings: Booking[] = [];

      for (const typeRoom of typeRooms) {
        for (const room of typeRoom.rooms) {
          if (room.bookings) {
            for (const booking of room.bookings) {
              if (booking.code === code || booking.customer_document === code) {
                matchingBookings.push(booking);
              }
            }
          }
        }
      }

      return matchingBookings;
    } catch (error) {
      throw error;
    }
  }

  async deleteBooking(code: string): Promise<Booking | null> {
    try {
      const typeRooms = await this.typeOrmRepository.find({
        relations: ['rooms', 'rooms.bookings'],
      });

      let matchingBookings: Booking;

      for (const typeRoom of typeRooms) {
        for (const room of typeRoom.rooms) {
          if (room.bookings) {
            for (const booking of room.bookings) {
              if (booking.code === code) {
                booking.is_active = false;
                booking.total_pay =
                  this.shouldApplyCancellationPenalty(booking);
                matchingBookings = booking;
              }
            }
          }
        }
      }

      await this.typeOrmRepository.save(typeRooms);

      return matchingBookings;
    } catch (error) {
      throw error;
    }
  }

  shouldApplyCancellationPenalty(booking: Booking): number {
    const checkInDate = booking.check_in_date as Date;
    const cancellationDate = new Date();

    const daysUntilCheckIn = Math.ceil(
      (checkInDate.getTime() - cancellationDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (daysUntilCheckIn <= 5) {
      const penaltyAmount = booking.total_pay * 0.05; // multa 5%
      return (booking.total_pay += penaltyAmount);
    }

    return booking.total_pay;
  }
}
