<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>后台</a-breadcrumb-item>
        <a-breadcrumb-item>环境管理</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面查阅到环境相关的信息！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button type="primary" @click="openAddDrawer">添加环境</a-button>
    </div>
  </div>
  <!-- 搜索 -->
  <div class="page-search-card-div">
    <a-input-search
        v-model:value="searchState.envName"
        placeholder="请输入环境名称"
        enter-button="搜索"
        size="default"
        @search="onSearchByName"
        class="search-item-search"/>
  </div>
  <!-- 表格 -->
  <div class="page-table-card-div">
    <a-table :columns="tableColumns" :dataSource="tableData" style="width: 100%;">
      <template #bodyCell="{column, record}">
        <template v-if="column.key === 'action'" v-for="item in record.action">
          <a class="margin-right-10" v-if="item === '详情'" @click="openDetailsDrawer(record.id)">{{item}}</a>
          <a class="margin-right-10" v-else-if="item === '编辑'" @click="openEditDrawer(record.id)">{{item}}</a>
          <a class="margin-right-10" v-else-if="item === '删除'" @click="onClickOfDelEnv(record.id)">{{item}}</a>
        </template>
      </template>
    </a-table>
  </div>
  <!-- 添加环境抽屉 -->
  <a-drawer v-model:visible="drawerState.visibleOfAdd"
            title="添加环境"
            placement="right"
            @after-visible-change="afterVisibleChangeOfAdd"
            size="default">
    <template #extra>
      <a-button type="primary" @click="onClickOfAddEnv">保存</a-button>
    </template>
    <a-form :model="envFormState"
            name="envForm"
            ref="add"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            autocomplete="off"
            @finish="onEnvFormFinish"
            @finishFailed="onEnvFormFinishFailed">
      <a-form-item
          label="环境名称"
          name="name"
          :rules="[{ required: true, message: '请输入1-10个长度的环境名称！' }]">
        <a-input placeholder="请输入1-10个长度的环境名称" v-model:value="envFormState.name"></a-input>
      </a-form-item>
      <a-form-item
          label="环境描述"
          name="desc"
          :rules="[{ required: true, message: '请输入1-100个长度的环境描述！' }]">
        <a-textarea
            v-model:value="envFormState.desc"
            placeholder="请填写环境描述(最多100个字)"
            :auto-size="{ minRows: 2, maxRows: 5 }"/>
      </a-form-item>
      <a-form-item
          label="CRM地址"
          name="crmAddress">
        <a-input placeholder="请输入CRM地址" v-model:value="envFormState.crmAddress"></a-input>
      </a-form-item>
      <a-form-item
          label="H5地址"
          name="h5Address">
        <a-input placeholder="请输入CRM地址" v-model:value="envFormState.h5Address"></a-input>
      </a-form-item>
    </a-form>
  </a-drawer>
  <!-- 编辑环境抽屉 -->
  <a-drawer v-model:visible="drawerState.visibleOfEdit"
            title="编辑环境"
            placement="right"
            @after-visible-change="afterVisibleChangeOfEdit"
            size="default">
    <template #extra>
      <a-button type="primary" @click="onClickOfEditEnv">保存</a-button>
    </template>
    <a-form :model="envFormState"
            name="envForm"
            ref="edit"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            autocomplete="off"
            @finish="onEnvFormFinish"
            @finishFailed="onEnvFormFinishFailed">
      <a-form-item
          label="环境名称"
          name="name"
          :rules="[{ required: true, message: '请输入1-10个长度的环境名称！' }]">
        <a-input placeholder="请输入1-10个长度的环境名称" v-model:value="envFormState.name"></a-input>
      </a-form-item>
      <a-form-item
          label="环境描述"
          name="desc"
          :rules="[{ required: true, message: '请输入1-100个长度的环境描述！' }]">
        <a-textarea
            v-model:value="envFormState.desc"
            placeholder="请填写环境描述(最多100个字)"
            :auto-size="{ minRows: 2, maxRows: 5 }"/>
      </a-form-item>
      <a-form-item
          label="CRM地址"
          name="crmAddress">
        <a-input placeholder="请输入CRM地址" v-model:value="envFormState.crmAddress"></a-input>
      </a-form-item>
      <a-form-item
          label="H5地址"
          name="h5Address">
        <a-input placeholder="请输入CRM地址" v-model:value="envFormState.h5Address"></a-input>
      </a-form-item>
    </a-form>
  </a-drawer>
  <!-- 环境详情抽屉 -->
  <a-drawer v-model:visible="drawerState.visibleOfDetails"
            title="环境详情"
            placement="right"
            @after-visible-change="afterVisibleChangeOfDetails"
            size="default">
    <a-form :model="envFormState"
            name="envForm"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            autocomplete="off"
            @finish="onEnvFormFinish"
            @finishFailed="onEnvFormFinishFailed">
      <a-form-item
          label="环境名称"
          name="name"
          :rules="[{ required: true, message: '请输入1-10个长度的环境名称！' }]">
        <a-input disabled="true" placeholder="请输入1-10个长度的环境名称" v-model:value="envFormState.name"></a-input>
      </a-form-item>
      <a-form-item
          label="环境描述"
          name="desc"
          :rules="[{ required: true, message: '请输入1-100个长度的环境描述！' }]">
        <a-textarea
            disabled="true"
            v-model:value="envFormState.desc"
            placeholder="请填写环境描述(最多100个字)"
            :auto-size="{ minRows: 2, maxRows: 5 }"/>
      </a-form-item>
      <a-form-item
          label="CRM地址"
          name="crmAddress">
        <a-input disabled="true" placeholder="请输入CRM地址" v-model:value="envFormState.crmAddress"></a-input>
      </a-form-item>
      <a-form-item
          label="H5地址"
          name="h5Address">
        <a-input disabled="true" placeholder="请输入CRM地址" v-model:value="envFormState.h5Address"></a-input>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";

