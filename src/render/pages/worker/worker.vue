<template>
  <h3 class="font-color-white">任务执行进程</h3>
  <p class="font-color-white">
    利用Promise、async、await来实现同步执行！
  </p>
</template>

<script>
  const axios = window.require("axios");
  const ipcRenderer = window.require('electron').ipcRenderer;
  const fs = window.require("fs");
  const yaml = window.require('js-yaml');
  const log = window.require('electron-log');
  const path = window.require("path");

  import {TestTaskReportData, TestCaseReportData} from './reportUtils';

  // 日志标签
  const tag = "worker.vue";
  // axios baseURL
  const baseURL = "/api";
  // 本地开发环境
  const host = "http://127.0.0.1:9101";
  // 生产环境
  // const host = "http://172.20.50.10:9101";

  // 声明任务日志器
  let logger = null;

  // 启动任务监听器
  ipcRenderer.on("lanuchTask", (event, args) => {
    console.log(tag, "args:", args);
    try {
      initLogger(args.pathRepos, args.id);
      lanuchTask(args);
    }catch (e) {
      logger.error(tag, "在执行任务的过程中发生了错误：", e);
    }
  });

  /**
   * 启动任务
   * @param taskInfo {object, 任务信息}
   */
  async function lanuchTask(taskInfo) {
    logger.info(tag, "执行函数lanuchTask(启动任务)...");
    logger.info(tag, "taskInfo(任务信息):", JSON.stringify(taskInfo));

    if (taskInfo.testCases.length > 0) {
      // 初始化任务仓库目录和任务目录
      taskInfo.taskPath = initCatalogue(taskInfo.pathRepos);

      // 生成预置任务测试报告
      let taskReport = genPresetTaskReport(taskInfo);

      let taskManager = {
        taskInfo: taskInfo,
        testCases: [],
        localCases: []
      }

      // 下载测试用例
      for(let i = 0; i < taskManager.taskInfo.testCases.length; i++) {
        let file = await downloadTestCase(`${host}${taskManager.taskInfo.testCases[i]}`);
        logger.info(tag, "下载测试用例，测试用例详情：", file);

        fs.writeFileSync(`${taskManager.taskInfo.taskPath}/${i}.yaml`, Buffer(file));
        taskManager.localCases.push(`${taskManager.taskInfo.taskPath}/${i}.yaml`);
        logger.info(tag, "将测试用例写入本地此次任务测试用例中，用例路径为：", `${taskManager.taskInfo.taskPath}/${i}.yaml`);

        let testCase = yaml.load(fs.readFileSync(`${taskManager.taskInfo.taskPath}/${i}.yaml`, 'utf8'));
        taskManager.testCases.push(testCase);
        logger.info(tag, "从本地读取测试用例: ", testCase);
      }

      // 发送渲染任务进度消息
      ipcRenderer.send("worker.vue", ["renderTaskManager", taskManager]);
      logger.info(tag, "发送渲染任务进度消息");

      // 执行测试用例
      logger.info(tag, "开始执行测试用例，一共有 ", taskManager.testCases.length, " 条测试用例！");
      for (let i = 0; i < taskManager.testCases.length; i++) {
        logger.info(tag, "正在执行第: ", i + 1, "条用例");

        let testCase = taskManager.testCases[i];

        // 生成测试用例预置测试报告
        let testCaseReport = genPresetTestCaseReport(taskInfo, testCase);

        // 创建session并启动App
        let lanuchSessionResult = await wdaStartSessionApi(taskManager.taskInfo.targetDeviceIp, {
          "capabilities": {
            "firstMatch": [{
              "bundleId": taskManager.taskInfo.bundleId,
              "arguments": [],
              "environment": {},
              "eventloopIdleDelaySec": 0,
              "shouldWaitForQuiescence": true,
              "shouldUseTestManagerForVisibilityDetection": false,
              "maxTypingFrequency": 60,
              "shouldUseSingletonTestManager": true}],
            "alwaysMatch": {}}
        });
        logger.info(tag, "创建session并启动App...");

        // 开始执行测试用例步骤
        let operations = testCase.testCaseSteps;
        logger.info(tag, "准备执行测试用例步骤：", operations);

        if(testCaseReport.result == "Success") {
          for(let j = 0; j < operations.length; j++) {
            let item = operations[j];
            logger.info(tag, `当前正在执行${j + 1}步操作，步骤详情:`, item);

            if(item.operateType === "pressButton") {
              let data = {name: item.operate.btn};
              let result = await wdaClickPhysicalKey(
                  taskManager.taskInfo.targetDeviceIp, lanuchSessionResult.value.sessionId, data);
              logger.info(tag, "点击物理键结果: ", JSON.stringify(result));

              // 判断是否执行错误
              if(result.value != null) {
                testCaseReport.result = "Failed";
                testCaseReport.status = "Failed";
                testCaseReport.failedInfo.screenShot = await wdaScreenShotApi(taskManager.taskInfo.targetDeviceIp);
                testCaseReport.failedInfo.screenShot = testCaseReport.failedInfo.screenShot.value;
                testCaseReport.failedInfo.cause = `errorInfo: ${JSON.stringify(result)}}`;
                testCaseReport.failedInfo.step = `当执行第: ${j + 1}步时，执行发生错误，详见原因和屏幕截图进行错误分析！`;
                break;
              }
            }
            else if(item.operateType === "dragfromtoforduration") {
              let result = await wdaSwipeScreenApi(
                  taskManager.taskInfo.targetDeviceIp, lanuchSessionResult.value.sessionId, item.operate);
              logger.info(tag, "滑动元素结果: ", JSON.stringify(result));

              // 判断是否执行错误
              if(result.value != null) {
                testCaseReport.result = "Failed";
                testCaseReport.status = "Failed";
                testCaseReport.failedInfo.screenShot = await wdaScreenShotApi(taskManager.taskInfo.targetDeviceIp);
                testCaseReport.failedInfo.screenShot = testCaseReport.failedInfo.screenShot.value;
                testCaseReport.failedInfo.cause = `errorInfo: ${JSON.stringify(result)}}`;
                testCaseReport.failedInfo.step = `当执行第: ${j + 1}步时，执行发生错误，详见原因和屏幕截图进行错误分析！`;
                break;
              }
            }
            else if(item.operateType === "touchAndHold") {
              let result = await wdaClickByCoordApi(
                  taskManager.taskInfo.targetDeviceIp, lanuchSessionResult.value.sessionId, item.operate);
              logger.info(tag, "点击元素结果: ", JSON.stringify(result));

              // 判断是否执行错误
              if(result.value != null) {
                testCaseReport.result = "Failed";
                testCaseReport.status = "Failed";
                testCaseReport.failedInfo.screenShot = await wdaScreenShotApi(taskManager.taskInfo.targetDeviceIp);
                testCaseReport.failedInfo.screenShot = testCaseReport.failedInfo.screenShot.value;
                testCaseReport.failedInfo.cause = `errorInfo: ${JSON.stringify(result)}}`;
                testCaseReport.failedInfo.step = `当执行第: ${j + 1}步时，执行发生错误，详见原因和屏幕截图进行错误分析！`;
                break;
              }
            }
            else if(item.operateType === "keys") {
              let result = await wdaInputByKeyApi(taskManager.taskInfo.targetDeviceIp,
                  lanuchSessionResult.value.sessionId, {value: item.operate.value.split('')});
              logger.info(tag, "输入结果: ", JSON.stringify(result));

              // 判断是否执行错误
              if(result.value != null) {
                testCaseReport.result = "Failed";
                testCaseReport.status = "Failed";
                testCaseReport.failedInfo.screenShot = await wdaScreenShotApi(taskManager.taskInfo.targetDeviceIp);
                testCaseReport.failedInfo.screenShot = testCaseReport.failedInfo.screenShot.value;
                testCaseReport.failedInfo.cause = `errorInfo: ${JSON.stringify(result)}}`;
                testCaseReport.failedInfo.step = `当执行第: ${j + 1}步时，执行发生错误，详见原因和屏幕截图进行错误分析！`;
                break;
              }
            }
            else if(item.operateType === "elements") {
              let data = {
                using: item.operate.using,
              }
              if(data.using === "class name") {
                data.value = `XCUIElementType${item.operate.type}`;
              }else if(data.using === "link text" || item.operate.using === "partial link text") {
                data.value = `${item.operate.attribute}=${item.operate.value}`;
              }else if(data.using === "xpath") {
                data.value = `//XCUIElementType${item.operate.type}[@${item.operate.attribute}='${item.operate.value}']`;
              }
              let result = await wdaSearchElementApi(
                  taskManager.taskInfo.targetDeviceIp, lanuchSessionResult.value.sessionId, data);
              logger.info(tag, "查找元素结果: ", JSON.stringify(result));

              // 判断是否执行错误
              if(result.value == null || result.value.length === 0) {
                testCaseReport.result = "Failed";
                testCaseReport.status = "Failed";
                testCaseReport.failedInfo.screenShot = await wdaScreenShotApi(taskManager.taskInfo.targetDeviceIp);
                testCaseReport.failedInfo.screenShot = testCaseReport.failedInfo.screenShot.value;
                testCaseReport.failedInfo.cause = `errorInfo: ${JSON.stringify(result)}}`;
                testCaseReport.failedInfo.step = `当执行第: ${j + 1}步时，执行发生错误，详见原因和屏幕截图进行错误分析！`;
                break;
              }
            }
            else if(item.operateType === "wait") {
              await sleep(item.operate.time * 1000);
            }
            else {
              testCaseReport.result = "Failed";
              testCaseReport.status = "Failed";
              testCaseReport.failedInfo.screenShot = await wdaScreenShotApi(taskManager.taskInfo.targetDeviceIp);
              testCaseReport.failedInfo.screenShot = testCaseReport.failedInfo.screenShot.value;
              testCaseReport.failedInfo.cause = "未匹配到对应的操作事件类型...";
              testCaseReport.failedInfo.step = `当执行第: ${j + 1}步时，执行发生错误，详见原因和屏幕截图进行错误分析！`;
              break;
            }
          }
        }

        // 开始执行测试用例检查点
        let checkPoints = testCase.testCaseCheckPoint;
        logger.info(tag, "准备执行测试用例检查点:", checkPoints);

        if(testCaseReport.result === "Success") {
          for(let j = 0; j < checkPoints.length; j++) {
            let item  = checkPoints[j];
            logger.info(tag, `当前正在执行${j + 1}步检查，检查步骤详情:`, item);

            if(item.operateType === "elements") {
              let data = {
                using: item.operate.using,
              }
              if(data.using === "class name") {
                data.value = `XCUIElementType${item.operate.type}`;
              }else if(data.using === "link text" || item.operate.using === "partial link text") {
                data.value = `${item.operate.attribute}=${item.operate.value}`;
              }else if(data.using === "xpath") {
                data.value = `//XCUIElementType${item.operate.type}[@${item.operate.attribute}='${item.operate.value}']`;
              }
              let result = await wdaSearchElementApi(
                  taskManager.taskInfo.targetDeviceIp, lanuchSessionResult.value.sessionId, data);
              logger.info(tag, "查找元素结果: ", JSON.stringify(result));

              // 判断是否执行错误
              if(result.value == null || result.value.length === 0) {
                testCaseReport.result = "Failed";
                testCaseReport.status = "Failed";
                testCaseReport.failedInfo.screenShot = await wdaScreenShotApi(taskManager.taskInfo.targetDeviceIp);
                testCaseReport.failedInfo.screenShot = testCaseReport.failedInfo.screenShot.value;
                testCaseReport.failedInfo.cause = `errorInfo: ${JSON.stringify(result)}}`;
                testCaseReport.failedInfo.step = `当执行第: ${j + 1}个检查点时，执行发生错误，详见原因和屏幕截图进行错误分析！`;
                break;
              }
            }
            else {
              testCaseReport.result = "Failed";
              testCaseReport.status = "Failed";
              testCaseReport.failedInfo.screenShot = await wdaScreenShotApi(taskManager.taskInfo.targetDeviceIp);
              testCaseReport.failedInfo.screenShot = testCaseReport.failedInfo.screenShot.value;
              testCaseReport.failedInfo.cause = "未匹配到对应的操作事件类型...";
              testCaseReport.failedInfo.step = `当执行第: ${j + 1}个检查点时，执行发生错误，详见原因和屏幕截图进行错误分析！`;
              break;
            }
          }
        }

        /** 关闭session，关闭app TODO：server端貌似有问题，postman发送delete请求就可以正常请求，axios就不行，先去掉了*/
        // let stopSessionResult = await wdaStopSessionApi(taskInfo.targetDeviceIp, lanuchSessionResult.value.sessionId);

        testCaseReport.endTime = new Date().getTime();
        taskReport.testCaseReport.push(testCaseReport);

        ipcRenderer.send("worker.vue", ["taskProcess", {index: i, result: testCaseReport.result}]);

        logger.info(tag, "开始上传测试用例执行进度...");
        axios({
          url: host + "/test-task/progress/report",
          method: 'post',
          data: {
            id: taskManager.taskInfo.id,
            progress: ((i + 1) / taskManager.testCases.length) * 100
          }
        }).then(function (res) {
          logger.info("上传测试用例执行进度结果: ", res);
        }).catch(function (err) {
          logger.error("上传测试用例执行进度发生错误: ", err);
        }).finally(function () {
          logger.info(tag, "测试用例执行进度已上传完毕...");
        });
      }

      taskReport.endTime = new Date().getTime();
      logger.info(tag, "开始上传任务执行测试报告...");
      logger.info(tag, "任务执行报告详情:", taskReport);
      await upResport(host + "/test-task/upload/report",
          taskReport, path.join(taskManager.taskInfo.pathRepos, `${taskManager.taskInfo.id}.log`));
      logger.info(tag, "任务执行测试报告已上传完毕...");

      ipcRenderer.send("worker.vue", ["completeTask"]);
    }
  }

  /**
   * @function initLogger
   * @desc 初始化任务日志器
   * @param path {String} 日志存储路径
   * @param name {String} 日志文件名称
   */
  function initLogger(pathRepos, name) {
    logger = log.create("logger");
    logger.transports.file.level = true;                                    // 文件日志开关
    logger.transports.file.console = true;                                  // console日志开关
    logger.transports.file.resolvePath = (variables) => {                   // 日志存储路径
      return path.join(pathRepos, `${name}.log`);
    };
  }

  /**
   * @function initCatalogue
   * @desc 初始化任务仓库目录和本次任务目录
   * @param path {String} 应用数据目录
   * @return {string} taskPath 任务目录
   */
  function initCatalogue(path) {
    logger.info(tag, "执行函数initCatalogue(初始化任务仓库目录和本次任务目录)...");

    if(path.indexOf(" ") != -1) {
      path.replace(" ", "' '")
    }

    try {
      let stat = fs.statSync(path);
    }catch (e) {
      logger.error(tag, "任务仓库目录不存在，正在创建任务仓库目录...");
      fs.mkdirSync(path);
    }

    let taskPath = `${path}${Date.parse(new Date())}`;
    logger.info(tag, "创建任务目录(taskInfo.pathRepos):", taskPath);
    fs.mkdirSync(taskPath);

    return taskPath;
  }

  /**
   * 生成测试报告预置信息
   * @param taskInfo {object} 任务信息
   */
  function genPresetTaskReport(taskInfo) {
    logger.info(tag, `生成测试报告预置信息...`);

    let taskReport = TestTaskReportData;

    taskReport.id = taskInfo.id;
    taskReport.name = taskInfo.name;
    taskReport.desc = taskInfo.desc;
    taskReport.environment = taskInfo.environment;
    taskReport.creator = taskInfo.creator;
    taskReport.forProduct = taskInfo.forProduct;
    taskReport.forIteration = taskInfo.forIteration;
    taskReport.deviceName = taskInfo.deviceName;
    taskReport.forGroup = taskInfo.forGroup;
    taskReport.udid = taskInfo.udid;
    taskReport.platformType = taskInfo.platformType;
    taskReport.beginTime = new Date().getTime();


    return taskReport;
  }

  /**
   * 生成测试用例执行报告预置信息
   * @param taskReport
   * @param testCase
   * @return {*}
   */
  function genPresetTestCaseReport(taskInfo, testCase) {
    logger.info(tag, `生成测试用例执行报告预置信息...`);
    logger.info(tag, "taskInfo:", taskInfo);
    logger.info(tag, "testCase:", testCase);

    let testCaseReport = TestCaseReportData;

    testCaseReport.id = testCase.number;
    testCaseReport.name = testCase.title;
    testCaseReport.desc = testCase.description;
    testCaseReport.device = taskInfo.deviceName;
    testCaseReport.platformType = taskInfo.platformType;
    testCaseReport.forProduct = testCase.productId;
    testCaseReport.forGroup = testCase.workgroupId;
    testCaseReport.status = "Success";
    testCaseReport.result = "Success";
    testCaseReport.beginTime = new Date().getTime();

    return testCaseReport;
  }

  /**
   * 模拟线程等待
   * @param millisecond {毫秒数}
   * @return {Promise<unknown>}
   */
  function sleep(millisecond) {
    logger.info(tag, `模拟线程等待${millisecond}...`);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, millisecond);
    })
  }

  /**
   * 下载测试用例
   * @param url {string} url路径
   * @return {Promise<unknown>}
   */
  function downloadTestCase(url) {
    logger.info(tag, `从${url}下载测试用例...`);

    return new Promise((resolve, reject) => {
      axios({
        url: url,
        responseType: 'arraybuffer',
        method: 'get',
      }).then(function (response) {
        logger.info(tag, "response data: ", response.data);
        resolve(response.data);
      }).catch(function (error) {
        logger.error(tag, "error: ", error);
      }).finally(function () {});
    })
  }

  /**
   * 查找元素
   * @param url {string} 目标设备ip:port
   * @param sessionId {string} 会话标识
   * @param data {object} body
   * @return {Promise<unknown>}
   */
  function wdaSearchElementApi(url, sessionId, data) {
    logger.info(tag, `查找元素,url:${url}, sessionId:${sessionId}, data:${JSON.stringify(data)}`);

    return new Promise((resolve, reject) => {
      axios({
        baseURL: url,
        url: `/session/${sessionId}/elements`,
        method: 'post',
        data: data
      }).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        logger.error(tag, "error: ", error);
      }).finally(function () {});
    })
  }

  /**
   * @function wdaClickPhysicalKey
   * @desc 点击物理键
   * @param url {string} 目标设备ip:port
   * @param sessionId {string} 会话标识
   * @param data {object} body
   * @return {Promise<unknown>}
   */
  function wdaClickPhysicalKey(url, sessionId, data) {
    logger.info(tag, `点击物理键,url:${url}, sessionId:${sessionId}, data:${JSON.stringify(data)}`);

    return new Promise((resolve, reject) => {
      axios({
        baseURL: url,
        url: `/session/${sessionId}/wda/pressButton`,
        method: 'post',
        data: data
      }).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        logger.error(tag, "error: ", error);
      }).finally(function () {});
    })
  }

  /**
   * 根据元素id点击元素
   * @param url {string} 目标设备ip:port
   * @param sessionId {string} 会话标识
   * @param elementId {object} body
   * @return {Promise<unknown>}
   */
  function wdaClickElementByIdApi(url, sessionId, elementId) {
    logger.info(tag, `根据元素id点击元素,url:${url}, sessionId:${sessionId}, elementId:${elementId}`);

    return new Promise((resolve, reject) => {
      axios({
        baseURL: url,
        url: `/session/${sessionId}/element/${elementId}/click`,
        method: 'post',
      }).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        logger.error(tag, "error: ", error);
      }).finally(function () {});
    })
  }

  /**
   * 滑动屏幕
   * @param url {string} 目标设备ip:port
   * @param sessionId {string} 会话标识
   * @param data {object} body
   * @return {Promise<unknown>}
   */
  function wdaSwipeScreenApi(url, sessionId, data) {
    logger.info(tag, `滑动屏幕,url:${url}, sessionId:${sessionId}, data:${JSON.stringify(data)}`);

    return new Promise((resolve, reject) => {
      axios({
        baseURL: url,
        url: `/session/${sessionId}/wda/dragfromtoforduration`,
        method: 'post',
        data: data
      }).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        logger.error(tag, "error: ", error);
      }).finally(function () {});
    })
  }

  /**
   * 指定元素id输入信息
   * @param url {string} 目标设备ip:port
   * @param sessionId {string} 会话标识
   * @param elementId {string} 元素id
   * @param data {object} body
   * @return {Promise<unknown>}
   */
  function wdaInputElementByIdApi(url, sessionId, elementId, data) {
    logger.info(tag, `指定元素id输入信息,url:${url}, sessionId:${sessionId}, elementId:${elementId}, data:${JSON.stringify(data)}`);

    return new Promise((resolve, reject) => {
      axios({
        baseURL: url,
        url: `/session/${sessionId}/element/${elementId}/value`,
        method: 'post',
        data: data
      }).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        logger.error(tag, "error: ", error);
      }).finally(function () {});
    })
  }

  /**
   * 根据元素id清除输入内容
   * @param url {string} 目标设备ip:port
   * @param sessionId {string} 会话标识
   * @param elementId {string} 元素id
   * @return {Promise<unknown>}
   */
  function wdaClearInputElementByIdApi(url, sessionId, elementId) {
    logger.info(tag, `根据元素id清除输入内容,url:${url}, sessionId:${sessionId}, elementId:${elementId}`);

    return new Promise((resolve, reject) => {
      axios({
        baseURL: url,
        url: `/session/${sessionId}/element/${elementId}/clear`,
        method: 'post',
      }).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        logger.error(tag, "error: ", error);
      }).finally(function () {});
    })
  }

  /**
   * 根据坐标点击元素
   * @param url {string} 目标设备ip:port
   * @param sessionId {string} 会话标识
   * @param data {object} body
   * @return {Promise<unknown>}
   */
  function wdaClickByCoordApi(url, sessionId, data) {
    logger.info(tag, `根据坐标点击元素,url:${url}, sessionId:${sessionId}, data:${JSON.stringify(data)}`);

    return new Promise((resolve, reject) => {
      axios({
        baseURL: url,
        url: `/session/${sessionId}/wda/touchAndHold`,
        method: 'post',
        data: data
      }).then(function (response) {
        logger.info(tag, "response: ", response);
        resolve(response.data);
      }).catch(function (error) {
        logger.error(tag, "error: ", error);
      }).finally(function () {});
    })
  }

  /**
   * 按键输入
   * @param url {string} 目标设备ip:port
   * @param sessionId {string} 会话标识
   * @param data {object} body
   * @return {Promise<unknown>}
   */
  function wdaInputByKeyApi(url, sessionId, data) {
    logger.info(tag, `按键输入,url:${url}, sessionId:${sessionId}, data:${JSON.stringify(data)}`);

    return new Promise((resolve, reject) => {
      axios({
        baseURL: url,
        url: `/session/${sessionId}/wda/keys`,
        method: 'post',
        data: data
      }).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        logger.error(tag, "error: ", error);
      }).finally(function () {});
    })
  }

  /**
   * 创建session并启动app
   * @param url {string} 目标设备ip:port
   * @param data {object} 启动对象
   * @return {Promise<unknown>}
   */
  function wdaStartSessionApi(url, data) {
    logger.info(tag, `创建session并启动app,url:${url}, data:${JSON.stringify(data)}`);

    return new Promise((resolve, reject) => {
      axios({
        baseURL: url,
        url: `/session`,
        method: 'post',
        data: data
      }).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        logger.error(tag, "error: ", error);
      }).finally(function () {});
    })
  }

  /**
   * 删除session并停止应用
   * @param url {string} 目标设备ip:port
   * @param data {object} 停止session
   * @return {Promise<unknown>}
   */
  function wdaStopSessionApi(url, sessionId) {
    logger.info(tag, `删除session并停止应用,url:${url}, sessionId:${sessionId}`);

    return new Promise((resolve, reject) => {
      axios({
        baseURL: url,
        url: `/session/${sessionId}`,
        method: 'delete',
        headers: {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"}
      }).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        logger.error(tag, "error: ", error);
      }).finally(function () {});
    })
  }

  /**
   * 截屏
   * @param url {string} 目标设备ip:port
   * @return {Promise<unknown>}
   */
  function wdaScreenShotApi(url) {
    logger.info(tag, "exec function wdaScreenShotApi...");
    logger.info(tag, "url:", url);

    return new Promise((resolve, reject) => {
      axios({
        baseURL: url,
        url: '/screenshot',
        method: 'get',
      }).then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
        logger.error(tag, "error: ", error);
      }).finally(function () {});
    })
  }

  /**
   * 上传测试报告
   * @param url {string} 地址
   * @param data {object} 任务执行报告
   * @param logFilePath {string} 日志文件路径
   * @return {Promise<unknown>}
   */
  function upResport(url, data, logFilePath) {
    logger.info(tag, "exec function upResport...");
    logger.info(tag, `上传测试报告, url: ${url}, data: ${data}, logFilePath: ${logFilePath}`);

    let logFile = fs.readFileSync(logFilePath, "utf-8");
    logger.info(tag, "文件:", logFile);

    let formData = new FormData();
    formData.append("log", new Blob([logFile]));
    formData.append("info", JSON.stringify(data));

    return new Promise((resolve, reject) => {
      axios({
        url: url,
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data;charset=UTF-8'
        }
      }).then(function (res) {
        logger.info("上传任务执行测试报告结果: ", res);
        resolve(res.data);
      }).catch(function (err) {
        logger.error(tag, "上传任务执行测试报告发生错误: ", err);
      }).finally(function () {
        logger.info("任务执行测试报告已上传完毕...");
      });
    })
  }

  export default {
    name: "worker",
    setup(props, context) {},
    data() {return {}}
  }
</script>

<style scoped>

</style>