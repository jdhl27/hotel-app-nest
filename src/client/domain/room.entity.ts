import { Column, Entity, ObjectId, ObjectIdColumn, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';
import { TypeRoom } from './type-room.entity';

@Entity()
export class Room {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  room_num: number;

  @OneToMany(() => Booking, (booking) => booking.room)
  @Column()
  bookings: Booking[];

  @OneToMany(() => TypeRoom, (type) => type.rooms)
  type_room: TypeRoom[];
}
