<template>
  <a-layout class="top-layout">
    <!-- 导航面板 -->
    <a-layout-sider v-model:collapsed="navState.collapsed" collapsible :trigger="null">
      <div class="logo-div">
        <img src="../assets/logo.png" class="logo-middle"/>
        <span class="font-size-16 font-color-white font-weight-600 margin-left-10">UIAUTOTEST</span>
      </div>
      <a-menu v-model:selectedKeys="navState.selectedKeys" theme="dark" @select="selectMenuItem" mode="inline">
        <template v-for="item in navState.menuListData">
          <template v-if="item.type === 'single'">
            <a-menu-item :key="item.key">
              <component :is="item.icon"/>
              <span>{{item.name}}</span>
            </a-menu-item>
          </template>
          <template v-else>
            <a-sub-menu :key="item.key">
              <template #title>
                <span>
                  <component :is="item.icon" />
                  <span>{{item.name}}</span>
                </span>
              </template>
              <a-menu-item v-for="childItem in item.child" :key="childItem.key">{{childItem.name}}</a-menu-item>
            </a-sub-menu>
          </template>
        </template>
      </a-menu>
    </a-layout-sider>
    <!-- 内容面板 -->
    <a-layout>
      <a-layout-header class="header-layout">
        <div class="header-layout-left">
          <menu-unfold-outlined :style="{fontSize: '20px'}" v-if="navState.collapsed"
                                class="mouse-pointer" @click="() => (navState.collapsed = !navState.collapsed)"/>
          <menu-fold-outlined :style="{fontSize: '20px'}" class="mouse-pointer"
                              v-else @click="() => (navState.collapsed = !navState.collapsed)"/>
          <redo-outlined :style="{fontSize: '20px'}" class="margin-left-10 mouse-pointer" v-on:click="refreshPage" />
        </div>
        <div class="header-layout-right">
          <template v-if="loginStatus">
            <a-avatar class="mouse-pointer" size="small" @click="onClickOfAction('登录')">
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
          </template>
          <template v-else>
            <a-avatar class="mouse-pointer" size="small" style="color: #f56a00; background-color: #fde3cf" @click="onClickOfAction('登录')">孙</a-avatar>
          </template>
        </div>
      </a-layout-header>
      <a-layout-content class="margin-left-10 margin-right-10 margin-top-10 margin-bottom-10">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer class="footer-layout">无忧行UI自动化测试平台 ©2022 Created by 技术中台</a-layout-footer>
    </a-layout>
  </a-layout>
  <!-- 个人信息模态窗口 -->
  <a-modal v-model:visible="visibleOfPersonalModal" title="个人信息" >
    <template #footer>
      <a-button>取消</a-button>
      <a-button type="primary" @click="onClickOfEdit">保存</a-button>
    </template>
    <a-form
        :model="userFormState"
        name="userForm"
        ref="edit"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
        @finish="onUserFormFinish"
        @finishFailed="onUserFormFinishFailed">
      <a-form-item label="姓名:" name="name">
        <a-input disabled="true" v-model:value="userFormState.name"></a-input>
      </a-form-item>
      <a-form-item label="用户名:" name="nickName">
        <a-input disabled="true" v-model:value="userFormState.nickName"></a-input>
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input disabled="true" v-model:value="userFormState.nickName"></a-input>
      </a-form-item>
      <a-form-item label="性别" name="sex">
        <a-select disabled="true" v-model:value="userFormState.sex" :options="sexOptions"></a-select>
      </a-form-item>
      <a-form-item label="手机号" name="phone">
        <a-input disabled="true" v-model:value="userFormState.phone"></a-input>
      </a-form-item>
      <a-form-item label="密码" name="newPassword" :rules="[{ required: true, message: '请输入新密码！' }]">
        <a-input-password placeholder="请输入新密码" v-model:value="userFormState.newPassword"></a-input-password>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  import {
    AppstoreOutlined, ForkOutlined, UnorderedListOutlined, MobileOutlined, MenuUnfoldOutlined,
    OrderedListOutlined, ControlOutlined, MenuFoldOutlined, RedoOutlined, SettingOutlined, UserOutlined
  } from '@ant-design/icons-vue';
  import {defineComponent, getCurrentInstance, onMounted, ref} from 'vue';

  import {useRouter} from "vue-router";

  import '../assets/css/base.css';
  import logger from "../utils/logger";
  import {userDetailsApi, userEditApi} from "../api/goautapi";
  import {openFailedNotification, openSuccessNotification} from "../components/notification";
  import strings from "../assets/strings";
  import store from "../store/store";

  const tag = "/";

  export default defineComponent({
    name: "MainLayout",
    setup() {
      const router = useRouter();
      const instance = getCurrentInstance();

      // state: 登录状态
      const loginStatus = ref(true);

      // options: 性别options
      const sexOptions = ref([
        {label: "全部性别", value: -1}, {label: "女性", value: 0}, {label: "男性", value: 1}
      ]);

      // state: 导航数据
      const navState = ref({
        collapsed : false,
        selectedKeys: ['/index/product'],
        menuListData: [
          {key: "/index/product", icon: AppstoreOutlined, name: "产品", type: "single"},
          {key: "/index/iteration", icon: ForkOutlined, name: "迭代", type: "single"},
          {
            key: "/index/cases",
            icon: OrderedListOutlined,
            name: "用例管理",
            type: "multi",
            child:
                [
                  {key: "/index/cases/list", name: "用例列表"},
                  {key: "/index/cases/add", name: "创建用例"},
                  {key: "/index/cases/statistics", name: "用例统计"}
                ]
          },
          {key: "/index/device", icon: MobileOutlined, name: "设备管理", type: "single"},
          {
            key: "/index/task",
            icon: UnorderedListOutlined,
            name: "任务大厅",
            type: "multi",
            child:
                [
                  {key: "/index/task/list", name: "任务列表"},
                  {key: "/index/task/add", name: "创建任务"},
                  {key: "/index/task/statistics", name: "任务统计"}
                ]
          },
          {
            key: "/index/adm",
            icon: SettingOutlined,
            name: "后台",
            type: "multi",
            child:
                [
                  {key: "/index/adm/user", name: "用户管理"},
                  {key: "/index/adm/jurisdiction", name: "权限管理"},
                  {key: "/index/adm/device", name: "设备管理"},
                  {key: "/index/adm/product", name: "产品管理"},
                  {key: "/index/adm/iteration", name: "迭代管理"},
                  {key: "/index/adm/env", name: "环境管理"},
                  {key: "/index/adm/group", name: "业务分组"}
                ]
          }
        ]
      });

      // state: 个人信息弹窗显示状态
      const visibleOfPersonalModal = ref(false);

      // state: 用户表单数据
      const userFormState = ref({
        id: 0,
        name: "",
        nickName: "",
        email: "",
        sex: [],
        phone: "",
        newPassword: "",
      });

      /**
       * @function lightMenuItem
       * @desc 高亮导航菜单
       */
      const lightMenuItem = () => {
        let currentPath = router.currentRoute.value.fullPath;
        console.log("currentPath: ", currentPath);

        if(currentPath.indexOf("/index/iteration") !== -1) {
          currentPath = "/index/iteration"
        }

        navState.value.selectedKeys[0] = currentPath;
      };

      /**
       * @function selectMenuItem
       * @desc 选择导航菜单
       * @param event object 事件
       */
      const selectMenuItem = (event) => {
        console.log("key: ", event.key);
        router.push(event.key);
      }

      /**
       * @function refreshPage
       * @desc 刷新页面
       */
      const refreshPage = () => {
        let currentPath = router.currentRoute.value.fullPath;
        console.log("currentPath: ", currentPath);
        location.reload();
      }

      /**
       * @function onClickOfAction
       * @desc 操作点击事件
       * @param event str 点击事件 [登录]
       */
      const onClickOfAction = (event) => {
        console.log("event: ", event);
        switch (event) {
          case "登录":
            visibleOfPersonalModal.value = true;
            userDeatils(store.state.userId);
            break;
          default:
            break;
        }
      };

      /**
       * @function onUserFormFinish
       * @desc 添加用户表单提交完回调函数
       * @param  values obect 返回值
       */
      const onUserFormFinish = values => {
        console.log('Success:', values);
      };

      /**
       * @function onUserFormFinishFailed
       * @desc 添加用户表单提交完失败回调函数
       * @param errorInfo object 错误信息
       */
      // 添加用户表单提交完失败回调函数
      const onUserFormFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

      /**
       * @function onClickOfEdit
       * @desc 用户信息保存点击事件
       */
      const onClickOfEdit = () => {
        userEdit();
      }

      onMounted(() => {
        lightMenuItem();
      });

      /**
       * @function userDetails
       * @desc 获取用户信息
       * @param id {number} 用户id
       */
      const userDeatils = (id) => {
        let params = {id: id};
        userDetailsApi(params).then((res) => {
          logger.info(tag, "res:", res);
          if(res.status === 200) {
            let data = res.data;
            if(data.code === 200) {
              userFormState.value.id = data.data.ID,
              userFormState.value.sex = data.data.sex;
              userFormState.value.name = data.data.username;
              userFormState.value.email = data.data.email;
              userFormState.value.nickName = data.data.nickName;
              userFormState.value.phone = data.data.phone;
            }else {
              openFailedNotification(data.message);
            }
          }else {
            openFailedNotification(strings.undefined_error);
          }
        }).catch((err) => {
          logger.error(tag, "err: ", err);
          openFailedNotification(strings.undefined_error);
        }).finally(() => {
          logger.info(tag, "call userDetailsApi function complete!")
        });
      };

      /**
       * @function userEdit
       * @desc 编辑用户信息
       */
      const userEdit = () => {
        logger.redundancy(tag, "exec function userEdit...");

        instance.refs["edit"].validateFields().then((data) => {
          logger.info(tag, "data: ", data);

          let body = {
            id: userFormState.value.id,
            username: data.name,
            password: data.password,
            nickName: data.nickName,
            sex: data.sex,
            phone: data.phone,
            email: data.email
          }

          userEditApi(body).then((res) => {
            logger.info(tag, "res:", res);
            if (res.status === 200) {
              let data = res.data;
              if (data.code === 200) {
                openSuccessNotification("编辑用户成功！");
              }else {
                openFailedNotification(data.msg);
              }
            }else {
              openFailedNotification(strings.undefined_error);
            }
          }).catch((err) => {
            logger.error(tag, "err: ", err);
            openFailedNotification(strings.undefined_error);
          }).finally(() => {
            logger.info(tag, "call userEditApi complete!")
          })
        }).catch((err) => {
          logger.error(tag, "err: ", err);
        }).finally(() => {
          logger.info(tag, "call edit validateFields function complete!")
        })
      };

      return {
        router,
        sexOptions,
        loginStatus,
        navState,
        visibleOfPersonalModal,
        userFormState,
        lightMenuItem,
        onClickOfAction,
        selectMenuItem,
        refreshPage,
        onUserFormFinish,
        onUserFormFinishFailed,
        onClickOfEdit
      };
    },
    components: {
      AppstoreOutlined,
      ForkOutlined,
      UnorderedListOutlined,
      MobileOutlined,
      OrderedListOutlined,
      ControlOutlined,
      MenuFoldOutlined,
      RedoOutlined,
      MenuUnfoldOutlined,
      SettingOutlined,
      UserOutlined
    }
  });
</script>

<style scoped>
  .top-layout {
    min-height: 100vh;
  }

  .logo-div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-left: 20px;
    height: 64px;
  }

  .header-layout {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0 10px;
  }
  .header-layout-left {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
  }
  .header-layout-right {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
  }

  .footer-layout {
    text-align: center;
  }
</style>