<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>后台</a-breadcrumb-item>
        <a-breadcrumb-item>用户管理</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面添加用户、查阅用户、编辑用户等相关操作！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button type="primary" @click="onClickOfAdd">添加用户</a-button>
    </div>
  </div>
  <!-- 搜索 -->
  <div class="page-search-card-div">
    <div class="page-search-card-row-div">
      <div>
        <span>选择性别：</span>
        <a-select v-model:value="searchState.sex" class="page-search-card-item"
                  placeholder="请选择性别" :options="sexOptions"></a-select>
      </div>
      <div>
        <span>选择角色：</span>
        <a-select v-model:value="searchState.roleId" class="page-search-card-item"
                  placeholder="请选择角色" :options="roleOptions"></a-select>
      </div>
      <div>
        <span>选择状态：</span>
        <a-select v-model:value="searchState.disabled" class="page-search-card-item"
                  placeholder="请选择状态" :options="statusOptions"></a-select>
      </div>
      <div>
        <span>用户姓名：</span>
        <a-input
            v-model:value="searchState.searchKey" placeholder="请输入用户姓名" size="default"
            class="page-search-card-item"/>
      </div>
      <div class="margin-top-10">
        <span>创建时间：</span>
        <a-range-picker v-model:value="searchState.time" show-time :locale="locale"/>
      </div>
    </div>
    <div class="page-search-card-btn-div">
      <a-button type="primary" class="margin-right-10" @click="onClickOfEmpty">清空</a-button>
      <a-button type="primary" @click="onClickOfSearch">搜索</a-button>
    </div>
  </div>
  <!-- 表格 -->
  <div class="page-table-card-div">
    <a-table :columns="tableState.columns" :dataSource="tableState.data" style="width: 100%;">
      <template #bodyCell="{column, record}">
        <template v-if="column.key === 'action'">
          <template v-for="item in record.action">
            <a class="margin-right-10" v-if="item === '详情'" v-on:click="onClickOfDetails(record.id)">{{item}}</a>
            <a class="margin-right-10" v-else-if="item === '编辑'" v-on:click="onClickOfEdit(record.id)">{{item}}</a>
            <a class="margin-right-10" v-else-if="item === '删除'" v-on:click="onClickOfDel(record.id)">{{item}}</a>
          </template>
        </template>
      </template>
    </a-table>
  </div>
  <!-- 添加用户 -->
  <a-drawer
      v-model:visible="drawerState.visibleAdd" title="添加用户" placement="right" size="default"
      @after-visible-change="afterVisibleChangeOfAdd">
    <template #extra>
      <a-button type="primary" @click="onClickOfAddSave">保存</a-button>
    </template>
    <a-form
        ref="add" :model="formState" name="userForm" :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }" autocomplete="off">
      <a-form-item label="姓名:" name="name" :rules="[{ required: true, message: '请输入1-10个长度的用户姓名！' }]">
        <a-input placeholder="请输入1-10个长度的用户姓名" v-model:value="formState.name"></a-input>
      </a-form-item>
      <a-form-item label="用户名:" name="nickName" :rules="[{ required: true, message: '请输入1-10个长度的用户名！' }]">
        <a-input placeholder="请输入1-10个长度的用户名" v-model:value="formState.nickName"></a-input>
      </a-form-item>
      <a-form-item label="邮箱" name="email" :rules="[{ required: true, message: '请输入用户邮箱！' }]">
        <a-input placeholder="请输入用户邮箱" v-model:value="formState.email"></a-input>
      </a-form-item>
      <a-form-item label="性别" name="sex" :rules="[{ required: true, message: '请选择性别！' }]">
        <a-select v-model:value="formState.sex" placeholder="请选择性别" :options="sexOptions"></a-select>
      </a-form-item>
      <a-form-item label="手机号" name="phone" :rules="[{ required: true, message: '请输入手机号！' }]">
        <a-input placeholder="请输入手机号" v-model:value="formState.phone"></a-input>
      </a-form-item>
      <a-form-item label="状态" name="status" :rules="[{ required: true, message: '请选择状态！' }]">
        <a-select v-model:value="formState.status" placeholder="请选择状态" :options="statusOptions"></a-select>
      </a-form-item>
      <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码！' }]">
        <a-input-password placeholder="请输入密码" v-model:value="formState.password"></a-input-password>
      </a-form-item>
      <a-form-item label="角色" name="role" :rules="[{ required: true, message: '请选择角色！' }]">
        <a-select v-model:value="formState.role" placeholder="请选择角色" :options="roleOptions"></a-select>
      </a-form-item>
    </a-form>
  </a-drawer>
  <!-- 编辑用户 -->
  <a-drawer
      v-model:visible="drawerState.visibleEdit" title="编辑用户" placement="right" size="default"
      @after-visible-change="afterVisibleChangeOfEdit">
    <template #extra>
      <a-button type="primary" @click="onClickOfEditSave">保存</a-button>
    </template>
    <a-form
        ref="edit" :model="formState" name="userForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
        autocomplete="off">
      <a-form-item label="姓名:" name="name" :rules="[{ required: true, message: '请输入1-10个长度的用户姓名！' }]">
        <a-input placeholder="请输入1-10个长度的用户姓名" v-model:value="formState.name"></a-input>
      </a-form-item>
      <a-form-item label="用户名:" name="nickName" :rules="[{ required: true, message: '请输入1-10个长度的用户名！' }]">
        <a-input placeholder="请输入1-10个长度的用户名" v-model:value="formState.nickName"></a-input>
      </a-form-item>
      <a-form-item label="邮箱" name="email" :rules="[{ required: true, message: '请输入用户邮箱！' }]">
        <a-input placeholder="请输入用户邮箱" v-model:value="formState.email"></a-input>
      </a-form-item>
      <a-form-item label="性别" name="sex" :rules="[{ required: true, message: '请选择性别！' }]">
        <a-select v-model:value="formState.sex" placeholder="请选择性别" :options="sexOptions"></a-select>
      </a-form-item>
      <a-form-item label="手机号" name="phone" :rules="[{ required: true, message: '请输入手机号！' }]">
        <a-input placeholder="请输入手机号" v-model:value="formState.phone"></a-input>
      </a-form-item>
      <a-form-item label="状态" name="status" :rules="[{ required: true, message: '请选择状态！' }]">
        <a-select v-model:value="formState.status" placeholder="请选择状态" :options="statusOptions"></a-select>
      </a-form-item>
      <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码！' }]">
        <a-input-password placeholder="请输入密码" v-model:value="formState.password"></a-input-password>
      </a-form-item>
      <a-form-item label="角色" name="role" :rules="[{ required: true, message: '请选择角色！' }]">
        <a-select v-model:value="formState.role" placeholder="请选择角色" :options="roleOptions"></a-select>
      </a-form-item>
    </a-form>
  </a-drawer>
  <!-- 用户详情 -->
  <a-drawer v-model:visible="drawerState.visibleDetails" title="用户详情" placement="right" size="default"
            @after-visible-change="afterVisibleChangeOfDetails">
    <a-form
        :model="formState" name="userForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" autocomplete="off">
      <a-form-item label="姓名" name="name">
        <a-input disabled="true" placeholder="请输入1-10个长度的用户姓名" v-model:value="formState.name"></a-input>
      </a-form-item>
      <a-form-item label="用户名:" name="nickName">
        <a-input disabled="true" placeholder="请输入1-10个长度的用户名" v-model:value="formState.nickName"></a-input>
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input disabled="true" placeholder="请输入用户邮箱" v-model:value="formState.email"></a-input>
      </a-form-item>
      <a-form-item label="性别" name="sex">
        <a-select disabled="true" v-model:value="formState.sex" placeholder="请选择性别" :options="sexOptions"></a-select>
      </a-form-item>
      <a-form-item label="手机号" name="phone">
        <a-input disabled="true" placeholder="请输入手机号" v-model:value="formState.phone"></a-input>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-select disabled="true" v-model:value="formState.status" placeholder="请选择状态"
                  :options="statusOptions"></a-select>
      </a-form-item>
      <a-form-item label="角色" name="role">
        <a-select disabled="true" v-model:value="formState.role" placeholder="请选择角色" :options="roleOptions"></a-select>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
  import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";
  import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

  import {userAddApi, userListApi, userDetailsApi, userEditApi, userDelApi, roleBoxApi} from "../../api/goautapi";
  import {openFailedNotification, openSuccessNotification} from "../../components/notification";
  import logger from "../../utils/logger";
  import strings from "../../assets/strings";
  import timeUtils, {timeOfISO8601ToFormatString} from "../../utils/timeUtils";

  const tag = "/index/adm/UserAdm";

  export default defineComponent({
    name: "UserAdm",
    setup() {
      const instance = getCurrentInstance();

      /* 生命周期函数 */
      onMounted(() => {userList(); roleBox();});

      /* state等相关数据 */

      // state: 搜索数据
      const searchState = ref({
        sex: [], roleId: [], disabled: [], searchKey: "", startDate: 0, endDate: 0, pageNum: 1, pageSize: 10, time: []
      });

      // state: 用户表单数据
      const formState =  ref({
        name: "", nickName: "", email: "", sex: [], phone: "", status: [], password: "", role: [], id: 0
      })

      // options: 性别options
      const sexOptions = ref([
          {label: "女性", value: 0}, {label: "男性", value: 1}
      ]);

      // options: 状态options
      const statusOptions = ref([
        {label: "启用", value: 0}, {label: "禁用", value: 1}
      ]);

      // options: 用户表单-角色options
      const roleOptions = ref([]);

      // state: 用户列表数据
      const tableState = ref({
        data: [],
        columns: [
          {title: '姓名', dataIndex: 'name', key: 'name', ellipsis: true},
          {title: '用户名', dataIndex: 'nickName', key: 'nickName', ellipsis: true},
          {title: '邮箱', key: 'email', dataIndex: 'email', ellipsis: true},
          {title: '性别', key: 'sex', dataIndex: 'sex', ellipsis: true},
          {title: '手机号', key: 'phone', dataIndex: 'phone', ellipsis: true},
          {title: '最后登录时间', key: 'loginTime', dataIndex: 'loginTime', ellipsis: true},
          {title: '创建时间', key: 'createTime', dataIndex: 'createTime', ellipsis: true},
          {title: "更新时间", key: "updateTime", dataIndex: "updateTime", ellipsis: true},
          {title: "角色", key: "role", dataIndex: "role", ellipsis: true},
          {title: "状态", key: "status", dataIndex: "status", ellipsis: true},
          {title: "操作", key: "action", dataIndex: "action", width: "150px"}
        ]
      });

      // state: Drawer数据
      const drawerState = ref({
        visibleAdd: false,
        visibleEdit: false,
        visibleDetails: false
      });

      /* 人机交互事件 */

      /**
       * @function clearFormState
       * @desc 清空表单
       */
      const clearFormState = () => {
        formState.value = {
          name: "", nickName: "", email: "", sex: [], phone: "", status: [], password: "", role: [], id: 0
        }
      }

      /**
       * @function onClickOfAdd
       * @desc 添加按钮点击事件
       */
      const onClickOfAdd = () => {
        drawerState.value.visibleAdd = true;
      }

      /**
       * @function onClickOfAddSave
       * @desc 添加保存按钮点击事件
       */
      const onClickOfAddSave = () => {
        userAdd();
      }

      /**
       * @function onClickOfDetails
       * @desc 详情按钮点击事件
       * @param id {number} 用户id
       */
      const onClickOfDetails = (id) => {
        drawerState.value.visibleDetails = true;
        userDeatils(id);
      }

      /**
       * @function onClickOfEdit
       * @desc 编辑按钮点击事件
       * @param id {number} 用户id
       */
      const onClickOfEdit = (id) => {
        formState.value.id = id;
        drawerState.value.visibleEdit = true;
        userDeatils(id);
      }

      /**
       * @function onClickOfEditSave
       * @desc 编辑保存按钮点击事件
       */
      const onClickOfEditSave = () => {
        userEdit();
      }

      /**
       * @function onClickOfDel
       * @desc 删除按钮点击事件
       * @param id {number} 用户id
       */
      const onClickOfDel = (id) => {
        userDel(id);
      }

      /**
       * @function afterVisibleChangeOfAdd
       * @desc 添加环境抽屉显示/隐藏的回调函数
       * @param bool boolean
       */
      const afterVisibleChangeOfAdd = (bool) => {
        if(!bool) {clearFormState()}
      };

      /**
       * @function afterVisibleChangeOfEdit
       * @desc 编辑环境抽屉显示/隐藏的回调函数
       * @param bool boolean
       */
      const afterVisibleChangeOfEdit = (bool) => {
        if(!bool) {clearFormState()}
      };

      /**
       * @function afterVisibleChangeOfDetails
       * @desc 环境详情抽屉显示/隐藏的回调函数
       * @param bool boolean
       */
      const afterVisibleChangeOfDetails = (bool) => {
        if(!bool) {clearFormState()}
      };

      /**
       * @function onClickOfSearch
       * @desc 点击搜索事件
       */
      const onClickOfSearch = () => {
        logger.redundancy(tag, "exec function onClickOfSearch...");

        userList();
      }

      /**
       * @function onClickOfEmpty
       * @desc 点击清空事件
       */
      const onClickOfEmpty = () => {
        logger.redundancy(tag, "exec function onClickOfEmpty...");

        searchState.value.sex = [];
        searchState.value.roleId = [];
        searchState.value.disabled = [];
        searchState.value.searchKey = "";
        searchState.value.startDate = 0;
        searchState.value.endDate = 0;
        searchState.value.time = [];
      }

      /* 接口对接函数 */

      /**
       * @function roleBox
       * @desc 查询角色下拉列表
       */
      const roleBox = () => {
        logger.redundancy(tag, "exec function roleBox...");

        roleBoxApi().then((res) => {
          logger.info(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              let arr = data.data;
              for(let i = 0; i < arr.length; i++) {
                let item = {
                  label: arr[i].name, value: arr[i].id
                }
                roleOptions.value.push(item);
              }
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
          logger.info(tag, "call roleBoxApi complete!")
        });
      };

      /**
       * @function userAdd
       * @desc 添加用户
       */
      const userAdd = () => {
        logger.redundancy(tag, "exec function userAdd...")
        instance.refs["add"].validateFields().then((data) => {
          logger.info(tag, "data: ", data);

          let body = {
            roleId: data.role,
            username: data.name,
            password: data.password,
            nickName: data.nickName,
            sex: data.sex,
            phone: data.phone,
            email: data.email,
            disabled: data.status
          }

          userAddApi(body).then((res) => {
            logger.info(tag, "res:", res);
            if (res.status === 200) {
              let data = res.data;
              if (data.code === 200) {
                openSuccessNotification("添加用户成功！");
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
            logger.info(tag, "call userAddApi complete!")
          })
        }).catch((err) => {
          logger.error(tag, "err: ", err);
        }).finally(() => {
          logger.info(tag, "call add validateFields function complete!")
        })
      };

      /**
       * @function getSearchParams
       * @desc 获取查询参数对象
       */
      const getSearchParams = () => {
        logger.redundancy(tag, "exec function getSearchParams...");
        logger.debug(tag, "searchState:", searchState.value);

        let params = {pageNum: 1, pageSize: 10};
        if(!(searchState.value.sex instanceof Array)) {
          params.sex = searchState.value.sex;
        }
        if(!(searchState.value.roleId instanceof Array)) {
          params.roleId = searchState.value.roleId;
        }
        if(!(searchState.value.disabled instanceof Array)) {
          params.disabled = searchState.value.disabled;
        }
        if(!(searchState.value.searchKey === "")) {
          params.searchKey = searchState.value.searchKey;
        }
        if(searchState.value.time.length > 0) {
          let startTime = `${searchState.value.time[0]
              .$d.getFullYear()}/${searchState.value.time[0]
              .$d.getMonth()}/${searchState.value.time[0]
              .$d.getDay()} ${searchState.value.time[0]
              .$d.getHours()}:${searchState.value.time[0]
              .$d.getMinutes()}:${searchState.value.time[0]
              .$d.getSeconds()}`;
          params.startDate = new Date(startTime).getTime();
          let endTime = `${searchState.value.time[1]
              .$d.getFullYear()}/${searchState.value.time[1]
              .$d.getMonth()}/${searchState.value.time[1]
              .$d.getDay()} ${searchState.value.time[1]
              .$d.getHours()}:${searchState.value.time[1]
              .$d.getMinutes()}:${searchState.value.time[1]
              .$d.getSeconds()}`;
          params.endDate = new Date(endTime).getTime();
        }
        logger.debug(tag, "params:", params);

        return params;
      }

      /**
       * @function userList
       * @desc 分页查询用户信息
       */
      const userList = () => {
        logger.redundancy(tag, "exec function userList...");

        userListApi(getSearchParams()).then((res) => {
          logger.info(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              let arr = data.data.data;
              tableState.value.data = [];
              if(arr.length > 0) {
                for(let i = 0; i < arr.length; i++) {
                  let item = {
                    id: arr[i].ID,
                    key: i,
                    name: arr[i].username,
                    nickName: arr[i].nickName,
                    email: arr[i].email,
                    sex: arr[i].sex === 0 ? "女性" : arr[i].sex === 1 ? "男性" : "未知" ,
                    phone: arr[i].phone,
                    loginTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].lastLoginTime),
                    createTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].CreatedAt),
                    updateTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].UpdatedAt),
                    role: arr[i].SysRole.name,
                    status: arr[i].disabled === 0 ? "已启用" : arr[i].sex === 1 ? "已禁用" : "未知",
                    action: ['详情', "编辑", "删除"]
                  };
                  tableState.value.data.push(item);
                }
              }
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
          logger.info(tag, "call userListApi complete!")
        });
      };

      /**
       * @function userDetails
       * @desc 获取用户信息
       * @param id {number} 用户id
       */
      const userDeatils = (id) => {
        logger.redundancy(tag, "exec function userDetails...");
        logger.debug(tag, "id:", id);

        let params = {id: id};

        userDetailsApi(params).then((res) => {
          logger.info(tag, "res:", res);
          if(res.status === 200) {
            let data = res.data;
            if(data.code === 200) {
              formState.value.sex = data.data.sex;
              formState.value.name = data.data.username;
              formState.value.email = data.data.email;
              formState.value.role = data.data.roleId;
              formState.value.status = data.data.disabled;
              formState.value.password = data.data.password;
              formState.value.nickName = data.data.nickName;
              formState.value.phone = data.data.phone;
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
          logger.info(tag, "call userDeatils function complete!")
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
            id: formState.value.id,
            roleId: data.role,
            username: data.name,
            password: data.password,
            nickName: data.nickName,
            sex: data.sex,
            phone: data.phone,
            email: data.email,
            disabled: data.status
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

      /**
       * @function userDel
       * @desc 删除用户信息
       * @param id {number} 用户id
       */
      const userDel = (id) => {
        logger.redundancy(tag, "exec function userDel...");

        let params = {id: id};

        userDelApi(params).then((res) => {
          logger.info(tag, "res:", res);
          if(res.status === 200) {
            let data = res.data;
            if(data.code === 200) {
              openSuccessNotification("删除用户成功！");
              userList();
            }else {
              openFailedNotification(data.message);
              logger.error(tag, data.message);
            }
          }else {
            openFailedNotification(strings.undefined_error);
            logger.error(tag, strings.undefined_error);
          }
        }).catch((err) => {
          openFailedNotification(strings.undefined_error);
          logger.error(tag, "err: ", err);
        }).finally(() => {
          logger.info(tag, "call userDelApi complete!")
        })
      };

      return {
        searchState,
        sexOptions,
        statusOptions,
        roleOptions,
        formState,
        tableState,
        drawerState,
        locale,
        onClickOfAdd,
        onClickOfAddSave,
        onClickOfDetails,
        onClickOfEdit,
        onClickOfEditSave,
        onClickOfDel,
        afterVisibleChangeOfAdd,
        afterVisibleChangeOfDetails,
        afterVisibleChangeOfEdit,
        onClickOfSearch,
        onClickOfEmpty
      }
    }
  });
</script>

<style scoped>
  .page-search-card-div {
    display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; padding: 10px 10px;
    width: 100%; margin-top: 10px;background: #ffffff;
  }
  .page-search-card-row-div {
    display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap;
  }
  .page-search-card-btn-div {
    display: flex; flex-direction: row; justify-content: flex-end; align-items: center;width: 100%;
  }
  .page-search-card-item {
    width: 180px;
  }

</style>