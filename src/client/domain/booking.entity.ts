import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Booking {
  @PrimaryColumn()
  code: string;

  @Column()
  customer_name: string;

  @Column()
  customer_document: string;

  @Column()
  check_in_date: Date;

  @Column()
  check_out_date: Date;

  @Column()
  total_pay: number;

  @Column()
  is_active: boolean = true;

  @ManyToOne(() => Room, (room) => room.bookings)
  room: Room;
}
