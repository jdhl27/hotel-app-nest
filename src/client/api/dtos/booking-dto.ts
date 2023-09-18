import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmpty, IsDate, IsEnum } from 'class-validator';
import { RoomType } from 'src/client/domain/room-type';

export class BookingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nombre del cliente' })
  customer_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Documento del cliente' })
  customer_document: string;

  @IsEnum(RoomType, { message: 'El tipo de habitación no es válido' })
  @IsNotEmpty()
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

  @IsEmpty()
  total_pay?: number;

  @IsEmpty()
  @ApiProperty({
    description: 'La reserva está activa',
    required: false,
    default: true,
  })
  is_active?: boolean;
}
