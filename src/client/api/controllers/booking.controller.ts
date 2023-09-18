import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { BookingDto } from '../dtos/booking-dto';
import { Response } from 'express';
import { BookingService } from 'src/client/domain/booking.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Crea una reserva' })
  @ApiResponse({ status: 201, description: 'Reserva creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la solicitud' })
  async create(@Body() bookingDto: BookingDto, @Res() response: Response) {
    try {
      const responseData = await this.bookingService.create(bookingDto);
      response
        .status(201)
        .send(
          `Reserva creada con exito. \n Código: ${responseData?.code} \n Total a pagar: $${responseData?.total_pay}`,
        )
        .json();
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Busca una reserva por código' })
  @ApiQuery({ name: 'code', description: 'Código de la reserva' })
  @ApiResponse({ status: 201, description: 'Reserva encontrada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la solicitud' })
  async search(@Query('code') code: string, @Res() response: Response) {
    try {
      const responseData = await this.bookingService.find(code);
      response.status(201).send(responseData).json();
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete()
  @ApiOperation({ summary: 'Elimina una reserva por código' })
  @ApiQuery({ name: 'code', description: 'Código de la reserva' })
  @ApiResponse({ status: 201, description: 'Reserva eliminada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la solicitud' })
  async deleteBooking(@Query('code') code: string, @Res() response: Response) {
    try {
      const responseData = await this.bookingService.deleteBooking(code);
      response.status(201).send(responseData).json();
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
