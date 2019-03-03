import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { PagingDto } from '../../../../common/dto/paging.dto';

@Exclude()
export class GetTeacherAdminDto extends PagingDto{
  @IsInt()
  @IsOptional()
  @IsPositive()
  @Transform(v => v ? +v : v)
  @Expose()
  teacherId: number;

  @IsString()
  @IsOptional()
  @Expose()
  search: string;
}