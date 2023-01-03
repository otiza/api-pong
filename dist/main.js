"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.enableCors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
        allowedHeaders: [
            'cookie',
            'Cookie',
            'authorization',
            'Authorization',
            'content-type',
        ],
        exposedHeaders: [
            'cookie',
            'Cookie',
            'authorization',
            'Authorization',
            'content-type',
        ],
    });
    app.useStaticAssets((0, path_1.join)(__dirname, "..", "uploads"));
    app.useGlobalPipes(new common_1.ValidationPipe());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('trend example')
        .setDescription('usersAPI description')
        .setVersion('1.0')
        .addTag('users')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(5000);
}
bootstrap();
//# sourceMappingURL=main.js.map