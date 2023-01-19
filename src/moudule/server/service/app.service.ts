import { Injectable } from '@nestjs/common';
import { confirmTask } from '../../electron/eventMonitor';

import {getIphones, getIphone} from '../../store/store';

@Injectable()
export class AppService {

  /**
   * 心跳
   * @param data {object}
   */
  heartBeat(data): string {
    // 定义返回数据
    let body = {
      status: 'SUCCESS',
      data: null,
      message: '响应成功！'
    }

    // 返回数据
    return JSON.stringify(body);
  }

  /**
   * 处理客户端是否同意接收任务
   * @param data {object}
   */
  whetherExec(data): string {
    // 定义返回数据
    let body = {
      status: 'SUCCESS',
      data: null,
      message: '响应成功！'
    }

    // 返回数据
    return JSON.stringify(body);
  }

  /**
   * 设备扫描
   * @param query {object}
   */
  deviceScan(query): string {
    // 定义返回数据
    let result = {
      status: 'SUCCESS',
      data: getIphones(),
      message: '响应成功！'
    }

    // 返回数据
    return JSON.stringify(result);
  }

  /**
   * 获取设备信息
   * @param query {object}
   */
  getDeviceInfo(query): string {
    // 定义返回数据
    let result = {
      status: 'SUCCESS',
      data: getIphone(query),
      message: '响应成功！'
    }

    // 返回数据
    return JSON.stringify(result);
  }

  /**
   * 接收任务
   * @param data {TaskTdo}
   */
  accessTask(data): string {
    // 定义返回数据
    let body = {
      status: 'SUCCESS',
      data: null,
      message: '任务执行等待用户确认中！'
    }

    /*
    业务检查
     */
    if(data.testCases.length == 0) {
      body.status = "FAILED";
      body.message = "测试用例为空，任务无法开始执行，请检查任务配置是否包含了测试用例！";
    }

    // 确认任务
    confirmTask(data);

    // 返回数据
    return JSON.stringify(body);
  }
}
