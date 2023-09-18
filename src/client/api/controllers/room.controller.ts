import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { RoomDto } from '../dtos/room-dto';
import { Response } from 'express';
import { RoomService } from 'src/client/domain/room.service';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Verificar disponibilidad de habitación' })
  @ApiResponse({
    status: 201,
    description: 'Disponibilidad verificada exitosamente',
  })
  @ApiBadRequestResponse({ description: 'Error en la solicitud' })
  async searchAvailableRoom(
    @Body() roomDto: RoomDto,
    @Res() response: Response,
  ) {
    try {
      const responseData = await this.roomService.validate(roomDto);
      response
        .status(201)
        .send(
          `Si hay disponibilidad de la habitación(${roomDto.type_room}) del ${roomDto.check_in_date} al ${roomDto.check_out_date}. \n Total a pagar: $${responseData?.total_pay} `,
        )
        .json();
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener histórico de habitaciones o habitación' })
  @ApiQuery({
    name: 'room',
    description: 'Número de habitación',
    required: false,
  })
  @ApiResponse({
    status: 201,
    description: 'Historial de habitaciones obtenido exitosamente',
  })
  @ApiBadRequestResponse({ description: 'Error en la solicitud' })
  async getHistorical(@Query('room') room: string, @Res() response: Response) {
    try {
      const responseData = await this.roomService.findHistorical(room);
      response.status(201).send(responseData).json();
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
