import { PagingDto } from '../../../../common/dto/paging.dto';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';

@Exclude()
export class GetUsersAdminDto extends PagingDto{
  @IsString()
  @IsOptional()
  @Expose()
  userLogin: string;

  @IsString()
  @IsIn(['login', 'login DESC', 'rating', 'rating DESC'])
  @Transform(item => item ? item : 'login')
  @IsOptional()
  @Expose()
  orderBy: string;
}