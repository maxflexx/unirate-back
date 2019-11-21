import { IsIn, IsInt, IsOptional } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { PagingDto } from '../../../../common/dto/paging.dto';

@Exclude()
export class GetFeedbackParamsDto extends PagingDto {
  @Transform(item => item != undefined ? +item : item)
  @IsInt()
  @Expose()
  @IsOptional()
  disciplineId: number;

  @Transform(item => item != undefined ? +item : item)
  @IsInt()
  @Expose()
  @IsOptional()
  facultyId: number;

  @IsIn(['student_grade', 'student_grade DESC', 'rating', 'rating DESC', 'created', 'created DESC'])
  @Expose()
  @IsOptional()
  orderBy: number;
}
