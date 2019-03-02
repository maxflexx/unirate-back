import { IsIn, IsInt, IsOptional } from 'class-validator';
import { UserRole } from '../../../../entities/user.entity';

export class UpdateRoleAdminDto {
  @IsInt()
  @IsIn([UserRole.USER, UserRole.ADMIN])
  @IsOptional()
  role: number;
}