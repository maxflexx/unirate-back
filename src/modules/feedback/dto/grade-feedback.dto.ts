import { IsIn, IsInt } from 'class-validator';

export class GradeFeedbackDto {
  @IsInt()
  @IsIn([-1, 1])
  like: number;
}