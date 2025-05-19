import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto.controller';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

describe('AerolineaAeropuertoController', () => {
  let controller: AerolineaAeropuertoController;
  let service: AerolineaAeropuertoService;

  const mockService = {
    addAirportToAirline: jest.fn(),
    findAirportsFromAirline: jest.fn(),
    findAirportFromAirline: jest.fn(),
    updateAirportsFromAirline: jest.fn(),
    deleteAirportFromAirline: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AerolineaAeropuertoController],
      providers: [
        {
          provide: AerolineaAeropuertoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AerolineaAeropuertoController>(AerolineaAeropuertoController);
    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


});
