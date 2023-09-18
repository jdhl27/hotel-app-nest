import { RoomType } from './room-type';
import { Room } from './room.entity';

export interface RoomRepository {
  findRoomByType(
    type: RoomType,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<Room | null>;
  isDateValid(checkInDate: Date, checkOutDate: Date): boolean;
  searchAll(room: string): Promise<Room | Room[]>;
}
