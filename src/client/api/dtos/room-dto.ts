import { Transform } from 'class-transformer';
import { IsNotEmpty, IsDate, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoomType } from 'src/client/domain/room-type';

export class RoomDto {
  @IsNotEmpty()
  @IsEnum(RoomType, { message: 'El tipo de habitación no es válido' })
  @ApiProperty({ enum: RoomType, description: 'Tipo de habitación' })
  type_room: RoomType;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: 'Fecha de check-in' })
  check_in_date: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: 'Fecha de check-out' })
  check_out_date: Date;
}
