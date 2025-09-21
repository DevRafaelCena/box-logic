import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PackingController } from "./controllers/packing.controller";
import { PackingService } from "./services/packing.service";
import { AuthMiddleware } from "./middlewares/auth.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
  ],
  controllers: [PackingController],
  providers: [PackingService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PackingController);
  }
}
