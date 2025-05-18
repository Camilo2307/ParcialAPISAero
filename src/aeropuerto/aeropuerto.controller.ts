import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { AeropuertoDto } from './aeropuerto.dto';

@Controller('airports')
export class AeropuertoController {
  
  @Get()
  findAll() {
    // lógica para listar todos los aeropuertos
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // lógica para obtener aeropuerto por id
  }

  @Post()
  create(@Body() aeropuertoDto: AeropuertoDto) {
    // lógica para crear aeropuerto
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() aeropuertoDto: AeropuertoDto) {
    // lógica para actualizar aeropuerto
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    // lógica para eliminar aeropuerto
  }
}
