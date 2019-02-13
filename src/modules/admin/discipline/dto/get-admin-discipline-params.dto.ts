import { IsIn, IsInt, IsOptional } from 'class-validator';
import { PagingDto } from '../../../../common/dto/paging.dto';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class GetAdminDisciplineParamsDto extends PagingDto{
  @IsInt()
  @Transform(v => v ? +v : v)
  @IsOptional()
  @Expose()
  id?: number;

  @IsInt()
  @Transform(v => v ? +v : v)
  @IsOptional()
  @Expose()
  facultyId?: number;

  @IsInt()
  @Transform(v => v ? +v : v)
  @IsIn([1, 2, 3, 4])
  @IsOptional()
  @Expose()
  year?: number;
}