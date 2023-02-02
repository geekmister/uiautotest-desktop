<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>后台</a-breadcrumb-item>
        <a-breadcrumb-item>业务分组</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面对业务分组进行添加、编辑、查阅、删除相关操作！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button type="primary" @click="onClickOfAdd()">添加分组</a-button>
    </div>
  </div>
  <!-- 搜索 -->
  <div class="page-search-card-div">
    <a-input-search
        v-model:value="searchState.groupName" placeholder="请输入分组名称" enter-button="搜索" size="default"
        @search="onSearchByName" class="search-item-search"/>
  </div>
  <!-- 表格 -->
  <div class="page-table-card-div">
    <a-table :columns="tableState.columns" :dataSource="tableState.data" style="width: 100%;">
      <template #bodyCell="{column, record}">
        <template v-if="column.key === 'action'" v-for="item in record.action">
          <a class="margin-right-10" v-if="item === '详情'" @click="onClickOfDetails(record.id)">{{item}}</a>
          <a class="margin-right-10" v-else-if="item === '编辑'" @click="onClickOfEdit(record.id)">{{item}}</a>
          <a class="margin-right-10" v-else-if="item === '删除'" @click="onClickOfDel(record.id)">{{item}}</a>
        </template>
      </template>
    </a-table>
  </div>
  <!-- 添加分组抽屉 -->
  <a-drawer v-model:visible="drawerState.visibleOfAdd" title="添加分组" placement="right"
            @after-visible-change="afterVisibleChangeOfAdd" size="default">
    <template #extra>
      <a-button type="primary" @click="onClickOfAddSave">保存</a-button>
    </template>
    <a-form ref="add" :model="formState" name="groupForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
            autocomplete="off">
      <a-form-item label="分组名称" name="name" :rules="[{ required: true, message: '请输入1-10个长度的分组名称！' }]">
        <a-input placeholder="请输入1-10个长度的分组名称" v-model:value="formState.name"></a-input>
      </a-form-item>
      <a-form-item label="分组描述" name="description" :rules="[{ required: true, message: '请输入1-100个长度的分组描述！' }]">
        <a-textarea
            v-model:value="formState.description" placeholder="请填写分组描述(最多100个字)"
            :auto-size="{ minRows: 2, maxRows: 5 }"/>
      </a-form-item>
    </a-form>
  </a-drawer>
  <!-- 编辑分组抽屉 -->
  <a-drawer v-model:visible="drawerState.visibleOfEdit" title="编辑分组" placement="right"
            @after-visible-change="afterVisibleChangeOfEdit" size="default">
    <template #extra>
      <a-button type="primary" @click="onClickOfEditSave">保存</a-button>
    </template>
    <a-form ref="edit" :model="formState" name="groupForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
            autocomplete="off">
      <a-form-item
          label="分组名称" name="name" :rules="[{ required: true, message: '请输入1-10个长度的分组名称！' }]">
        <a-input placeholder="请输入1-10个长度的分组名称" v-model:value="formState.name"></a-input>
      </a-form-item>
      <a-form-item
          label="分组描述" name="description" :rules="[{ required: true, message: '请输入1-100个长度的分组描述！' }]">
        <a-textarea
            v-model:value="formState.description" placeholder="请填写分组描述(最多100个字)" :auto-size="{ minRows: 2, maxRows: 5 }"/>
      </a-form-item>
    </a-form>
  </a-drawer>
  <!-- 分组详情抽屉 -->
  <a-drawer v-model:visible="drawerState.visibleOfDetails" title="分组详情" placement="right"
            @after-visible-change="afterVisibleChangeOfDetails" size="default">
    <a-form :model="formState" name="groupForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
            autocomplete="off">
      <a-form-item label="分组名称" name="name" :rules="[{ required: true, message: '请输入1-10个长度的分组名称！' }]">
        <a-input disabled="true" placeholder="请输入1-10个长度的分组名称" v-model:value="formState.name"></a-input>
      </a-form-item>
      <a-form-item
          label="分组描述" name="description" :rules="[{ required: true, message: '请输入1-100个长度的分组描述！' }]">
        <a-textarea
            disabled="true" v-model:value="formState.description" placeholder="请填写分组描述(最多100个字)"
            :auto-size="{ minRows: 2, maxRows: 5 }"/>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
  import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";

  import logger from "../../utils/logger";
  import {
    envDelApi,
    groupAddApi, groupDelApi,
    groupDetailsApi,
    groupEditApi,
    groupListApi
  } from "../../api/goautapi";
  import {openFailedNotification, openSuccessNotification} from "../../components/notification";
  import strings from "../../assets/strings";
  import timeUtils from "../../utils/timeUtils";

  const tag = "/index/admin/GroupAdm";

  export default defineComponent({
    name: "GroupAdm",
    setup() {
      const instance = getCurrentInstance();

      /** 生命周期函数 */
      onMounted(() => {
        groupList(getQueryParams());
      });

      /** state等相关数据 */
      // state: 搜索数据
      const searchState = ref({
        groupName: ""
      });

      // state: 表格数据
      const tableState = ref({
        columns: [
          {title: '分组名称', dataIndex: 'name', key: 'name'},
          {title: '分组描述', dataIndex: 'description', key: 'description'},
          {title: '创建时间', key: 'createTime', dataIndex: 'createTime'},
          {title: '更新时间', key: 'updateTime', dataIndex: 'updateTime'},
          {title: "操作", key: "action", dataIndex: "action"}
        ],
        data: []
      });

      // state: 抽屉数据
      const drawerState = ref({
        visibleOfAdd: false,
        visibleOfEdit: false,
        visibleOfDetails: false
      });

      // state: 表单数据
      const formState = ref({
        id: 0,
        name: "",
        description: ""
      });

      /** 人机交互事件 */

      /**
       * @function onClickOfAdd
       * @desc 添加分组按钮点击事件
       */
      const onClickOfAdd = () => {
        logger.redundancy(tag, "exec function onClickOfAdd...");
        drawerState.value.visibleOfAdd = true;
      }

      /**
       * @function onClickOfAddSave
       * @desc 添加分组保存按钮点击事件
       */
      const onClickOfAddSave = () => {
        logger.redundancy(tag, "exec function onClickOfAddSave...");
        groupAdd();
      }

      /**
       * @function onClickOfDetails
       * @desc 详情按钮点击事件
       * @param id {number} 分组id
       */
      const onClickOfDetails = (id) => {
        logger.redundancy(tag, "exec function onClickOfDetails...");
        drawerState.value.visibleOfDetails = true;
        let params = {id: id};
        groupDeatils(params);
      };

      /**
       * @function onClickOfEdit
       * @desc 编辑按钮点击事件
       * @param id {number} 分组id
       */
      const onClickOfEdit = (id) => {
        logger.redundancy(tag, "exec function onClickOfEdit...");
        drawerState.value.visibleOfEdit = true;
        formState.value.id = id;
        let params = {id: id};
        groupDeatils(params);
      };

      /**
       * @function onClickOfEditSave
       * @desc 编辑保存按钮点击事件
       */
      const onClickOfEditSave = () => {
        logger.redundancy(tag, "exec function onClickOfEditSave...");
        groupEdit();
      };

      /**
       * @function onClickOfDel
       * @desc 删除按钮点击事件
       */
      const onClickOfDel = (id) => {
        logger.redundancy(tag, "exec function onClickOfDel...");
        let params = {id: id};
        groupDel(params);
      };

      /**
       * @function onSearchByName
       * @desc 根据环境名称搜索事件
       * @param value str 环境名称
       */
      const onSearchByName = (value) => {
        groupList(getQueryParams());
      };

      /**
       * @function afterVisibleChangeOfAdd
       * @desc 添加分组抽屉显示/隐藏的回调函数
       * @param bool boolean
       */
      const afterVisibleChangeOfAdd = (bool) => {
        console.log('visibleOfAdd', bool);
      };

      /**
       * @function afterVisibleChangeOfEdit
       * @desc 编辑分组抽屉显示/隐藏的回调函数
       * @param bool boolean
       */
      const afterVisibleChangeOfEdit = (bool) => {
        console.log('visibleOfEdit', bool);
      };

      /**
       * @function afterVisibleChangeOfDetails
       * @desc 分组详情抽屉显示/隐藏的回调函数
       * @param bool boolean
       */
      const afterVisibleChangeOfDetails = (bool) => {
        console.log('visibleOfDetails', bool);
      };

      /** 接口对接函数 */

      /**
       * @function envGroup
       * @desc 添加分组
       */
      const groupAdd = () => {
        logger.redundancy(tag, "exec function groupAdd...");

        instance.refs["add"].validateFields().then((data) => {
          logger.debug(tag, "data: ", data);

          let body = {
            name: data.name,
            description: data.description,
          }

          groupAddApi(body).then((res) => {
            logger.debug(tag, "res:", res);
            if (res.status === 200) {
              let data = res.data;
              if (data.code === 200) {
                openSuccessNotification("添加分组成功！");
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
            logger.info(tag, "call groupAddApi complete!")
          })
        }).catch((err) => {
          logger.error(tag, "err: ", err);
        }).finally(() => {
          logger.info(tag, "call add validateFields function complete!")
        })
      };

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
        if(!(searchState.value.groupName === "")) {
          params.name = searchState.value.groupName;
        }

        return params;
      }

      /**
       * @function groupList
       * @desc 分页查询分组信息
       * @param params {object} 请求参数
       */
      const groupList = (params) => {
        logger.redundancy(tag, "exec function groupList...");

        groupListApi(params).then((res) => {
          logger.debug(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              let arr = data.data.data;
              if(arr != null && arr.length > 0) {
                tableState.value.data = [];
                for(let i = 0; i < arr.length; i++) {
                  let item = {
                    id: arr[i].ID,
                    key: i,
                    name: arr[i].name,
                    description: arr[i].description,
                    createTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].CreatedAt),
                    updateTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].UpdatedAt),
                    action: ["编辑", '详情', "删除"]
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
          logger.error(tag, "err:", err);
          openFailedNotification(strings.undefined_error);
        }).finally(() => {
          logger.info(tag, "call envListApi complete!")
        });
      };

      /**
       * @function groupDeatils
       * @desc 获取分组详情
       * @param params {object} 请求参数
       */
      const groupDeatils = (params) => {
        logger.redundancy(tag, "exec function groupDeatils...");

        groupDetailsApi(params).then((res) => {
          logger.debug(tag, "res:", res);

          if(res.status === 200) {
            let data = res.data;
            if(data.code === 200) {
              formState.value.name = data.data.name;
              formState.value.description = data.data.description;
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
          logger.info(tag, "call groupDetailsApi complete!");
        })
      };

      /**
       * @function groupEdit
       * @desc 编辑分组信息
       */
      const groupEdit = () => {
        logger.redundancy(tag, "exec function groupEdit...");

        instance.refs["edit"].validateFields().then((data) => {
          logger.debug(tag, "data: ", data);

          let body = {
            id: formState.value.id,
            name: data.name,
            description: data.description,
          }

          groupEditApi(body).then((res) => {
            logger.debug(tag, "res:", res);
            if (res.status === 200) {
              let data = res.data;
              if (data.code === 200) {
                openSuccessNotification("编辑分组信息成功！");
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
            logger.info(tag, "call groupEditApi complete!")
          })
        }).catch((err) => {
          logger.error(tag, "err: ", err);
        }).finally(() => {
          logger.info(tag, "call edit validateFields function complete!")
        })
      };

      /**
       * @function groupDel
       * @desc 删除分组信息
       * @param params {object} 请求参数
       */
      const groupDel = (params) => {
        logger.redundancy(tag, "exec function groupDel...");

        groupDelApi(params).then((res) => {
          logger.debug(tag, "res:", res);

          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              openSuccessNotification("删除分组信息成功！");
              groupList(getQueryParams());
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
          logger.info(tag, "call groupDelApi complete!")
        })
      }

      return {
        searchState,
        tableState,
        drawerState,
        formState,
        onSearchByName,
        afterVisibleChangeOfAdd,
        afterVisibleChangeOfEdit,
        afterVisibleChangeOfDetails,
        onClickOfAdd,
        onClickOfAddSave,
        onClickOfDetails,
        onClickOfEdit,
        onClickOfEditSave,
        onClickOfDel
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