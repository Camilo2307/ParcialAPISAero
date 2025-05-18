import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aeropuerto } from './aeropuerto.entity';

@Injectable()
export class AeropuertoService {
  constructor(
    @InjectRepository(Aeropuerto)
    private readonly aeropuertoRepository: Repository<Aeropuerto>,
  ) {}

  async findAll(): Promise<Aeropuerto[]> {
    return await this.aeropuertoRepository.find();
  }

  async findOne(id: string): Promise<Aeropuerto> {
    const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id: Number(id) } });
    if (!aeropuerto) throw new NotFoundException('El aeropuerto con el id dado no fue encontrado');
    return aeropuerto;
  }

  async create(aeropuerto: Aeropuerto): Promise<Aeropuerto> {
    if (!/^[A-Z]{3}$/.test(aeropuerto.codigo))
      throw new BadRequestException('El código del aeropuerto debe tener exactamente 3 letras mayúsculas');
    return await this.aeropuertoRepository.save(aeropuerto);
  }

  async update(id: string, aeropuerto: Aeropuerto): Promise<Aeropuerto> {
    const persisted = await this.findOne(id);
    if (aeropuerto.codigo && !/^[A-Z]{3}$/.test(aeropuerto.codigo))
      throw new BadRequestException('El código del aeropuerto debe tener exactamente 3 letras mayúsculas');
    Object.assign(persisted, aeropuerto);
    return await this.aeropuertoRepository.save(persisted);
  }

  async delete(id: string): Promise<void> {
    const aeropuerto = await this.findOne(id);
    await this.aeropuertoRepository.remove(aeropuerto);
  }
}
