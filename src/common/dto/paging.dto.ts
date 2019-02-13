import { IsInt, IsOptional } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class PagingDto {
  @IsInt()
  @Expose()
  @Transform(v => +v || 0)
  @IsOptional()
  offset?: number = 0;

  @IsInt()
  @Expose()
  @Transform(v => +v || 10)
  @IsOptional()
  limit?: number = 10;
}