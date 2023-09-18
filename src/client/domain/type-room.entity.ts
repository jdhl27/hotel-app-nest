import { Column, Entity, ManyToOne, ObjectId, ObjectIdColumn } from 'typeorm';
import { Room } from './room.entity';
import { RoomType } from './room-type';

@Entity('rooms')
export class TypeRoom {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: RoomType;

  @Column()
  price: number;

  @ManyToOne(() => Room, (rooms) => rooms.type_room)
  @Column()
  rooms: Room[];
}
