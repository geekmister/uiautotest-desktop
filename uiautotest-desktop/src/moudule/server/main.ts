import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';

let app = null;

/**
* @name: bootstrap
* @Description: 启动内置服务
* @Param:
* @Return:
* @Author: geekmister
* @Date: 2021/9/27
*/
export async function bootstrap() {
  app = await NestFactory.create(AppModule, {
    logger: console,
  });
  app.enableCors();
  await app.listen(3000);
}

/**
* @name: stop
* @Description: 停止内置服务
* @Param:
* @Return:
* @Author: geekmister
* @Date: 2021/9/27
*/
export async function stop() {
  app.close();
}
