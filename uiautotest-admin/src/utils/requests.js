import axios from "axios";
import {useRouter} from "vue-router";

import store from "../store/store";
import logger from "./logger";

const router = useRouter();
const tag = "request.js"

const request = axios.create({
    timeout: 30000
});

request.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
})

request.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response) {
        // logger.error(tag, "err:",  error);
        // logger.error(tag, "err.response:",  error.response);
        // logger.error(tag, "err.response.status:",  error.response.status);
        // switch (error.response.status) {
        //     case 401:
        //         // 返回 401 清除token信息并跳转到登录页面
        //         store.commit("updateToken", "");
        //         router.push("/index/login").then(r => {});
        // }
    }
    return Promise.reject(error.response);
});

export default request
