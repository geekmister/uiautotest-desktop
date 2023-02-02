/*
    goAutoUiTestApi服务接口
 */

import request from "../utils/requests";
import logger from "../utils/logger";
import store from "../store/store";

const tag = "/api/goautoapi.js";
// 本地环境
const baseUrl = "http://127.0.0.1:9101";
// 生产环境
// const baseUrl = "http://172.20.50.10:9101";

// 认证api
const AUTHAPI = {
    login: "/login"
}

// 用户api
const USERAPI = {
    add: "/user", list: "/user/list", details: "/user", edit: "/user", delete: "/user", box: "/user/box"
};

// 产品api
const PROAPI = {
    add: "/product", list: "/product/list", box: "/product/box", details: "/product", edit: "/product", delete: "/product"
}

// 角色api
const ROLEAPI = {
    list: "/role/list", add: "/role", edit: "/role", details: "/role", delete: "/delete", box: "/role/box"
}

// 路由api
const ROUTEAPI = {
    list: "/route/list", details: "/route"
}

// 环境api
const ENVAPI = {
    add: "/environment", details: "/environment", list: "/environment/list", edit: "/environment", del: "/environment", box: "/environment/box"
}

// 迭代Api
const ITERAAPI = {
    add: "/iteration", list: "/iteration/list", details: "/iteration", edit: "/iteration", del: "/iteration", box: "/iteration/box"
}

// 业务分组api
const GROUPAPI = {
    add: "/workgroup", details: "/workgroup", list: "/workgroup/list", edit: "/workgroup", del: "/workgroup", box: "/workgroup/box"
}

// 测试用例api
const CASEAPI = {
    add: "/test-case", list: "/test-case/list", details: "/test-case", edit: "/test-case", del: "/test-case", box: "/test-case/box"
}

// 任务api
const TASKAPI = {
    add: "/test-task", list: "/test-task/list", details: "/test-task", edit: "/test-task", del: "/test-task",
    start: "/test-task/start", report: "/test-task/report"
}

// 设备api
const DEVICEAPI = {
    scan: "/device/scan", list: "/device/list", refrsh: "/device/refresh", details: "/device", box: "/device/box"
}

/**
 * @function getBaseUrl
 * @desc 获取url
 * @return {string}
 */
export function getBaseUrl() {
    return baseUrl;
}

/**
 * 认证api-登录
 * @param body 请求数据
 * @return {AxiosPromise}
 */
export function login(body) {
    return request({
        baseURL: baseUrl,
        url: AUTHAPI.login,
        method: "post",
        data: body
    })
}

/**
 * @function userAddApi
 * @desc 添加用户
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function userAddApi(body) {
    logger.redundancy(tag, "exec function userAddApi...");
    logger.debug(tag, "body:", body);

    return request({
        baseURL: baseUrl,
        url: USERAPI.add,
        method: "post",
        data: body
    });
};

/**
 * @function userListApi
 * @desc 分页查询用户信息
 * @param params {object} 请求参数
 * @return {AxiosPromise}
 */
export function userListApi(params) {
    logger.redundancy(tag, "exec function userListApi...");
    logger.debug(tag, "params:", params);

    let uri = `${USERAPI.list}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + USERAPI.list, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
}

/**
 * @function userDetailsApi
 * @desc 获取用户信息
 * @param params {object} 请求参数
 * @return {AxiosPromise}
 */
export function userDetailsApi(params) {
    logger.redundancy(tag, "exec function userDetailsApi...");
    logger.debug(tag, "params:", params);

    let uri = `${USERAPI.details}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + USERAPI.details, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
}

/**
 * @function userEditApi
 * @desc 编辑用户
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function userEditApi(body) {
    logger.redundancy(tag, "exec function userEditApi...");
    logger.debug(tag, "body:", body);

    return request({
        baseURL: baseUrl,
        url: `${USERAPI.edit}?id=${body.id}`,
        method: "put",
        data: body
    });
};

/**
 * @function userDelApi
 * @desc 删除用户
 * @param params {object} 请求参数
 * @return {AxiosPromise}
 */
