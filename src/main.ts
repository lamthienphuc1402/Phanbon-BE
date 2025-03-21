declare const module: any;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
const port = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.use(compression());
    app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }
    ));
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  
  const config = new DocumentBuilder()
  .setTitle('PHANBON API')
  .setDescription('The API description')
  .setVersion('1.0')
  .addBearerAuth(
    {type: 'http', scheme: 'bearer', bearerFormat: 'JWT'},
  )
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
await app.listen(port,"0.0.0.0");
console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();