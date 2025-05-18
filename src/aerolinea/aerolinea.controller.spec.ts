import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaController } from './aerolinea.controller';

describe('AerolineaController', () => {
  let controller: AerolineaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AerolineaController],
    }).compile();

    controller = module.get<AerolineaController>(AerolineaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