export function userDelApi(params) {
    logger.redundancy(tag, "exec function userDelApi...");

    logger.debug(tag, "params:", params);

    let uri = `${USERAPI.delete}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + USERAPI.delete, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "delete"
    });
};

/**
 * @function userBoxApi
 * @desc 获取用户列表
 * @return {AxiosPromise}
 */
export function userBoxApi() {
    logger.redundancy(tag, "exec function userBoxApi...");

    return request({
        baseURL: baseUrl,
        url: USERAPI.box,
        method: "get"
    });
}

/**
 * @function proAddApi
 * @desc 添加产品
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function proAddApi(body) {
    logger.redundancy(tag, "exec function proAddApi...");
    logger.debug(tag, "body:", body);

    return request({
        baseURL: baseUrl,
        url: PROAPI.add,
        method: "post",
        data: body
    });
};

/**
 * @function proListApi
 * @desc 分页查询产品列表
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function proListApi(params) {
    logger.redundancy(tag, "exec function proListApi...");
    logger.debug(tag, "params:", params);

    let uri = `${PROAPI.list}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + PROAPI.list, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
};

/**
 * @function proBox
 * @desc 获取产品列表
 * @return {AxiosPromise}
 */
export function proBoxApi() {
    logger.redundancy(tag, "exec function proListApi...");

    return request({
        baseURL: baseUrl,
        url: PROAPI.box,
        method: "get"
    });
};

/**
 * @function proDetails
 * @desc 获取产品信息
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function proDetailsApi(params) {
    logger.redundancy(tag, "exec function proDetailsApi...");
    logger.debug(tag, "params:", params);

    let uri = `${PROAPI.details}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + PROAPI.details, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
};

/**
 * @function proEditApi
 * @desc 编辑产品
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function proEditApi(body) {
    logger.redundancy(tag, "exec function proEditApi...");
    logger.debug(tag, "body:", body);

    return request({
        baseURL: baseUrl,
        url: `${PROAPI.edit}?id=${body.id}`,
        method: "put",
        data: body
    });
};

/**
 * @function proDelApi
 * @desc 删除产品
 * @param params {object} 请求参数
 * @return {AxiosPromise}
 */
export function proDelApi(params) {
    logger.redundancy(tag, "exec function proDelApi...");

    logger.debug(tag, "params:", params);

    let uri = `${PROAPI.delete}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + PROAPI.delete, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "delete"
    });
};

/**
 * @function roleListApi
 * @param params {object} 参数
 * @return {AxiosPromise}
 */
export function roleListApi(params) {
    logger.redundancy(tag, "exec function roleList...");
    logger.debug(tag, "params:", params);

    let uri = `${ROLEAPI.list}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    logger.debug(tag, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get",
        headers: {
            Authorization: "Bearer " + store.state.token
        }
    })
}

/**
 * 添加角色
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function addRoleApi(body) {
    logger.redundancy(tag, "exec function addRoleApi...");
    logger.info(tag, "url:", baseUrl + ROLEAPI.add, "body:", JSON.stringify(body));

    return request({
        baseURL: baseUrl,
        url: ROLEAPI.add,
        method: "post",
        data: body
    });
}

/**
 * @function editRoleApi
 * @desc 修改角色
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function editRoleApi(body) {
    logger.redundancy(tag, "exec function editRoleApi...");
    logger.info(tag, "url:", baseUrl + ROLEAPI.edit, "body:", JSON.stringify(body));

    return request({
        baseURL: baseUrl,
        url: `${ROLEAPI.edit}?id=${body.role.id}`,
        method: "put",
        data: body
    });
}

/**
 * @function delRoleApi
 * @desc 删除角色
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function delRoleApi(body) {
    logger.redundancy(tag, "exec function delRoleApi...");
    logger.info(tag, "url:", baseUrl + ROLEAPI.delete, "body:", JSON.stringify(body));

    return request({
        baseURL: baseUrl,
        url: `${ROLEAPI.edit}?id=${body.id}`,
        method: "delete",
        data: body
    });
}

/**
 * @function roleDetailsApi
 * @param params {object} 请求参数
 * @return {AxiosPromise}
 */
