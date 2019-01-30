import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimeUtil } from '../../utils/time.util';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'student_grade', nullable: true})
  studentGrade: number;

  @Column()
  rating: number;

  @Column()
  comment: number;

  @Column()
  created: number = TimeUtil.getUnixTime();

  @Column()
  updated: number = 0;

  @Column({name: 'user_login'})
  userLogin: string;

  @Column({name: 'discipline_id'})
  disciplineId: number;
}