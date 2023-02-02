<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>后台</a-breadcrumb-item>
        <a-breadcrumb-item>迭代管理</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面查阅到迭代相关的信息！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button type="primary" @click="openAddDrawer">添加迭代</a-button>
    </div>
  </div>
  <!-- 搜索 -->
  <div class="page-search-card-div">
    <div>
      <span>所属产品：</span>
      <a-select v-model:value="searchState.forProduct" class="search-item-common"
                placeholder="请选择所属产品" :options="proOptions"></a-select>
    </div>
    <a-input-search
        v-model:value="searchState.iteraName"
        placeholder="请输入迭代名称"
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
          <a class="margin-right-10" v-else-if="item === '删除'" @click="onClickOfDelItera(record.id)">{{item}}</a>
        </template>
      </template>
    </a-table>
  </div>
  <!-- 添加迭代抽屉 -->
  <a-drawer v-model:visible="drawerState.visibleOfAdd"
            title="添加迭代"
            placement="right"
            @after-visible-change="afterVisibleChangeOfAdd"
            size="default">
    <template #extra>
      <a-button type="primary" @click="onClickOfAddItera">保存</a-button>
    </template>
    <a-form :model="iterationFormState"
            name="envForm"
            ref="add"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            autocomplete="off"
            @finish="onIterationFormFinish"
            @finishFailed="onIterationFormFinishFailed">
      <a-form-item
          label="迭代名称"
          name="name"
          :rules="[{ required: true, message: '请输入1-10个长度的迭代名称！' }]">
        <a-input placeholder="请输入1-10个长度的迭代名称" v-model:value="iterationFormState.name"></a-input>
      </a-form-item>
      <a-form-item
          label="迭代描述"
          name="desc"
          :rules="[{ required: true, message: '请输入1-100个长度的迭代描述！' }]">
        <a-textarea
            v-model:value="iterationFormState.desc"
            placeholder="请填写迭代描述(最多100个字)"
            :auto-size="{ minRows: 2, maxRows: 5 }"/>
      </a-form-item>
      <a-form-item
          label="所属产品"
          name="forProduct"
          :rules="[{ required: true, message: '请选择所属产品！' }]">
        <a-select v-model:value="iterationFormState.forProduct" placeholder="请选择所属产品" :options="proOptions"></a-select>
      </a-form-item>
    </a-form>
  </a-drawer>
  <!-- 编辑迭代抽屉 -->
  <a-drawer v-model:visible="drawerState.visibleOfEdit"
            title="编辑迭代"
            placement="right"
            @after-visible-change="afterVisibleChangeOfEdit"
            size="default">
    <template #extra>
      <a-button type="primary" @click="onClickOfEditItera">保存</a-button>
    </template>
    <a-form :model="iterationFormState"
            name="envForm"
            ref="edit"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            autocomplete="off"
            @finish="onIterationFormFinish"
            @finishFailed="onIterationFormFinishFailed">
      <a-form-item
          label="迭代名称"
          name="name"
          :rules="[{ required: true, message: '请输入1-10个长度的迭代名称！' }]">
        <a-input placeholder="请输入1-10个长度的迭代名称" v-model:value="iterationFormState.name"></a-input>
      </a-form-item>
      <a-form-item
          label="迭代描述"
          name="desc"
          :rules="[{ required: true, message: '请输入1-100个长度的迭代描述！' }]">
        <a-textarea
            v-model:value="iterationFormState.desc"
            placeholder="请填写迭代描述(最多100个字)"
            :auto-size="{ minRows: 2, maxRows: 5 }"/>
      </a-form-item>
      <a-form-item
          label="所属产品"
          name="forProduct"
          :rules="[{ required: true, message: '请选择所属产品！' }]">
        <a-select v-model:value="iterationFormState.forProduct" placeholder="请选择所属产品" :options="proOptions"></a-select>
      </a-form-item>
    </a-form>
  </a-drawer>
  <!-- 迭代详情抽屉 -->
  <a-drawer v-model:visible="drawerState.visibleOfDetails"
            title="迭代详情"
            placement="right"
            @after-visible-change="afterVisibleChangeOfDetails"
            size="default">
    <a-form :model="iterationFormState"
            name="envForm"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            autocomplete="off"
            @finish="onIterationFormFinish"
            @finishFailed="onIterationFormFinishFailed">
      <a-form-item
          label="迭代名称"
          name="name"
          :rules="[{ required: true, message: '请输入1-10个长度的迭代名称！' }]">
        <a-input disabled="true" placeholder="请输入1-10个长度的迭代名称" v-model:value="iterationFormState.name"></a-input>
      </a-form-item>
      <a-form-item
          label="迭代描述"
          name="desc"
          :rules="[{ required: true, message: '请输入1-100个长度的迭代描述！' }]">
        <a-textarea
            disabled="true"
            v-model:value="iterationFormState.desc"
            placeholder="请填写迭代描述(最多100个字)"
            :auto-size="{ minRows: 2, maxRows: 5 }"/>
      </a-form-item>
      <a-form-item
          label="所属产品"
          name="forProduct"
          :rules="[{ required: true, message: '请选择所属产品！' }]">
        <a-select disabled="true" v-model:value="iterationFormState.forProduct" placeholder="请选择所属产品" :options="proOptions"></a-select>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";

