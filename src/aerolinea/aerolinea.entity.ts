import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Aeropuerto } from '../aeropuerto/aeropuerto.entity';

@Entity()
export class Aerolinea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({ type: 'date' })
  fechaFundacion: Date;

  @Column()
  paginaWeb: string;

  @ManyToMany(() => Aeropuerto, aeropuerto => aeropuerto.aerolineas)
  @JoinTable()
  aeropuertos: Aeropuerto[];
}
