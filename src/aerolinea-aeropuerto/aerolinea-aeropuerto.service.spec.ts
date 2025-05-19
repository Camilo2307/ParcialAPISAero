import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { Aerolinea } from '../aerolinea/aerolinea.entity';
import { Aeropuerto } from '../aeropuerto/aeropuerto.entity';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: jest.Mocked<any>;
  let aeropuertoRepository: jest.Mocked<any>;

  beforeEach(async () => {
    aerolineaRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    aeropuertoRepository = {
      findOne: jest.fn(),
      findByIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AerolineaAeropuertoService,
        { provide: 'AerolineaRepository', useValue: aerolineaRepository },
        { provide: 'AeropuertoRepository', useValue: aeropuertoRepository },
      ],
    })
      .overrideProvider(AerolineaAeropuertoService)
      .useValue(new AerolineaAeropuertoService(aerolineaRepository, aeropuertoRepository))
      .compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
  });

  describe('addAirportToAirline', () => {
    it('debe agregar un aeropuerto a una aerolinea', async () => {
      const aerolinea = { id: 1, aeropuertos: [], save: jest.fn() } as any as Aerolinea;
      const aeropuerto = { id: 2 } as Aeropuerto;

      aerolineaRepository.findOne.mockResolvedValue({ ...aerolinea, aeropuertos: [] });
      aeropuertoRepository.findOne.mockResolvedValue(aeropuerto);
      aerolineaRepository.save.mockResolvedValue({
        ...aerolinea,
        aeropuertos: [aeropuerto],
      });

      const result = await service.addAirportToAirline('1', '2');

      expect(aerolineaRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['aeropuertos'] });
      expect(aeropuertoRepository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(aerolineaRepository.save).toHaveBeenCalled();
      expect(result.aeropuertos).toContain(aeropuerto);
    });

    it('debe lanzar NotFoundException si no encuentra aerolinea', async () => {
      aerolineaRepository.findOne.mockResolvedValue(undefined);
      await expect(service.addAirportToAirline('1', '2')).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException si no encuentra aeropuerto', async () => {
      aerolineaRepository.findOne.mockResolvedValue({ id: 1, aeropuertos: [] });
      aeropuertoRepository.findOne.mockResolvedValue(undefined);
      await expect(service.addAirportToAirline('1', '2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAirportsFromAirline', () => {
    it('debe retornar aeropuertos de una aerolinea', async () => {
      const aeropuertos = [{ id: 1 }, { id: 2 }];
      aerolineaRepository.findOne.mockResolvedValue({ id: 1, aeropuertos });
      const result = await service.findAirportsFromAirline('1');
      expect(result).toEqual(aeropuertos);
    });

    it('debe lanzar NotFoundException si no encuentra aerolinea', async () => {
      aerolineaRepository.findOne.mockResolvedValue(undefined);
      await expect(service.findAirportsFromAirline('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAirportFromAirline', () => {
    it('debe retornar un aeropuerto específico de una aerolinea', async () => {
      const aeropuerto = { id: 2 };
      const aerolinea = { id: 1, aeropuertos: [aeropuerto] };
      aerolineaRepository.findOne.mockResolvedValue(aerolinea);
      const result = await service.findAirportFromAirline('1', '2');
      expect(result).toEqual(aeropuerto);
    });

    it('debe lanzar NotFoundException si no encuentra aerolinea', async () => {
      aerolineaRepository.findOne.mockResolvedValue(undefined);
      await expect(service.findAirportFromAirline('1', '2')).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException si aeropuerto no está asociado', async () => {
      const aerolinea = { id: 1, aeropuertos: [{ id: 3 }] };
      aerolineaRepository.findOne.mockResolvedValue(aerolinea);
      await expect(service.findAirportFromAirline('1', '2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAirportsFromAirline', () => {
    it('debe actualizar aeropuertos asociados a una aerolinea', async () => {
      const aerolinea = { id: 1, aeropuertos: [{ id: 3 }] };
      const aeropuertos = [{ id: 2 }, { id: 4 }];
      aerolineaRepository.findOne.mockResolvedValue(aerolinea);
      aeropuertoRepository.findByIds.mockResolvedValue(aeropuertos);
      aerolineaRepository.save.mockResolvedValue({ ...aerolinea, aeropuertos });

      const result = await service.updateAirportsFromAirline('1', ['2', '4']);

      expect(aeropuertoRepository.findByIds).toHaveBeenCalledWith(['2', '4']);
      expect(aerolineaRepository.save).toHaveBeenCalled();
      expect(result.aeropuertos).toEqual(aeropuertos);
    });

    it('debe lanzar NotFoundException si no encuentra aerolinea', async () => {
      aerolineaRepository.findOne.mockResolvedValue(undefined);
      await expect(service.updateAirportsFromAirline('1', ['2'])).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException si uno o más aeropuertos no existen', async () => {
      aerolineaRepository.findOne.mockResolvedValue({ id: 1, aeropuertos: [] });
      aeropuertoRepository.findByIds.mockResolvedValue([{ id: 2 }]); // falta 1
      await expect(service.updateAirportsFromAirline('1', ['2', '3'])).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAirportFromAirline', () => {
    it('debe eliminar un aeropuerto de una aerolinea', async () => {
      const aeropuertos = [{ id: 2 }, { id: 3 }];
      const aerolinea = { id: 1, aeropuertos };
      aerolineaRepository.findOne.mockResolvedValue(aerolinea);
      aerolineaRepository.save.mockResolvedValue({ id: 1, aeropuertos: [aeropuertos[1]] });

      await service.deleteAirportFromAirline('1', '2');

      expect(aerolineaRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['aeropuertos'] });
      expect(aerolineaRepository.save).toHaveBeenCalled();
      expect(aerolinea.aeropuertos).toEqual([aeropuertos[1]]);
    });

    it('debe lanzar NotFoundException si no encuentra aerolinea', async () => {
      aerolineaRepository.findOne.mockResolvedValue(undefined);
      await expect(service.deleteAirportFromAirline('1', '2')).rejects.toThrow(NotFoundException);
    });
  });
});
