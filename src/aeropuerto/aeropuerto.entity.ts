import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Aerolinea } from '../aerolinea/aerolinea.entity';

@Entity()
export class Aeropuerto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  codigo: string;

  @Column()
  pais: string;

  @Column()
  ciudad: string;

  @ManyToMany(() => Aerolinea, aerolinea => aerolinea.aeropuertos)
  aerolineas: Aerolinea[];
}
