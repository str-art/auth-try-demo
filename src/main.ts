import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

const PORT = process.env.PORT || 8000;


async function bootstrap(){
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('Test Trello API')
        .setDescription('For PurrWeb intern application')
        .addTag('made by Strelkov Artem')
        .build()
    const options: SwaggerDocumentOptions = {
        operationIdFactory: (
            controllerKey: string,
            methodKey: string
        ) => methodKey
    };
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('info', app, document);

    app.listen(PORT,() => console.log('Listening on ', PORT))
}
bootstrap();