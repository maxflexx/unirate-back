import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { PagingDto } from '../../../../common/dto/paging.dto';

@Exclude()
export class GetProfessionDto extends PagingDto{
  @IsInt()
  @IsPositive()
  @Transform(item => +item || item)
  @IsOptional()
  @Expose()
  facultyId: number;

  @IsInt()
  @IsPositive()
  @Transform(item => +item || item)
  @IsOptional()
  @Expose()
  professionId: number;

  @IsString()
  @IsOptional()
  @Expose()
  search: string;
}