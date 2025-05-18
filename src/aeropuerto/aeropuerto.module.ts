import { Module } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoController } from './aeropuerto.controller';

@Module({
  providers: [AeropuertoService],
  controllers: [AeropuertoController]
})
export class AeropuertoModule {}
