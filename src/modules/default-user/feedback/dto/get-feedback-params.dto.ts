import { IsIn, IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PagingDto } from '../../../../common/dto/paging.dto';

export class GetFeedbackParamsDto extends PagingDto {
  @Transform(item => item != undefined ? +item : item)
  @IsInt()
  @IsOptional()
  disciplineId: number;

  @Transform(item => item != undefined ? +item : item)
  @IsInt()
  @IsOptional()
  facultyId: number;

  @IsIn(['id', 'student_grade', 'rating', `comment`, 'created', 'updated', 'user_login', 'discipline_id'])
  @IsOptional()
  orderBy: number;
}