export function roleDetailsApi(params) {
    logger.redundancy(tag, "exec function roleDetails...");

    let uri = `${ROLEAPI.details}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    logger.debug(tag, "url:", baseUrl + ROLEAPI.details, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
}

/**
 * @function roleBoxApi
 * @desc 获取角色下拉列表
 * @return {AxiosPromise}
 */
export function roleBoxApi() {
    logger.redundancy(tag, "exec function roleBoxApi...");

    return request({
        baseURL: baseUrl,
        url: ROLEAPI.box,
        method: "get"
    });
}

/**
 * @function routeListApi
 * @desc 获取所有路由信息
 * @return {*}
 */
export function routeListApi() {
    logger.redundancy(tag, "exec function routeList...");
    logger.debug(tag, "url:", baseUrl, "uri:", ROUTEAPI.list);

    return request({
        baseURL: baseUrl,
        url: ROUTEAPI.list,
        method: "get",
        headers: {
            Authorization: "Bearer " + store.state.token
        }
    });
}

/**
 * @function routeDetailsApi
 * @param params {object} 请求参数
 * @return {AxiosPromise}
 */
export function routeDetailsApi(params) {
    logger.redundancy(tag, "exec function routeDetailsApi...");

    let uri = `${ROLEAPI.details}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    logger.debug(tag, "url:", baseUrl + ROUTEAPI.details, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
}

/**
 * @function envAddApi
 * @desc 添加环境
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function envAddApi(body) {
    logger.redundancy(tag, "exec function envAddApi...");
    logger.debug(tag, "url:", baseUrl + ENVAPI.add, "body:", body);

    return request({
        baseURL: baseUrl,
        url: ENVAPI.add,
        method: "post",
        data: body
    });
};

/**
 * @function envDetailsApi
 * @desc 获取环境信息
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function envDetailsApi(params) {
    logger.redundancy(tag, "exec function envDetailsApi...");
    logger.debug(tag, "params:", params);

    let uri = `${ENVAPI.details}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + ENVAPI.details, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
};

/**
 * @function envListApi
 * @desc 分页查询环境信息
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function envListApi(params) {
    logger.redundancy(tag, "exec function envListApi...");
    logger.debug(tag, "params:", params);

    let uri = `${ENVAPI.list}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + ENVAPI.list, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
};

/**
 * @function envEditApi
 * @desc 修改环境信息
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function envEditApi(body) {
    logger.redundancy(tag, "exec function envEditApi...");
    logger.debug(tag, "body:", body);

    return request({
        baseURL: baseUrl,
        url: `${ENVAPI.edit}?id=${body.id}`,
        method: "put",
        data: body
    });
};

/**
 * @function envDelApi
 * @desc 删除环境信息
 * @param params {object} 请求参数
 * @return {AxiosPromise}
 */
export function envDelApi(params) {
    logger.redundancy(tag, "exec function envDelApi...");

    logger.debug(tag, "params:", params);

    let uri = `${ENVAPI.del}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + ENVAPI.del, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "delete"
    });
};

/**
 * @function envBoxApi
 * @desc 获取环境列表
 * @return {AxiosPromise}
 */
export function envBoxApi() {
    logger.redundancy(tag, "exec function envBoxApi...");

    return request({
        baseURL: baseUrl,
        url: ENVAPI.box,
        method: "get"
    });
}

/**
 * @function iteraAddApi
 * @desc 添加迭代信息
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function iteraAddApi(body) {
    logger.redundancy(tag, "exec function iteraAddApi...");
    logger.debug(tag, "url:", baseUrl + ITERAAPI.add, "body:", body);

    return request({
        baseURL: baseUrl,
        url: ITERAAPI.add,
        method: "post",
        data: body
    });
};

/**
 * @function iteraListApi
 * @desc 分页查询迭代信息
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function iteraListApi(params) {
    logger.redundancy(tag, "exec function iteraListApi...");
    logger.debug(tag, "params:", params);

    let uri = `${ITERAAPI.list}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + ITERAAPI.list, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
};

/**
 * @function iteraDetailsApi
 * @desc 获取迭代信息
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function iteraDetailsApi(params) {
    logger.redundancy(tag, "exec function iteraDetailsApi...");
    logger.debug(tag, "params:", params);

    let uri = `${ITERAAPI.details}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + ITERAAPI.details, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
};

/**
 * @function iteraEditApi
 * @desc 修改迭代信息
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function iteraEditApi(body) {
    logger.redundancy(tag, "exec function iteraEditApi...");
    logger.debug(tag, "body:", body);

    return request({
        baseURL: baseUrl,
        url: `${ITERAAPI.edit}?id=${body.id}`,
        method: "put",
        data: body
    });
};

/**
 * @function iteraDelApi
 * @desc 删除迭代信息
 * @param params {object} 请求参数
 * @return {AxiosPromise}
 */
export function iteraDelApi(params) {
    logger.redundancy(tag, "exec function iteraDelApi...");

    logger.debug(tag, "params:", params);

    let uri = `${ITERAAPI.del}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + ITERAAPI.del, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "delete"
    });
};

/**
 * @function iteraBoxApi
 * @desc 获取迭代列表
 * @return {AxiosPromise}
 */
export function iteraBoxApi(params) {
    logger.redundancy(tag, "exec function iteraBoxApi...");
    logger.debug(tag, "params:", params);

    let uri = `${ITERAAPI.box}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + ITERAAPI.box, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
};

/**
 * @function groupAddApi
 * @desc 添加分组
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function groupAddApi(body) {
    logger.redundancy(tag, "exec function groupAddApi...");
    logger.debug(tag, "url:", baseUrl + GROUPAPI.add, "body:", body);

    return request({
        baseURL: baseUrl,
        url: GROUPAPI.add,
        method: "post",
        data: body
    });
};

/**
 * @function groupDetailsApi
 * @desc 获取分组信息
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function groupDetailsApi(params) {
    logger.redundancy(tag, "exec function groupDetailsApi...");
    logger.debug(tag, "params:", params);

    let uri = `${GROUPAPI.details}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + GROUPAPI.details, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
};

/**
 * @function groupListApi
 * @desc 分页查询分组信息
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function groupListApi(params) {
    logger.redundancy(tag, "exec function groupListApi...");
    logger.debug(tag, "params:", params);

    let uri = `${GROUPAPI.list}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + GROUPAPI.list, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
};

/**
 * @function groupEditApi
 * @desc 修改分组信息
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function groupEditApi(body) {
    logger.redundancy(tag, "exec function groupEditApi...");
    logger.debug(tag, "body:", body);

    return request({
        baseURL: baseUrl,
        url: `${GROUPAPI.edit}?id=${body.id}`,
        method: "put",
        data: body
    });
};

/**
 * @function groupDelApi
 * @desc 删除分组信息
 * @param params {object} 请求参数
 * @return {AxiosPromise}
 */
export function groupDelApi(params) {
    logger.redundancy(tag, "exec function groupDelApi...");
    logger.debug(tag, "params:", params);

    let uri = `${GROUPAPI.del}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + GROUPAPI.del, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "delete"
    });
};

/**
 * @function groupBoxApi
 * @desc 获取分组列表
 * @return {AxiosPromise}
 */
export function groupBoxApi() {
    logger.redundancy(tag, "exec function groupBoxApi...");

    return request({
        baseURL: baseUrl,
        url: GROUPAPI.box,
        method: "get"
    });
};

/**
 * @function caseAddApi
 * @desc 添加用例
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function caseAddApi(body) {
    logger.redundancy(tag, "exec function caseAddApi...");
    logger.debug(tag, "url:", baseUrl + CASEAPI.add, "body:", body);

    return request({
        baseURL: baseUrl,
        url: CASEAPI.add,
        method: "post",
        data: body
    });
};

/**
 * @function caseListApi
 * @desc 分页查询用例信息
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function caseListApi(params) {
    logger.redundancy(tag, "exec function caseListApi...");
    logger.debug(tag, "params:", params);

    let uri = `${CASEAPI.list}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + CASEAPI.list, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
};

/**
 * @function caseDetailsApi
 * @desc 获取用例信息
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function caseDetailsApi(params) {
    logger.redundancy(tag, "exec function caseDetailsApi...");
    logger.debug(tag, "params:", params);

    let uri = `${CASEAPI.details}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + CASEAPI.details, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
};

/**
 * @function caseEditApi
 * @desc 修改用例信息
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function caseEditApi(body) {
    logger.redundancy(tag, "exec function caseEditApi...");
    logger.debug(tag, "body:", body);

    return request({
        baseURL: baseUrl,
        url: `${CASEAPI.edit}?id=${body.id}`,
        method: "put",
        data: body
    });
};

/**
 * @function caseDelApi
 * @desc 删除用例信息
 * @param params {object} 请求参数
 * @return {AxiosPromise}
 */
export function caseDelApi(params) {
    logger.redundancy(tag, "exec function caseDelApi...");
    logger.debug(tag, "params:", params);

    let uri = `${CASEAPI.del}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + CASEAPI.del, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "delete"
    });
};

/**
 * @function caseBoxApi
 * @desc 获取用例列表
 * @return {AxiosPromise}
 */
export function caseBoxApi() {
    logger.redundancy(tag, "exec function caseBoxApi...");

    return request({
        baseURL: baseUrl,
        url: CASEAPI.box,
        method: "get"
    });
};

/**
 * @function taskAddApi
 * @desc 添加任务
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function taskAddApi(body) {
    logger.redundancy(tag, "exec function taskAddApi...");
    logger.debug(tag, "url:", baseUrl + TASKAPI.add, "body:", body);

    return request({
        baseURL: baseUrl,
        url: TASKAPI.add,
        method: "post",
        data: body
    });
};

/**
 * @function taskListApi
 * @desc 分页查询任务信息
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function taskListApi(params) {
    logger.redundancy(tag, "exec function taskListApi...");
    logger.debug(tag, "params:", params);

    let uri = `${TASKAPI.list}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + TASKAPI.list, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
}

/**
 * @function taskDetailsApi
 * @desc 获取任务信息
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function taskDetailsApi(params) {
    logger.redundancy(tag, "exec function taskDetailsApi...");
    logger.debug(tag, "params:", params);

    let uri = `${TASKAPI.details}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + TASKAPI.details, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
}

/**
 * @function taskEditApi
 * @desc 修改任务信息
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function taskEditApi(body) {
    logger.redundancy(tag, "exec function taskEditApi...");
    logger.debug(tag, "body:", body);

    return request({
        baseURL: baseUrl,
        url: `${TASKAPI.edit}?id=${body.id}`,
        method: "put",
        data: body
    });
}

/**
 * @function taskDelApi
 * @desc 删除任务信息
 * @param params {object} 请求参数
 * @return {AxiosPromise}
 */
export function taskDelApi(params) {
    logger.redundancy(tag, "exec function taskDelApi...");
    logger.debug(tag, "params:", params);

    let uri = `${TASKAPI.del}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + TASKAPI.del, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "delete"
    });
}

/**
 * @function taskStartApi
 * @desc 开始任务
 * @param body {object} 请求数据
 * @return {AxiosPromise}
 */
export function taskStartApi(body) {
    logger.redundancy(tag, "exec function taskStartApi...");
    logger.debug(tag, "url:", baseUrl + TASKAPI.start, "body:", body);

    return request({
        baseURL: baseUrl,
        url: `${TASKAPI.start}?id=${body.id}`,
        method: "post"
    });
}

/**
 * @function taskReportApi
 * @desc 获取任务报告
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function taskReportApi(params) {
    logger.redundancy(tag, "exec function taskReportApi...");
    logger.debug(tag, "params:", params);

    let uri = `${TASKAPI.report}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + TASKAPI.report, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
}

/**
 * @function deviceScanApi
 * @desc 扫描设备
 * @return {AxiosPromise}
 */
export function deviceScanApi() {
    logger.redundancy(tag, "exec function deviceScanApi...");

    return request({
        baseURL: baseUrl,
        url: DEVICEAPI.scan,
        method: "post"
    });
}

/**
 * @function deviceListApi
 * @desc 查询设备列表
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function deviceListApi(params) {
    logger.redundancy(tag, "exec function deviceListApi...");
    logger.debug(tag, "params:", params);

    let uri = `${DEVICEAPI.list}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + DEVICEAPI.list, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
}

/**
 * @function deviceRefreshApi
 * @desc 刷新设备
 * @param params {object} 请求参数
 * @return {AxiosPromise}
 */
export function deviceRefreshApi(params) {
    logger.redundancy(tag, "exec function deviceRefreshApi...");
    logger.debug(tag, "params:", params);

    let uri = `${DEVICEAPI.refrsh}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + DEVICEAPI.refrsh, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "post"
    });
}

/**
 * @function deviceDetailsApi
 * @desc 获取设备信息
 * @params params {object} 请求参数
 * @return {AxiosPromise}
 */
export function deviceDetailsApi(params) {
    logger.redundancy(tag, "exec function deviceDetailsApi...");
    logger.debug(tag, "params:", params);

    let uri = `${DEVICEAPI.details}?`;
    for (let property in params) {
        uri = uri + `${property}=${params[property]}&`;
    }
    uri = uri.slice(0, uri.length - 1);
    logger.debug(tag, "url:", baseUrl + DEVICEAPI.details, "uri:", uri);

    return request({
        baseURL: baseUrl,
        url: uri,
        method: "get"
    });
}

/**
 * @function deviceBoxApi
 * @desc 获取设备列表
 * @return {AxiosPromise}
 */
export function deviceBoxApi() {
    logger.redundancy(tag, "exec function deviceBoxApi...");

    return request({
        baseURL: baseUrl,
        url: DEVICEAPI.box,
        method: "get"
    });
}