import { Module } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { AerolineaController } from './aerolinea.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aerolinea } from './aerolinea.entity';
import { Aeropuerto } from '../aeropuerto/aeropuerto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aerolinea, Aeropuerto])],
  controllers: [AerolineaController],
  providers: [AerolineaService],
})
export class AerolineaModule {}
