import { FolderDoesNotExistError } from '@/domain/errors';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';

const MappedExceptions = FolderDoesNotExistError;

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof MappedExceptions) {
          throw new NotFoundException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
