import request from "../utils/axios/requests";

// 获取WDA状态
export function status(baseUrl) {
    return request({
        baseURL: baseUrl,
        url:'/status',
        method:'get',
    })
}

// 获取wda是否被锁定
export function locked(baseUrl) {
    return request({
        baseURL: baseUrl,
        url:'/wda/locked',
        method:'get',
    })
}

// 创建session
export function session(data, baseUrl) {
    return request({
        baseURL: baseUrl,
        url:'/session',
        method:'post',
        data
    })
}

// 获取设备信息
export function deviceInfo(sessionId, baseUrl) {
    return request({
        baseURL: baseUrl,
        url:`/session/${sessionId}/wda/device/info`,
        method:'get',
    })
}

// 获取窗口尺寸大小
export function windowSize(sessionId, baseUrl) {
    return request({
        baseURL: baseUrl,
        url:`/session/${sessionId}/window/size`,
        method:'get',
    })
}

// 屏幕截图
export function screenShot(baseUrl) {
    return request({
        baseURL: baseUrl,
        url:'/screenshot',
        method:'get',
    })
}

// 不知道干什么的
export function rotation(sessionId, baseUrl) {
    return request({
        baseURL: baseUrl,
        url:`/session/${sessionId}/rotation`,
        method:'get',
    })
}

// 点击物理按键
export function pressBtn(sessionId, data, baseUrl) {
    return request({
        baseURL: baseUrl,
        url:`/session/${sessionId}/wda/pressButton`,
        method:'post',
        data
    })
}

// 滑动
export function dragfromtoforduration(sessionId, data, baseUrl) {
    return request({
        baseURL: baseUrl,
        url:`/session/${sessionId}/wda/dragfromtoforduration`,
        method:'post',
        data
    })
}

// 触摸或者点击
export function touchAndHold(sessionId, data, baseUrl) {
    return request({
        baseURL: baseUrl,
        url:`/session/${sessionId}/wda/touchAndHold`,
        method:'post',
        data
    })
}

// 输入
export function keys(sessionId, data, baseUrl) {
    return request({
        baseURL: baseUrl,
        url:`/session/${sessionId}/wda/keys`,
        method:'post',
        data
    })
}

// 获取页面节点树
export function source(format, baseUrl) {
    return request({
        baseURL: baseUrl,
        url:`/source?format=${format}`,
        method:'get',
    })
}

/**
* @name: searchElement
* @Description:
 * 搜索元素
* @Param:
 * baseUrl <string> 基础url
 * sessionId <string> 会话id
 * data <object> 查询条件
* @Return:
* @Author: geekmister
* @Date: 2021/10/13
*/
export function searchElement(baseUrl, sessionId, data) {
    return request({
        baseURL: baseUrl,
        url: `/session/${sessionId}/elements`,
        method: 'post',
        data
    })
}

// 搜索元素类型枚举
export const SearchElementTypeEnum = Object.freeze({
    linkText: "link text",
    partialLinkTex: "partial link tex",
    className: "class name",
    xpath: "xpath",
    predicateString: "predicate string",
    classChain: "class chain"
})

/**
* @name: searchEIAttrById
* @Description:
 * 根据元素id且指定属性名称搜索属性值
* @Param:
 * baseUrl <string> 基础url
 * sessionId <string> 会话id
 * elementId <string> 元素id
 * attribute <string> 属性名称
* @Return:
* @Author: geekmister
* @Date: 2021/10/14
*/
export function searchEIAttrById(baseUrl, sessionId, elementId, attribute) {
    /*
        endpoints写法说明：
        1、curl -X GET $JSON_HEADER $DEVICE_URL/session/$SESSION_ID/element/5/displayed
        2、curl -X GET $JSON_HEADER $DEVICE_URL/session/$SESSION_ID/element/5/attribute/name
     */
    return request({
        baseURL: baseUrl,
        url: `/session/${sessionId}/element/${elementId}/${attribute}`,
        method: 'get',
    })
}

// 元素属性值枚举
export const EIAttrEnum = Object.freeze({
    enabled: "enabled",
    rect: "rect",
    size: "size",
    location: "location",
    text: "text",
    displayed: "displayed",
    accessible: "accessible",
    name: "name",
})

/**
* @name: clickElement
* @Description:
 * 指定元素id点击元素
* @Param:
 * baseUrl <string> 基础url
 * sessionId <string> 会话id
 * elementId <string> 元素id
* @Return:
* @Author: geekmister
* @Date: 2021/10/14
*/
export function clickElement(baseUrl, sessionId, elementId) {
    return request({
        baseURL: baseUrl,
        url: `/session/${sessionId}/element/${elementId}/click`,
        method: 'post',
    })
}

/**
 * @name: inputText
 * @Description:
 * 指定元素id输入文本
 * @Param:
 * baseUrl <string> 基础url
 * sessionId <string> 会话id
 * elementId <string> 元素id
 * data <object> 输入内容
 * @Return:
 * @Author: geekmister
 * @Date: 2021/10/14
 */
export function inputText(baseUrl, sessionId, elementId, data) {
    return request({
        baseURL: baseUrl,
        url: `/session/${sessionId}/element/${elementId}/value`,
        method: 'post',
        data
    })
}

/**
* @name: clearText
* @Description:
 * 清除文本
* @Param:
 * baseUrl <string> 基础url
 * sessionId <string> 会话id
 * elementId <string> 元素id
* @Return:
* @Author: geekmister
* @Date: 2021/10/14
*/
export function clearText(baseUrl, sessionId, elementId) {
    return request({
        baseURL: baseUrl,
        url: `/session/${sessionId}/element/${elementId}/clear`,
        method: 'post',
    })
}