import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto.controller';

describe('AerolineaAeropuertoController', () => {
  let controller: AerolineaAeropuertoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AerolineaAeropuertoController],
    }).compile();

    controller = module.get<AerolineaAeropuertoController>(AerolineaAeropuertoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
