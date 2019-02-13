import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UpdateDisciplineDto } from '../modules/admin/discipline/dto/update-discipline.dto';

@Entity('discipline')
export class Discipline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  mandatory: number;

  @Column()
  year: number;

  @Column({name: 'faculty_id'})
  facultyId: number;

  updateAdmin(body: UpdateDisciplineDto) {
    this.name = body.name || this.name;
    this.mandatory = body.mandatory != undefined ? body.mandatory : this.mandatory;
    this.year = body.year != undefined ? body.year : this.year;
    this.facultyId = body.facultyId != undefined ? body.facultyId : this.facultyId;
  }

  static fromRaw(raw: any): Discipline {
    const entity = new Discipline();
    entity.id = +raw.id;
    entity.name = raw.name;
    entity.mandatory = raw.mandatory;
    entity.year = raw.year;
    entity.facultyId = +raw.faculty_id;
    return entity;
  }
}