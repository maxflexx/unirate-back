import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UpdateTeacherAdminDto } from '../modules/admin/teacher/dto/update-teacher-admin.dto';

@Entity('teacher')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({name: 'last_name'})
  lastName: string;

  @Column({name: 'middle_name'})
  middleName: string;

  static fromRaw(raw: any): Teacher {
    const entity = new Teacher();
    entity.id = +raw.id;
    entity.name = raw.name;
    entity.lastName = raw.last_name;
    entity.middleName = raw.middle_name;
    return entity;
  }

  updateAdmin(body: UpdateTeacherAdminDto) {
    this.middleName = body.middleName || this.middleName;
    this.lastName = body.lastName || this.lastName;
    this.name = body.name || this.name;
  }
}