import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { NotFoundInterceptor } from '@presentation/api/common/interceptors/not-found.interceptor';
import { BadRequestInterceptor } from '@presentation/api/common';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(MainModule);

  app.useGlobalInterceptors(
    new NotFoundInterceptor(),
    new BadRequestInterceptor(),
  );
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('CC-Box API documentation')
    .setDescription('Description of CC-Box api')
    .setVersion('1.0')
    .addTag('ccbox')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
