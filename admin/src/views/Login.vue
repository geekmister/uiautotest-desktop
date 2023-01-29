<template>
  <div class="container">
    <!-- flag -->
    <div class="flag-div">
      <div class="flag-logo-div">
        <img src="../assets/logo.png" class="flag-logo-img"/>
        <span class="flag-logo-span">UIAUTOTEST PLATFORM</span>
      </div>
      <span class="flag-logo-desc-span">移动端UI自动化测试平台</span>
    </div>

    <!-- form -->
    <a-tabs v-model:active-key="activeKey" centered>
      <a-tabs-tab-pane key="1" tab="账号密码登录">
        <a-form :model="formState" @finish="onFinish" @finishFailed="onFinishFailed" name="login" class="form-div">
          <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名称!' }]">
            <a-input v-model:value="formState.username" placeholder="请输入用户名称" class="form-item-input">
              <template #prefix>
                <UserOutlined class="form-item-icon"/>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password" :rules="[{ required: true, message: '请输入用户密码!' }]">
            <a-input-password v-model:value="formState.password" placeholder="请输入用户密码" class="form-item-input">
              <template #prefix>
                <LockOutlined class="form-item-icon"/>
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" class="form-btn">登录</a-button>
          </a-form-item>
        </a-form>
      </a-tabs-tab-pane>
    </a-tabs>

    <!-- footer -->
    <span class="footer">
      无忧行UI自动化测试平台 ©2022 Created by 技术中台
    </span>
  </div>
</template>

<script>
  import {UserOutlined, LockOutlined} from '@ant-design/icons-vue';

  import {defineComponent, ref} from "vue";
  import {useRouter} from "vue-router";


  import {login} from "../api/goautapi";
  import logger from "../utils/logger";
  import "../assets/strings";
  import {openFailedNotification} from "../components/notification";
  import strings from "../assets/strings";
  import store from "../store/store";

  const tag = "Login.vue";

  export default defineComponent({
    name: "Login",
    components: {
      UserOutlined, LockOutlined
    },
    setup() {
      const router = useRouter();

      // state: 表单数据
      const formState = ref({
        username: "",
        password: ""
      });

      // state: Tab卡片焦点卡片数据
      const activeKey = ref(1);

      /**
       * 提交表单且数据验证成功后回调事件
       * @param values {object} 表单对象
       */
      const onFinish = values => {
        logger.info(tag, "form vertify success", values);
        loginApi(values);
      };

      /**
       * 提交表单且数据验证失败后回调事件
       * @param errorInfo {object} 错误信息
       */
      const onFinishFailed = errorInfo => {
        logger.info(tag, "form vertify failed", errorInfo);
      };

      /**
       * @function loginApi
       * @desc 登录
       * @param data
       */
      const loginApi = (data) => {
        let body = {
          username: data.username,
          password: data.password
        }

        login(body).then((res) => {
          logger.info(tag, "res", res);
          if(res.status === 200) {
            let data = res.data;
            if(data.code === 200) {
              let token = data.data.token;
              logger.info(tag, "token:", token);
              let userId = data.data.userId;
              logger.info(tag, "token:", token);
              store.commit("updateToken", token);
              store.commit("updateUserId", userId);
              router.push("/index/product/list");
            }else {
              openFailedNotification(data.msg);
            }
          }else {
            openFailedNotification(strings.undefined_error);
          }
        }).catch((err) => {
          logger.info(tag, "err", err);
          openFailedNotification(strings.undefined_error);
        }).finally(() => {
          logger.info(tag, "call login api complete!");
        });
      };

      return {
        formState,
        activeKey,
        onFinish,
        onFinishFailed,
      }
    }
  })
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f0f2f5;
    min-width: 100vw;
    min-height: 100vh;
  }

  /* flag */
  .flag-div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 40px;
  }
  .flag-logo-div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .flag-logo-img {
    width: 44px;
    height: 44px;
  }
  .flag-logo-span {
    font-size: 24px;
    color: #000000;
    font-weight: 600;
    margin-left: 10px
  }
  .flag-logo-desc-span {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0,0,0,.45);
  }

  /* form */
  .form-div {
    width: 300px;
  }
  .form-item-icon {
    font-size: 18px;
  }
  .form-item-input {
    padding: 10px 5px;
  }
  .form-btn {
    width: 100%;
    height: 40px;
  }

  /* footer */
  .footer {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0,0,0,.45);
    margin-top: 60px;
  }
</style>