import axios from "axios";
const request = axios.create({
    timeout: 30000,
});
request.interceptors.request.use((config) => {
    // console.log("baseURL: ", config.baseURL);
    // console.log("url: ", config.url);
    // console.log("data: ", config.data);
    return config;
}, (error) => {
    return Promise.reject(error);
})
request.interceptors.response.use(config => {
    // console.log("api: ", config.request);
    // console.log("data: ", config.data);
    return config
}, error => {
    return Promise.reject(error);
});
export default request
