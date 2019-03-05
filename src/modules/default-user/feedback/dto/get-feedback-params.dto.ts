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

  @IsIn(['student_grade', 'student_grade DESC', 'rating', 'rating DESC', 'created', 'created DESC'])
  @IsOptional()
  orderBy: number;
}