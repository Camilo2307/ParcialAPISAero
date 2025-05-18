import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aerolinea } from './aerolinea.entity';

@Injectable()
export class AerolineaService {
  constructor(
    @InjectRepository(Aerolinea)
    private readonly aerolineaRepository: Repository<Aerolinea>,
  ) {}

  async findAll(): Promise<Aerolinea[]> {
    return await this.aerolineaRepository.find({ relations: ['aeropuertos'] });
  }

  async findOne(id: string): Promise<Aerolinea> {
    const aerolinea = await this.aerolineaRepository.findOne({ where: { id: Number(id) }, relations: ['aeropuertos'] });
    if (!aerolinea) throw new NotFoundException('La aerolínea con el id dado no fue encontrada');
    return aerolinea;
  }

  async create(aerolinea: Aerolinea): Promise<Aerolinea> {
    if (new Date(aerolinea.fechaFundacion) > new Date())
      throw new BadRequestException('La fecha de fundación debe ser en el pasado');
    return await this.aerolineaRepository.save(aerolinea);
  }

  async update(id: string, aerolinea: Aerolinea): Promise<Aerolinea> {
    const persisted = await this.findOne(id);
    if (aerolinea.fechaFundacion && new Date(aerolinea.fechaFundacion) > new Date())
      throw new BadRequestException('La fecha de fundación debe ser en el pasado');
    Object.assign(persisted, aerolinea);
    return await this.aerolineaRepository.save(persisted);
  }

  async delete(id: string): Promise<void> {
    const aerolinea = await this.findOne(id);
    await this.aerolineaRepository.remove(aerolinea);
  }
}
