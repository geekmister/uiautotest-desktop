/*
    全局状态管理器
 */

import { createStore } from 'vuex';

import logger from "../utils/logger";

const tag = "store.js";

const store = createStore({
    state () {
        return {
            token: "",
            userId: 0
        }
    },
    mutations: {
        updateToken (state, token) {
            logger.info("token:", token);
            state.token = token;
        },
        updateUserId (state, userId) {
            logger.info("userId:", userId);
            state.userId = userId;
        }
    },
    getters: {
        getToken(state) {
            return state.token;
        },
        getUserId(state) {
            return state.userId;
        }
    }
});

export default store;
