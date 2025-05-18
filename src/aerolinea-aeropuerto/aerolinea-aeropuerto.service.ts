import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aerolinea } from '../aerolinea/aerolinea.entity';
import { Aeropuerto } from '../aeropuerto/aeropuerto.entity';

@Injectable()
export class AerolineaAeropuertoService {
  constructor(
    @InjectRepository(Aerolinea)
    private readonly aerolineaRepository: Repository<Aerolinea>,
    @InjectRepository(Aeropuerto)
    private readonly aeropuertoRepository: Repository<Aeropuerto>,
  ) {}

  async addAirportToAirline(aerolineaId: string, aeropuertoId: string): Promise<Aerolinea> {
    const aerolinea = await this.aerolineaRepository.findOne({ where: { id: Number(aerolineaId) }, relations: ['aeropuertos'] });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');

    const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id: Number(aeropuertoId) } });
    if (!aeropuerto) throw new NotFoundException('Aeropuerto no encontrado');

    aerolinea.aeropuertos.push(aeropuerto);
    return await this.aerolineaRepository.save(aerolinea);
  }

  async findAirportsFromAirline(aerolineaId: string): Promise<Aeropuerto[]> {
    const aerolinea = await this.aerolineaRepository.findOne({ where: { id: Number(aerolineaId) }, relations: ['aeropuertos'] });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');
    return aerolinea.aeropuertos;
  }

  async findAirportFromAirline(aerolineaId: string, aeropuertoId: string): Promise<Aeropuerto> {
    const aerolinea = await this.aerolineaRepository.findOne({ where: { id: Number(aerolineaId) }, relations: ['aeropuertos'] });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');

    const aeropuerto = aerolinea.aeropuertos.find(a => a.id === Number(aeropuertoId));
    if (!aeropuerto) throw new NotFoundException('El aeropuerto no está asociado a la aerolínea');
    return aeropuerto;
  }

  async updateAirportsFromAirline(aerolineaId: string, aeropuertosIds: string[]): Promise<Aerolinea> {
    const aerolinea = await this.aerolineaRepository.findOne({ where: { id: Number(aerolineaId) }, relations: ['aeropuertos'] });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');

    const aeropuertos = await this.aeropuertoRepository.findByIds(aeropuertosIds);
    if (aeropuertos.length !== aeropuertosIds.length)
      throw new NotFoundException('Uno o más aeropuertos no fueron encontrados');

    aerolinea.aeropuertos = aeropuertos;
    return await this.aerolineaRepository.save(aerolinea);
  }

  async deleteAirportFromAirline(aerolineaId: string, aeropuertoId: string): Promise<void> {
    const aerolinea = await this.aerolineaRepository.findOne({ where: { id: Number(aerolineaId) }, relations: ['aeropuertos'] });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');

    aerolinea.aeropuertos = aerolinea.aeropuertos.filter(a => a.id !== Number(aeropuertoId));
    await this.aerolineaRepository.save(aerolinea);
  }
}
