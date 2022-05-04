import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToClass } from 'class-transformer';

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    return next
      .handle()
      .pipe(
        map((data) =>
          plainToClass(this.dto, data, { excludeExtraneousValues: true }),
        ),
      );
  }
}

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
