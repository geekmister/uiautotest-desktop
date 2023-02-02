/*
    数据工具
 */

/**
 * 获取年-月-日 时:分:秒
 * @return {string}
 */
export function getTime() {
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

/**
 * @function isPositiveInteger
 * @desc 检查字符串是否是正整数
 * @param s {String} 字符串
 * @return {boolean}
 */
export function isPositiveInteger(s){
    let re = /^[0-9]+$/ ;
    return re.test(s)
}

/**
 * @function isNumDecimals
 * @param str {String} 字符串
 * @return {number}
 */
export function isNumDecimals(str) {
    let index = str.indexOf(".") + 1;
    return str.length - index;
}