import logger from "../../utils/logger";
import {
  envAddApi, envDelApi,
  envDetailsApi,
  envEditApi,
  envListApi, proDelApi,
  proDetailsApi,
  proEditApi,
  proListApi
} from "../../api/goautapi";
import {openFailedNotification, openSuccessNotification} from "../../components/notification";
import strings from "../../assets/strings";
import timeUtils from "../../utils/timeUtils";

const tag = "/index/adm/EnvAdm";

export default defineComponent({
  name: "EnvAdm",
  setup() {
    const instance = getCurrentInstance();

    // state: 搜索数据
    const searchState = ref({
      envName: ""
    });

    // state: 表格数据
    const tableData = ref([]);
    const tableColumns = ref([
      {title: '环境名称', dataIndex: 'name', key: 'name'},
      {title: '环境描述', dataIndex: 'desc', key: 'desc'},
      {title: '创建时间', key: 'createTime', dataIndex: 'createTime'},
      {title: '更新时间', key: 'updateTime', dataIndex: 'updateTime'},
      {title: "操作", key: "action", dataIndex: "action"}
    ]);

    // state: 抽屉数据
    const drawerState = ref({
      visibleOfAdd: false,
      visibleOfEdit: false,
      visibleOfDetails: false
    });

    // state: 环境表单数据
    const envFormState = ref({
      id: 0,
      name: "",
      desc: "",
      crmAddress: "",
      h5Address: ""
    });

    /**
     * @function onSearchByName
     * @desc 根据环境名称搜索事件
     * @param value {str} 环境名称
     */
    const onSearchByName = (value) => {
      envList(getQueryParams());
    };

    /**
     * @function onClickOfAction
     * @desc 操作点击事件
     * @param event str 点击事件 [添加环境 | 编辑 | 详情]
     */
    const onClickOfAction = (event) => {
      console.log("event: ", event);
      switch (event) {
        case "添加环境":
          drawerState.value.visibleOfAdd = true;
          break;
        case "编辑":
          drawerState.value.visibleOfEdit = true;
          break;
        case "详情":
          drawerState.value.visibleOfDetails = true;
          break;
        default:
          break;
      }
    };

    /**
     * @function afterVisibleChangeOfAdd
     * @desc 添加环境抽屉显示/隐藏的回调函数
     * @param bool boolean
     */
    const afterVisibleChangeOfAdd = (bool) => {
      console.log('visibleOfAdd', bool);
    };

    /**
     * @function afterVisibleChangeOfEdit
     * @desc 编辑环境抽屉显示/隐藏的回调函数
     * @param bool boolean
     */
    const afterVisibleChangeOfEdit = (bool) => {
      console.log('visibleOfEdit', bool);
    };

    /**
     * @function afterVisibleChangeOfDetails
     * @desc 环境详情抽屉显示/隐藏的回调函数
     * @param bool boolean
     */
    const afterVisibleChangeOfDetails = (bool) => {
      console.log('visibleOfDetails', bool);
    };

    /**
     * @function onEnvFormFinish
     * @desc 环境表单提交完成的回调函数
     * @param values
     */
    const onEnvFormFinish = values => {
      console.log('Success:', values);
    };

    /**
     * @function onEnvFormFinishFailed
     * @desc 环境表单提交失败的回调函数
     * @param errorInfo
     */
    const onEnvFormFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };

    onMounted(() => {
      envList(getQueryParams());
    });

    /**
     * @function getQueryParams
     * @desc 获取查询参数
     * @return {{type: UnwrapRef<*[]>, status: UnwrapRef<*[]>}}
     */
    const getQueryParams = () => {
      logger.redundancy(tag, "exec function getQueryParams...");

      let params = {
        pageNum: 1,
        pageSize: 10
      };
      if(!(searchState.value.envName === "")) {
        params.name = searchState.value.envName;
      }

      return params;
    }

    /**
     * @function envList
     * @desc 分页查询环境信息
     * @param params {object} 请求参数
     */
    const envList = (params) => {
      logger.redundancy(tag, "exec function envList...");

      envListApi(params).then((res) => {
        logger.debug(tag, "res:", res);

        if (res.status === 200) {
          let data = res.data;

          if (data.code === 200) {
            let arr = data.data.data;
            if(arr != null && arr.length > 0) {
              tableData.value = [];
              for(let i = 0; i < arr.length; i++) {
                let item = {
                  id: arr[i].ID,
                  key: i,
                  name: arr[i].name,
                  desc: arr[i].description,
                  createTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].CreatedAt),
                  updateTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].UpdatedAt),
                  action: ["编辑", '详情', "删除"]
                };
                tableData.value.push(item);
              }
            }
          }else {
            openFailedNotification(data.msg);
          }
        }else {
          openFailedNotification(strings.undefined_error);
        }
      }).catch((err) => {
        logger.error(tag, "err:", err);
        openFailedNotification(strings.undefined_error);
      }).finally(() => {
        logger.info(tag, "call envListApi complete!")
      });
    };

    /**
     * @function openDetailsDrawer
     * @desc 打开环境详情Drawer
     * @param id {number} 环境id
     */
    const openDetailsDrawer = (id) => {
      logger.redundancy(tag, "exec function openDetailsDrawer...");
      drawerState.value.visibleOfDetails = true;
      let params = {id: id};
      envDeatils(params);
    };

    /**
     * @function envDeatils
     * @desc 获取环境详情
     * @param params {object} 请求参数
     */
    const envDeatils = (params) => {
      logger.redundancy(tag, "exec function envDeatils...");

      envDetailsApi(params).then((res) => {
        logger.debug(tag, "res:", res);

        if(res.status === 200) {
          let data = res.data;

          if(data.code === 200) {
            envFormState.value.name = data.data.name;
            envFormState.value.desc = data.data.description;
            envFormState.value.crmAddress = data.data.crmPath;
            envFormState.value.crmAddress = data.data.h5Path;
          }else {
            openFailedNotification(data.message);
          }
        }else {
          openFailedNotification(strings.undefined_error);
        }
      }).catch((err) => {
        logger.error(tag, "err:", err);
        openFailedNotification(strings.undefined_error);
      }).finally(() => {
        logger.info(tag, "call envDetailsApi complete!");
      })
    };

    /**
     * @function openAddDrawer
     * @desc 打开添加环境Drawer
     */
    const openAddDrawer = () => {
      logger.redundancy(tag, "exec function openAddDrawer...");
      drawerState.value.visibleOfAdd = true;
    };

    /**
     * @function onClickOfAddEnv
     * @desc 点击添加环境按钮事件
     */
    const onClickOfAddEnv = () => {
      logger.redundancy(tag, "exec function onClickOfAddEnv...");
      envAdd();
    };

    /**
     * @function envAdd
     * @desc 添加环境
     */
    const envAdd = () => {
      logger.redundancy(tag, "exec function envAdd...");

      instance.refs["add"].validateFields().then((data) => {
        logger.debug(tag, "data: ", data);

        let body = {
          name: data.name,
          description: data.desc,
          crmPath: data.crmAddress,
          h5Path: data.h5Address
        }

        envAddApi(body).then((res) => {
          logger.debug(tag, "res:", res);

          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              openSuccessNotification("添加环境成功！");
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
          logger.info(tag, "call envAddApi complete!")
        })
      }).catch((err) => {
        logger.error(tag, "err: ", err);
      }).finally(() => {
        logger.info(tag, "call add validateFields function complete!")
      })
    };

    /**
     * @function openEditDrawer
     * @desc 打开修改环境Drawer
     * @param id {number} 产品id
     */
    const openEditDrawer = (id) => {
      logger.redundancy(tag, "exec function openEditDrawer...");
      drawerState.value.visibleOfEdit = true;
      envFormState.value.id = id;
      let params = {id: id};
      envDeatils(params);
    };

    /**
     * @function onClickOfEditEnv
     * @desc 点击修改环境按钮事件
     */
    const onClickOfEditEnv = () => {
      logger.redundancy(tag, "exec function onClickOfEditEnv...");
      envEdit();
    };

    /**
     * @function envEdit
     * @desc 修改产品信息
     */
    const envEdit = () => {
      logger.redundancy(tag, "exec function envEdit...");

      instance.refs["edit"].validateFields().then((data) => {
        logger.debug(tag, "data: ", data);

        let body = {
          id: envFormState.value.id,
          name: data.name,
          description: data.desc,
          crmPath: data.crmAddress,
          h5Path: data.h5Address
        }

        envEditApi(body).then((res) => {
          logger.debug(tag, "res:", res);

          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              openSuccessNotification("修改环境信息成功！");
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
          logger.info(tag, "call envEditApi complete!")
        })
      }).catch((err) => {
        logger.error(tag, "err: ", err);
      }).finally(() => {
        logger.info(tag, "call edit validateFields function complete!")
      })
    };

    /**
     * @function onClickOfDelEnv
     * @desc 点击删除环境按钮事件
     */
    const onClickOfDelEnv = (id) => {
      logger.redundancy(tag, "exec function onClickOfDelEnv...");
      let params = {id: id};
      envDel(params);
    };

    /**
     * @function envDel
     * @desc 删除环境信息
     * @param params {object} 请求参数
     */
    const envDel = (params) => {
      logger.redundancy(tag, "exec function envDel...");

      envDelApi(params).then((res) => {
        logger.debug(tag, "res:", res);

        if (res.status === 200) {
          let data = res.data;
          if (data.code === 200) {
            openSuccessNotification("删除环境信息成功！");
            envList(getQueryParams());
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
        logger.info(tag, "call envDelApi complete!")
      })
    }

    return {
      searchState,
      tableData,
      tableColumns,
      drawerState,
      envFormState,
      onSearchByName,
      onClickOfAction,
      afterVisibleChangeOfAdd,
      afterVisibleChangeOfEdit,
      afterVisibleChangeOfDetails,
      onEnvFormFinish,
      onEnvFormFinishFailed,
      openAddDrawer,
      onClickOfAddEnv,
      openDetailsDrawer,
      openEditDrawer,
      onClickOfEditEnv,
      onClickOfDelEnv
    }
  },
  methods: {}
})
</script>

<style scoped>
  /* 导航 */
  .page-guide-card-div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    width: 100%;
    height: 60px;
    padding: 0 10px;
  }
  .page-guide-card-div-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .page-guide-card-div-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  /* 搜索 */
  .page-search-card-div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    width: 100%;
    padding: 10px 10px;
    margin-top: 10px;
  }
  .search-item-common {
    width: 180px;
  }
  .search-item-search {
    width: 240px;
  }
  /* 表格 */
  .page-table-card-div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    background: #ffffff;
    width: 100%;
    padding: 10px 10px;
    margin-top: 10px;
  }
</style>