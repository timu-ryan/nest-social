import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from 'src/exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype) || value == null) {
      return value;
    }

    const obj = plainToInstance(metatype as any, value);
    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.map((err) => {
        const constraints = err.constraints
          ? Object.values(err.constraints).join(' ')
          : '';
        return `${err.property} - ${constraints}`;
      });

      throw new ValidationException(messages);
    }

    return value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
