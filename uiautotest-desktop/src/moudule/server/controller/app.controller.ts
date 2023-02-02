import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import { AppService } from '../service/app.service';
import {TaskTdo} from "../dto/TaskTdo";
import {ClientTdo} from "../dto/ClientTdo";
import {WhetherExec} from "../dto/WhetherExec";

const tag = "AppController.ts";

@Controller('AppController')
export class AppController {
  constructor(private readonly appService: AppService) {}


  /**
   * 心跳
   * @param clientTdo {object}
   */
  @Post('heartBeat')
  heartBeat(@Body() clientTdo: typeof ClientTdo): string {
    return this.appService.heartBeat(clientTdo);
  }

  /**
   * 处理客户端是否同意接收任务
   * @param whetherExec {object}
   */
  @Post('whetherExec')
  whetherExec(@Body() whetherExec: typeof WhetherExec): string {
    return this.appService.whetherExec(whetherExec);
  }

  /**
   * 设备扫描
   * @param query {object}
   */
  @Get('deviceScan')
  deviceScan(@Query() query): string {
    return this.appService.deviceScan(query);
  }

  /**
   * 获取设备信息
   * @param query {object}
   */
  @Get('getDeviceInfo')
  getDeviceInfo(@Query() query): string {
    return this.appService.getDeviceInfo(query);
  }

  /**
   * 接收任务
   * @param taskTdo {TaskTdo}
   */
  @Post('accessTask')
  accessTask(@Body() taskTdo: typeof TaskTdo): string {
    return this.appService.accessTask(taskTdo);
  }
}
