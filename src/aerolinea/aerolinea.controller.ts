import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { AerolineaDto } from './aerolinea.dto';

@Controller('airlines')
export class AerolineaController {
  
  @Get()
  findAll() {
    // lógica para listar todas las aerolíneas
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // lógica para obtener una aerolínea por id
  }

  @Post()
  create(@Body() aerolineaDto: AerolineaDto) {
    // lógica para crear aerolínea
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() aerolineaDto: AerolineaDto) {
    // lógica para actualizar aerolínea
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    // lógica para eliminar aerolínea
  }
}
