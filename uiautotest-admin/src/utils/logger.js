/*
    conslog日志模块的封装
    提供：
    1、按照日志等级打开/关闭日志功能；
    2、日志可上传至服务端；
 */

import {getTime} from "./datautils";

/*
    日志等级
    redundancy: 冗余日志，多用于代码流程定为或者写点心情小寄语给未来的自己，生产环境必须关闭的日志
    debug: 调试日志，生产环境按需打开，默认关闭
    info: 信息日志，常用在打印数据，如接口返回信息等，生产环境必须打开
    warn: 警告日志，生产环境必须打开
    error: 错误日志，生产环境必须打开
 */
const LEVEL = {
    redundancy: true, debug: true, info: true, warn: true, error: true
}

/**
 * @function redundancy
 * @desc 冗余日志
 * @param arguments
 */
function redundancy() {
    if(LEVEL.redundancy) {console.log(`[${getTime()}] | redundancy |`, ...arguments);}
}

/**
 * @function debug
 * @desc 调试日志
 * @param arguments
 */
function debug() {
    if(LEVEL.debug) {console.log(`[${getTime()}] | debug      |`, ...arguments);}
}

/**
 * @function info
 * @desc 信息日志
 * @param arguments
 */
function info() {
    if(LEVEL.info) {console.log(`[${getTime()}] | info       |`, ...arguments);}
}

/**
 * @function warn
 * @desc 警告日志
 * @param arguments
 */
function warn() {
    if(LEVEL.warn) {console.log(`[${getTime()}] | warn       |`, ...arguments);}
}

/**
 * @function error
 * @desc 警告日志
 * @param arguments
 */
function error() {
    if(LEVEL.error) {console.log(`[${getTime()}] | error      |`, ...arguments);}
}

export default {
    redundancy, debug, info, warn, error
};