import { MongoRepository } from 'typeorm';
import { RoomRepository } from '../domain/room.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomType } from '../domain/room-type';
import { TypeRoom } from '../domain/type-room.entity';
import { Room } from '../domain/room.entity';

export class RoomRepositoryImpl implements RoomRepository {
  constructor(
    @InjectRepository(TypeRoom)
    private readonly typeOrmRepository: MongoRepository<TypeRoom>,
  ) {}

  async findRoomByType(
    type: RoomType,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<Room | null> {
    try {
      const typeRoom = await this.typeOrmRepository.findOne({
        where: {
          name: type,
        },
        relations: ['rooms', 'rooms.bookings'],
      });

      if (typeRoom && typeRoom.rooms.length > 0) {
        for (const room of typeRoom.rooms) {
          if (!room.bookings || room.bookings.length === 0) {
            // La habitación no tiene reservas, por lo que está disponible
            return room;
          }

          const isRoomAvailable = room.bookings.every((booking) => {
            if (
              booking.check_out_date instanceof Date &&
              booking.check_in_date instanceof Date
            ) {
              const isOverlap =
                checkInDate < booking.check_out_date &&
                checkOutDate > booking.check_in_date;

              // Verificar si la reserva existente está inactiva o no se superponen las fechas
              const isNotActiveOrNoOverlap = !booking.is_active || !isOverlap;

              return isNotActiveOrNoOverlap;
            }
            return true;
          });

          if (isRoomAvailable) {
            // La habitación está disponible para el rango de fechas
            return room;
          }
        }
      }

      return null; // Todas las habitaciones están ocupadas o no se encontraron habitaciones
    } catch (error) {
      throw error;
    }
  }

  isDateValid(checkInDate: Date, checkOutDate: Date): boolean {
    if (checkOutDate <= checkInDate) {
      return false;
    }
    const currentDate = new Date();

    if (checkInDate < currentDate) {
      return false;
    }

    return true;
  }

  async searchAll(roomParam: string): Promise<Room | Room[]> {
    try {
      const typeRooms = await this.typeOrmRepository.find({
        relations: ['rooms', 'rooms.bookings'],
      });

      if (roomParam) {
        const matchingRoom = typeRooms
          .map((typeRoom) =>
            typeRoom.rooms.find(
              (room) => room.room_num.toString() === roomParam.toString(),
            ),
          )
          .find((room) => room !== undefined);

        if (!matchingRoom) {
          throw new Error('No se encontró la habitación');
        }

        return matchingRoom;
      } else {
        const matchingRooms: Room[] = [];

        for (const typeRoom of typeRooms) {
          for (const room of typeRoom.rooms) {
            if (room.bookings.length > 0) {
              matchingRooms.push(room);
            }
          }
        }

        return matchingRooms;
      }
    } catch (error) {
      throw error;
    }
  }
}