import logger from "../../utils/logger";
import {
  iteraAddApi, iteraDelApi,
  iteraDetailsApi, iteraEditApi,
  iteraListApi,
  proBoxApi
} from "../../api/goautapi";
import {openFailedNotification, openSuccessNotification} from "../../components/notification";
import strings from "../../assets/strings";
import timeUtils from "../../utils/timeUtils";

const tag = "/index/adm/IterationAdm";

  export default defineComponent({
    name: "IterationAdm",
    setup() {
      const instance = getCurrentInstance();

      // options: 产品列表
      const proOptions = ref([]);

      // state: 搜索数据
      const searchState = ref({
        forProduct: [],
        iteraName: ""
      });

      // state: 表格数据
      const tableData = ref([]);
      const tableColumns = ref([
        {title: '迭代名称', dataIndex: 'name', key: 'name'},
        {title: '迭代描述', dataIndex: 'desc', key: 'desc'},
        {title: '创建时间', key: 'createTime', dataIndex: 'createTime'},
        {title: '更新时间', key: 'updateTime', dataIndex: 'updateTime'},
        {title: '所属产品', key: 'forProduct', dataIndex: 'forProduct'},
        {title: '操作', key: 'action', dataIndex: 'action'}
      ]);

      // state: 抽屉数据
      const drawerState = ref({
        visibleOfAdd: false,
        visibleOfEdit: false,
        visibleOfDetails: false
      });

      // state: 迭代表单数据
      const iterationFormState = ref({
        id: 0,
        name: "",
        desc: "",
        forProduct: [],
      });

      /**
       * @function onSearchByName
       * @desc 根据产品名称搜索事件
       * @param value str 产品名称
       */
      const onSearchByName = (value) => {
        logger.redundancy(tag, "exec function onSearchByName...");

        iteraList(getQueryParams());
      };

      /**
       * @function onClickOfAction
       * @desc 操作点击事件
       * @param event str 点击事件 [添加迭代 | 编辑 | 详情]
       */
      const onClickOfAction = (event) => {
        console.log("event: ", event);
        switch (event) {
          case "添加迭代":
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
       * @desc 添加迭代抽屉显示/隐藏的回调函数
       * @param bool boolean
       */
      const afterVisibleChangeOfAdd = (bool) => {
        console.log('visibleOfAdd', bool);
      };

      /**
       * @function afterVisibleChangeOfEdit
       * @desc 编辑迭代抽屉显示/隐藏的回调函数
       * @param bool boolean
       */
      const afterVisibleChangeOfEdit = (bool) => {
        console.log('visibleOfEdit', bool);
      };

      /**
       * @function afterVisibleChangeOfDetails
       * @desc 迭代详情抽屉显示/隐藏的回调函数
       * @param bool boolean
       */
      const afterVisibleChangeOfDetails = (bool) => {
        console.log('visibleOfDetails', bool);
      };

      /**
       * @function onIterationFormFinish
       * @desc 迭代表单提交完成的回调函数
       * @param values
       */
      const onIterationFormFinish = values => {
        console.log('Success:', values);
      };

      /**
       * @function onIterationFormFinishFailed
       * @desc 迭代表单提交失败的回调函数
       * @param errorInfo
       */
      const onIterationFormFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

      onMounted(() => {
        proBox();
        iteraList(getQueryParams);
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
        if(!(searchState.value.iteraName === "")) {
          params.name = searchState.value.iteraName;
        }
        if(!(searchState.value.forProduct instanceof Array)) {
          params.productId = searchState.value.forProduct;
        }

        return params;
      }

      /**
       * @function iteraList
       * @desc 分页查询迭代信息
       * @param params {object} 请求参数
       */
      const iteraList = (params) => {
        logger.redundancy(tag, "exec function iteraList...");

        iteraListApi(params).then((res) => {
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
                    forProduct: arr[i].Product.name,
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
       * @function openAddDrawer
       * @desc 打开添加迭代Drawer
       */
      const openAddDrawer = () => {
        logger.redundancy(tag, "exec function openAddDrawer...");
        drawerState.value.visibleOfAdd = true;
      };

      /**
       * @function onClickOfAddItera
       * @desc 点击添加迭代按钮事件
       */
      const onClickOfAddItera = () => {
        logger.redundancy(tag, "exec function onClickOfAddItera...");
        iteraAdd();
      };

      /**
       * @function iteraAdd
       * @desc 添加迭代信息
       */
      const iteraAdd = () => {
        logger.redundancy(tag, "exec function iteraAdd...");

        instance.refs["add"].validateFields().then((data) => {
          logger.debug(tag, "data: ", data);

          let body = {
            name: data.name,
            description: data.desc,
            productId: data.forProduct,
          }

          iteraAddApi(body).then((res) => {
            logger.debug(tag, "res:", res);

            if (res.status === 200) {
              let data = res.data;
              if (data.code === 200) {
                openSuccessNotification("添加迭代信息成功！");
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
            logger.info(tag, "call iteraAddApi complete!")
          })
        }).catch((err) => {
          logger.error(tag, "err: ", err);
        }).finally(() => {
          logger.info(tag, "call add validateFields function complete!")
        })
      };

      /**
       * @function proBox
       * @desc 获取产品列表
       * @param params {object} 请求参数
       */
      const proBox = () => {
        logger.redundancy(tag, "exec function proBox...");

        proBoxApi().then((res) => {
          logger.info(tag, "res:", res);

          if (res.status === 200) {
            let data = res.data;

            if (data.code === 200) {
              let arr = data.data;
              for(let i = 0; i < arr.length; i++) {
                let item = {
                  value: arr[i].id,
                  label: arr[i].name
                };
                proOptions.value.push(item);
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
          logger.info(tag, "call proBoxApi complete!");
        })
      };

      /**
       * @function openDetailsDrawer
       * @desc 打开迭代详情Drawer
       * @param id {number} 迭代id
       */
      const openDetailsDrawer = (id) => {
        logger.redundancy(tag, "exec function openDetailsDrawer...");
        drawerState.value.visibleOfDetails = true;
        let params = {id: id};
        iteraDeatils(params);
      };

      /**
       * @function iteraDeatils
       * @desc 获取迭代详情
       * @param params {object} 请求参数
       */
      const iteraDeatils = (params) => {
        logger.redundancy(tag, "exec function iteraDeatils...");

        iteraDetailsApi(params).then((res) => {
          logger.info(tag, "res:", res);

          if(res.status === 200) {
            let data = res.data;

            if(data.code === 200) {
              iterationFormState.value.name = data.data.name;
              iterationFormState.value.desc = data.data.description;
              iterationFormState.value.forProduct = data.data.productId;
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
          logger.info(tag, "call iteraDetailsApi complete!");
        })
      };

      /**
       * @function openEditDrawer
       * @desc 打开修改迭代Drawer
       * @param id {number} 迭代id
       */
      const openEditDrawer = (id) => {
        logger.redundancy(tag, "exec function openEditDrawer...");
        drawerState.value.visibleOfEdit = true;
        iterationFormState.value.id = id;
        let params = {id: id};
        iteraDeatils(params);
      };

      /**
       * @function onClickOfEditItera
       * @desc 点击修改迭代按钮事件
       */
      const onClickOfEditItera = () => {
        logger.redundancy(tag, "exec function onClickOfEditItera...");
        iteraEdit();
      };

      /**
       * @function iteraEdit
       * @desc 修改迭代信息
       */
      const iteraEdit = () => {
        logger.redundancy(tag, "exec function iteraEdit...");

        instance.refs["edit"].validateFields().then((data) => {
          logger.debug(tag, "data: ", data);

          let body = {
            id: iterationFormState.value.id,
            name: data.name,
            description: data.desc,
            productId: data.forProduct
          }

          iteraEditApi(body).then((res) => {
            logger.debug(tag, "res:", res);

            if (res.status === 200) {
              let data = res.data;
              if (data.code === 200) {
                openSuccessNotification("修改迭代信息成功！");
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
            logger.info(tag, "call iteraEditApi complete!")
          })
        }).catch((err) => {
          logger.error(tag, "err: ", err);
        }).finally(() => {
          logger.info(tag, "call edit validateFields function complete!")
        })
      };

      /**
       * @function onClickOfDelItera
       * @desc 点击删除迭代按钮事件
       */
      const onClickOfDelItera = (id) => {
        logger.redundancy(tag, "exec function onClickOfDelItera...");
        let params = {id: id};
        iteraDel(params);
      };

      /**
       * @function iteraDel
       * @desc 删除迭代信息
       * @param params {object} 请求参数
       */
      const iteraDel = (params) => {
        logger.redundancy(tag, "exec function iteraDel...");

        iteraDelApi(params).then((res) => {
          logger.debug(tag, "res:", res);

          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              openSuccessNotification("删除迭代信息成功！");
              iteraList(getQueryParams());
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
          logger.info(tag, "call iteraDelApi complete!")
        })
      }

      return {
        proOptions,
        searchState,
        tableData,
        tableColumns,
        drawerState,
        iterationFormState,
        onSearchByName,
        onClickOfAction,
        afterVisibleChangeOfAdd,
        afterVisibleChangeOfEdit,
        afterVisibleChangeOfDetails,
        onIterationFormFinish,
        onIterationFormFinishFailed,
        openAddDrawer,
        onClickOfAddItera,
        openDetailsDrawer,
        openEditDrawer,
        onClickOfEditItera,
        onClickOfDelItera
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