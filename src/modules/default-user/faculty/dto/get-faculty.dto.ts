import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { PagingDto } from '../../../../common/dto/paging.dto';

@Exclude()
export class GetFacultyDto extends PagingDto {
  @IsInt()
  @IsPositive()
  @Transform(v => v ? +v : v)
  @IsOptional()
  @Expose()
  facultyId: number;

  @IsString()
  @IsOptional()
  @Expose()
  search: string;
}