import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { Aeropuerto } from './aeropuerto.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repo: Repository<Aeropuerto>;

  const aeropuertoMockData: Aeropuerto[] = [
    {
      id: 1,
      nombre: 'Aeropuerto 1',
      codigo: 'ABC',
      ciudad: 'Ciudad 1',
      pais: 'Pais 1',
      aerolineas: [],
    },
    {
      id: 2,
      nombre: 'Aeropuerto 2',
      codigo: 'DEF',
      ciudad: 'Ciudad 2',
      pais: 'Pais 2',
      aerolineas: [],
    },
  ];

  const oneAeropuerto: Aeropuerto = {
    id: 1,
    nombre: 'Aeropuerto 1',
    codigo: 'ABC',
    ciudad: 'Ciudad 1',
    pais: 'Pais 1',
    aerolineas: [],
  };

  const mockRepository = {
    find: jest.fn().mockResolvedValue(aeropuertoMockData),
    findOne: jest.fn().mockImplementation(({ where: { id } }) =>
      Promise.resolve(aeropuertoMockData.find(a => a.id === id)),
    ),
    save: jest.fn().mockImplementation(aeropuerto => Promise.resolve({ ...aeropuerto, id: aeropuerto.id ?? 3 })),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AeropuertoService,
        {
          provide: getRepositoryToken(Aeropuerto),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repo = module.get<Repository<Aeropuerto>>(getRepositoryToken(Aeropuerto));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debe devolver un array de aeropuertos', async () => {
      const result = await service.findAll();
      expect(result).toEqual(aeropuertoMockData);
      expect(repo.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('debe devolver un aeropuerto válido por id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(oneAeropuerto);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debe lanzar NotFoundException si no existe aeropuerto', async () => {
      repo.findOne = jest.fn().mockResolvedValue(undefined);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('debe crear un aeropuerto con código válido', async () => {
      const nuevoAeropuerto: Aeropuerto = {
        nombre: 'Nuevo Aeropuerto',
        codigo: 'XYZ',
        ciudad: 'Ciudad Nueva',
        pais: 'Pais Nuevo',
        aerolineas: [],
      } as Aeropuerto;

      const result = await service.create(nuevoAeropuerto);
      expect(result.id).toBeDefined();
      expect(repo.save).toHaveBeenCalledWith(nuevoAeropuerto);
    });

    it('debe lanzar BadRequestException si el código no tiene 3 letras mayúsculas', async () => {
      const aeropuertoInvalido: Aeropuerto = {
        nombre: 'Inválido',
        codigo: 'x1',
        ciudad: 'Ciudad',
        pais: 'Pais',
        aerolineas: [],
      } as Aeropuerto;

      await expect(service.create(aeropuertoInvalido)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('debe actualizar un aeropuerto válido', async () => {
      repo.findOne = jest.fn().mockResolvedValue(oneAeropuerto);
      repo.save = jest.fn().mockImplementation(aeropuerto => Promise.resolve(aeropuerto));

      const updateData: Aeropuerto = {
        id: 1,
        nombre: 'Aeropuerto Actualizado',
        codigo: 'QWE',
        ciudad: 'Ciudad Actualizada',
        pais: 'Pais Actualizado',
        aerolineas: [],
      };

      const result = await service.update('1', updateData);
      expect(result.nombre).toBe('Aeropuerto Actualizado');
      expect(repo.save).toHaveBeenCalledWith(expect.objectContaining(updateData));
    });

    it('debe lanzar BadRequestException si el código es inválido', async () => {
      repo.findOne = jest.fn().mockResolvedValue(oneAeropuerto);

      const updateData: Aeropuerto = {
        id: 1,
        nombre: 'Nombre',
        codigo: '12',
        ciudad: 'Ciudad',
        pais: 'Pais',
        aerolineas: [],
      };

      await expect(service.update('1', updateData)).rejects.toThrow(BadRequestException);
    });

    it('debe lanzar NotFoundException si el aeropuerto a actualizar no existe', async () => {
      repo.findOne = jest.fn().mockResolvedValue(undefined);
      await expect(service.update('999', oneAeropuerto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('debe eliminar un aeropuerto existente', async () => {
      repo.findOne = jest.fn().mockResolvedValue(oneAeropuerto);
      repo.remove = jest.fn().mockResolvedValue(undefined);

      await expect(service.delete('1')).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(oneAeropuerto);
    });

    it('debe lanzar NotFoundException si el aeropuerto no existe para eliminar', async () => {
      repo.findOne = jest.fn().mockResolvedValue(undefined);
      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
    });
  });
});
