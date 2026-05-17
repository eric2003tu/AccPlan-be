import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
  const configuredOrigins = [process.env.CORS_ORIGIN, process.env.FRONTEND_ORIGIN, process.env.CORS_ORIGINS]
    .flatMap((value) => (value ? value.split(',') : []))
    .map((value) => value.trim())
    .filter(Boolean);
  const allowedOrigins = new Set([
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006',
    'http://localhost:3007',
    'http://localhost:3008',
    'http://localhost:3009',
    'http://localhost:3010',
    'http://localhost:3011',
    'http://localhost:3012',
    'http://localhost:3013',
    'http://localhost:3014',
    'http://localhost:3015',
    'http://localhost:3016',
    'http://localhost:3017',
    'http://localhost:3018',
    'http://localhost:3019',
    'http://localhost:3020',
    'https://accounting-dusky-six.vercel.app',
    'https://accplan-be.onrender.com',
    ...configuredOrigins,
  ]);
  const renderOriginRegex = /^https:\/\/[a-z0-9-]+\.onrender\.com$/i;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS for frontend communication (ports 3000-3020)
  app.enableCors({
    origin: function (origin, callback) {
      const localhostRegex = /^https?:\/\/localhost:(300[0-9]|301[0-9]|3020)$/;

      if (!origin || allowedOrigins.has(origin) || localhostRegex.test(origin) || renderOriginRegex.test(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('Accounting & Planning API')
    .setDescription('Comprehensive ERP API for accounting, inventory, and business management')
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Business')
    .addTag('Products')
    .addTag('Categories')
    .addTag('Contacts')
    .addTag('Warehouses')
    .addTag('Sales')
    .addTag('Sale Items')
    .addTag('Purchases')
    .addTag('Purchase Items')
    .addTag('Accounts')
    .addTag('Journal Entries')
    .addTag('Journal Lines')
    .addTag('Fiscal Years')
    .addTag('Reports')
    .addTag('Notifications')
    .addTag('Receivables')
    .addTag('Payables')
    .addTag('Stock Movements')
    .addTag('Business Users')
    .addTag('Auth')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                ║');
  console.log('║          🚀 Server is running successfully!                   ║');
  console.log('║                                                                ║');
  console.log(`║  📡 API Server:  http://localhost:${port}                       ║`);
  console.log(`║  📚 Documentation: http://localhost:${port}/api/docs             ║`);
  console.log('║                                                                ║');
  console.log('║  ✅ Frontend communication enabled on ports 3000-3020         ║');
  console.log('║                                                                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
}
bootstrap();
