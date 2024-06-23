import { DuplicateFolderError } from '@/domain/errors';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';

const MappedExceptions = DuplicateFolderError;

@Injectable()
export class BadRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof MappedExceptions) {
          throw new BadRequestException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
