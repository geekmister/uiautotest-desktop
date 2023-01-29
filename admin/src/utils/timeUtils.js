/*
    JS 时间转化工具箱
 */

import logger from "./logger";

const tag = "/utils/timeUtils.js";

/**
 * @function timeOfISO8601ToFormatString
 * @desc ISO8601时间格式的时间戳转化成特定格式时间字符串
 * @param {Object} date 时间
 * @param {String} format 格式
 * @return {String} 特定格式的时间
 *
 * 例如：
 * var now = new Date(); // Mon Jan 16 2017 14:32:22 GMT+0800 (中国标准时间)
 * formatDate(now, 'yyyy-MM-dd h:m:s'); // 2017-01-16 14:32:22
 */
function timeOfISO8601ToFormatString(date, format) {
    let time = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S+": date.getMilliseconds()
    }

    if(/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for(let k in time) {
        if(new RegExp('(' + k + ')').test(format)) {
            format = format.replace(
                RegExp.$1, RegExp.$1.length === 1 ? time[k] : ('00' + time[k].substr('' + time[k]).length));
        }
    }

    logger.debug("here", format);

    return format;
}

/**
 * @function timeStrOfISO8601ToYMDHMS
 * @desc IOSO8601Str转成YMDHMS
 * @param iso08601str {String} iso08601格式时间戳字符串
 * @return {String} yyyy-MM-dd hh:mm:ss
 */
function timeStrOfISO8601ToYMDHMS(iso08601str) {
    let parts = iso08601str.match(/\d+/g);
    return parts[0]+'-'+parts[1]+'-'+parts[2]+' '+parts[3]+':'+parts[4]+':'+parts[5];
}

/**
 * @function timeStampToYMDHMS
 * @desc 时间戳转化成年月日时分秒
 * @param timestamp {string} 时间戳
 * @param format {string} 格式
 * @return {string}
 */
function timeStampToYMDHMS(timestamp) {
    logger.redundancy(tag, "exec function timeStampToYMDHMS...");
    logger.debug(tag, "timestamp:", timestamp);

    let date = new Date(parseInt(timestamp));
    logger.debug(tag, "date:", date);

    return date.toLocaleString();
}

export default {
    timeOfISO8601ToFormatString, timeStrOfISO8601ToYMDHMS, timeStampToYMDHMS
}