import { CacheModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { TemplateModule } from "./modules/template/template.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { TaskModule } from "./modules/task/task.module";
import { AssetModule } from "./modules/asset/asset.module";

const options: TypeOrmModuleOptions = {
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || "magnit",
    password: process.env.POSTGRES_PASSWORD || "magnit",
    database: process.env.POSTGRES_DB || "magnit",
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    logger: "advanced-console",
    logging: process.env.NODE_ENV !== "testing",
    synchronize: true,
};

const imports = [
    TypeOrmModule.forRoot(options),
    CacheModule.register(),
    TemplateModule,
    TaskModule,
    AssetModule,
];

@Module({ imports })
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        if (process.env.NODE_ENV !== "testing") {
            consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
        }
    }
}