/*
    reportUtils: 测试报告工具箱
 */

/** 测试任务报告数据模板 */
export const TestTaskReportData = {
    id: -1,
    name: "",
    desc: "",
    environment: "",
    status: "",
    type: "",
    forProduct: "",
    forIteration: "",
    forGroup: "",
    creator: "",
    deviceName: "",
    platformType: "",
    udid: "",
    beginTime: "",
    endTime: "",
    log: "",
    testCaseReport: []
}

/** 测试用例报告数据模板 */
export const TestCaseReportData = {
    id: "",
    name: "",
    desc: "",
    device: "",
    platformType: "",
    forProduct: "",
    forGroup: "",
    status: "",
    beginTime: "",
    endTime: "",
    result: "",
    failedInfo: {
        screenShot: "",
        cause: "",
        step: "",
    }
}
