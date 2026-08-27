import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ParseFormDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (typeof request.body?.images === 'string') {
      try {
        request.body.incomingImages = JSON.parse(request.body.images);
      } catch {
        request.body.incomingImages = undefined;
      }
    }

    if (request.files && Array.isArray(request.files)) {
      request.body.newFiles = request.files.map((f: Express.Multer.File) => ({
        buffer: f.buffer,
        originalname: f.originalname,
        mimetype: f.mimetype,
      }));
    }

    return next.handle();
  }
}