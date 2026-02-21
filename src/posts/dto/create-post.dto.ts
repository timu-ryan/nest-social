import { Type } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Должно быть числом' })
  @Min(1)
  readonly userId: number; // хорошо доставать из токена
}
