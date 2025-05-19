import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { Aerolinea } from './aerolinea.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repo: Repository<Aerolinea>;

  // Datos simulados con todas las propiedades necesarias
  const aerolineaArray: Aerolinea[] = [
    {
      id: 1,
      nombre: 'AeroTest',
      fechaFundacion: new Date('2000-01-01'),
      descripcion: 'Descripción AeroTest',
      paginaWeb: 'https://aerotest.com',
      aeropuertos: [],
    },
    {
      id: 2,
      nombre: 'AeroMock',
      fechaFundacion: new Date('2010-05-20'),
      descripcion: 'Descripción AeroMock',
      paginaWeb: 'https://aeromock.com',
      aeropuertos: [],
    },
  ];

  const oneAerolinea: Aerolinea = {
    id: 1,
    nombre: 'AeroTest',
    fechaFundacion: new Date('2000-01-01'),
    descripcion: 'Descripción AeroTest',
    paginaWeb: 'https://aerotest.com',
    aeropuertos: [],
  };

  const mockRepository = {
    find: jest.fn().mockResolvedValue(aerolineaArray),
    findOne: jest.fn().mockImplementation(({ where: { id } }) =>
      Promise.resolve(aerolineaArray.find(a => a.id === id))
    ),
    save: jest.fn().mockImplementation((aerolinea: Partial<Aerolinea>) =>
      Promise.resolve({ ...aerolinea, id: 3 } as Aerolinea)
    ),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AerolineaService,
        {
          provide: getRepositoryToken(Aerolinea),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repo = module.get<Repository<Aerolinea>>(getRepositoryToken(Aerolinea));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debería devolver un array de aerolíneas', async () => {
      const result = await service.findAll();
      expect(result).toEqual(aerolineaArray);
      expect(repo.find).toHaveBeenCalledWith({ relations: ['aeropuertos'] });
    });
  });

  describe('findOne', () => {
    it('debería devolver una aerolínea existente', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(oneAerolinea);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['aeropuertos'] });
    });

    it('debería lanzar NotFoundException si no encuentra la aerolínea', async () => {
      repo.findOne = jest.fn().mockResolvedValue(undefined);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('debería crear una aerolínea válida', async () => {
      const nuevaAerolinea: Partial<Aerolinea> = {
        nombre: 'Nueva',
        fechaFundacion: new Date('1999-01-01'),
        descripcion: 'Descripción nueva',
        paginaWeb: 'https://nueva.com',
        aeropuertos: [],
      };
      const result = await service.create(nuevaAerolinea as Aerolinea);
      expect(result.id).toBeDefined();
      expect(repo.save).toHaveBeenCalledWith(nuevaAerolinea);
    });

    it('debería lanzar BadRequestException si la fecha de fundación es en el futuro', async () => {
      const aerolineaFuturo: Partial<Aerolinea> = {
        nombre: 'Futuro',
        fechaFundacion: new Date(Date.now() + 1000000000),
        descripcion: 'Futuro descripción',
        paginaWeb: 'https://futuro.com',
        aeropuertos: [],
      };
      await expect(service.create(aerolineaFuturo as Aerolinea)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('debería actualizar una aerolínea existente', async () => {
      const updateData: Partial<Aerolinea> = {
        nombre: 'Actualizada',
        fechaFundacion: new Date('1995-01-01'),
        descripcion: 'Descripción actualizada',
        paginaWeb: 'https://actualizada.com',
      };
      repo.findOne = jest.fn().mockResolvedValue(oneAerolinea);
      repo.save = jest.fn().mockImplementation(a => Promise.resolve(a as Aerolinea));

      const result = await service.update('1', updateData as Aerolinea);
      expect(result.nombre).toEqual('Actualizada');
      expect(repo.save).toHaveBeenCalled();
    });

    it('debería lanzar BadRequestException si la fecha es futura', async () => {
      const updateData: Partial<Aerolinea> = {
        fechaFundacion: new Date(Date.now() + 1000000000),
      };
      repo.findOne = jest.fn().mockResolvedValue(oneAerolinea);

      await expect(service.update('1', updateData as Aerolinea)).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar NotFoundException si la aerolínea no existe', async () => {
      repo.findOne = jest.fn().mockResolvedValue(undefined);
      await expect(service.update('999', {} as Aerolinea)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('debería eliminar una aerolínea existente', async () => {
      repo.findOne = jest.fn().mockResolvedValue(oneAerolinea);
      repo.remove = jest.fn().mockResolvedValue(undefined);

      await expect(service.delete('1')).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(oneAerolinea);
    });

    it('debería lanzar NotFoundException si la aerolínea no existe', async () => {
      repo.findOne = jest.fn().mockResolvedValue(undefined);
      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
    });
  });
});
