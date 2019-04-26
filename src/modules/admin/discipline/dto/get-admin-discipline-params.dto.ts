import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
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

  @IsInt()
  @Transform(v => v ? +v : v)
  @IsOptional()
  @Expose()
  mandatoryProfessionId: number;

  @IsString()
  @IsOptional()
  @Expose()
  search: string;

  @IsString()
  @Transform(v => v ? v : 'name')
  @IsOptional()
  @Expose()
  orderBy: string;
}