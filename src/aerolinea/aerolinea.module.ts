import { Module } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { AerolineaController } from './aerolinea.controller';

@Module({
  providers: [AerolineaService],
  controllers: [AerolineaController]
})
export class AerolineaModule {}
