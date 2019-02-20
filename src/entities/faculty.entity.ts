import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UpdateFacultyDto } from '../modules/admin/faculty/dto/update-faculty.dto';

@Entity('faculty')
export class Faculty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({name: 'short_name'})
  shortName: string;

  static fromRaw(raw: any): Faculty {
    const entity = new Faculty();
    entity.id = +raw.id;
    entity.name = raw.name;
    entity.shortName = raw.short_name;
    return entity;
  }

  updateAdmin(body: UpdateFacultyDto) {
    this.name = body.name || this.name;
    this.shortName = body.shortName || this.shortName;
  }
}