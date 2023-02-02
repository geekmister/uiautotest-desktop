import request from "../utils/axios/requests";

// 生产环境
// const baseUrl = "http://172.20.50.10:9101/";
// 本地开发环境
const baseUrl = "http://127.0.0.1:9101/";

/**
 * 心跳接口
 * @param data {string}
 * @return {AxiosPromise}
 */
export function heartBeat(data) {
    return request({
        baseURL: baseUrl,
        url: '/device/heartbeat',
        method: 'post',
        data: data
    })
}

/**
 * 是否同意执行任务
 * @param data {object}
 * @return {AxiosPromise}
 */
export function whetherExec(data) {
    return request({
        baseURL: baseUrl,
        url: '/test-task/exec/confirm',
        method: 'post',
        data: data
    })
}

/**
 * @name reportSchedule
 * @desc
 *  上报测试用例执行进度
 * @param data {object}
 *  example: {
 *      id: 1,          // 任务id
 *      schedule: 2     // 进度
 *  }
 * @return {AxiosPromise}
 */
export function reportSchedule(data) {
    return request({
        baseURL: baseUrl,
        url: '/test-task/progress/report',
        method: 'post',
        data: data
    })
}