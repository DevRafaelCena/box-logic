import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Enable CORS for API access
  app.enableCors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("BoxLogic API")
    .setDescription(
      "API para otimização de embalagem de pedidos usando algoritmos de empacotamento inteligente"
    )
    .setVersion("1.0.0")
    .addServer(`http://localhost:${process.env.PORT || 3000}`, "Servidor Local")
    .addTag("embalagem", "Endpoints para processamento de embalagem")
    .addApiKey(
      {
        type: "apiKey",
        name: "X-API-Key",
        in: "header",
        description: "API Key para autenticação",
      },
      "X-API-Key"
    )
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "API Key",
        name: "Authorization",
        description: "API Key no formato Bearer token",
        in: "header",
      },
      "Bearer"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Força o servidor correto no documento
  document.servers = [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: "Servidor Local",
    },
  ];

  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      defaultModelsExpandDepth: -1,
      defaultModelExpandDepth: -1,
      displayRequestDuration: true,
      docExpansion: "none",
    },
    customSiteTitle: "BoxLogic API Documentation",
    customfavIcon: "📦",
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info .title { color: #3b82f6; }
      .swagger-ui .scheme-container { 
        background: #f8f9fa; 
        border: 1px solid #dee2e6; 
        padding: 10px; 
        border-radius: 4px; 
        margin: 10px 0; 
      }
      .swagger-ui .models { display: none !important; }
      .swagger-ui section.models { display: none !important; }
      .swagger-ui .model-container { display: none !important; }
    `,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application running on: http://localhost:${port}`);
  console.log(
    `📦 Packing API endpoint: http://localhost:${port}/api/embalagem/processar`
  );
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
