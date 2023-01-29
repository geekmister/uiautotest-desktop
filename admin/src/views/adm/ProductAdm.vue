<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>后台</a-breadcrumb-item>
        <a-breadcrumb-item>产品管理</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面添加产品、查阅产品、编辑产品等相关操作！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button type="primary" @click="openAddDrawer">添加产品</a-button>
    </div>
  </div>
  <!-- 搜索 -->
  <div class="page-search-card-div">
    <div class="page-search-card-condition-div">
      <a-input-search
          v-model:value="searchState.productName"
          placeholder="请输入产品名称"
          enter-button="搜索"
          size="default"
          @search="onSearchByName"
          class="search-item-search"/>
    </div>
  </div>
  <!-- 表格 -->
  <div class="page-table-card-div">
    <a-table :columns="tableColumns" :dataSource="tableData" style="width: 100%;">
      <template #bodyCell="{column, record}">
        <template v-if="column.key === 'action'" v-for="item in record.action">
          <a class="margin-right-10" v-if="item === '详情'" @click="openDetailsDrawer(record.id)">{{item}}</a>
          <a class="margin-right-10" v-else-if="item === '编辑'" @click="openEditDrawer(record.id)">{{item}}</a>
          <a class="margin-right-10" v-else-if="item === '删除'" @click="onClickOfDelPro(record.id)">{{item}}</a>
        </template>
      </template>
    </a-table>
  </div>
  <!-- 添加产品抽屉 -->
  <a-drawer v-model:visible="drawerState.visibleOfAdd"
            title="添加产品"
            placement="right"
            @after-visible-change="afterVisibleChangeOfAdd"
            size="default">
    <template #extra>
      <a-button type="primary" @click="onClickOfAddPro">保存</a-button>
    </template>
    <a-form :model="productFormState"
            ref="add"
            name="productForm"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            autocomplete="off">
      <a-form-item
          label="产品名称"
          name="name"
          :rules="[{ required: true, message: '请输入1-10个长度的产品名称！' }]">
        <a-input placeholder="请输入1-10个长度的产品名称" v-model:value="productFormState.name"></a-input>
      </a-form-item>
      <a-form-item
          label="产品描述"
          name="desc"
          :rules="[{ required: true, message: '请输入1-100个长度的产品描述！' }]">
        <a-textarea
            v-model:value="productFormState.desc"
            placeholder="请填写产品描述(最多100个字)"
            :auto-size="{ minRows: 2, maxRows: 5 }"/>
      </a-form-item>
      <a-form-item
          label="系统类型"
          name="type"
          :rules="[{ required: true, message: '请选择系统类型！' }]">
        <a-select v-model:value="productFormState.type" placeholder="请选择系统类型" :options="platformTypeOptions"></a-select>
      </a-form-item>
    </a-form>
  </a-drawer>
  <!-- 编辑产品抽屉 -->
  <a-drawer v-model:visible="drawerState.visibleOfEdit"
            title="编辑产品"
            placement="right"
            @after-visible-change="afterVisibleChangeOfEdit"
            size="default">
    <template #extra>
      <a-button type="primary" @click="onClickOfEditPro">保存</a-button>
    </template>
    <a-form :model="productFormState"
            ref="edit"
            name="productForm"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            autocomplete="off">
      <a-form-item
          label="产品名称"
          name="name"
          :rules="[{ required: true, message: '请输入1-10个长度的产品名称！' }]">
        <a-input placeholder="请输入1-10个长度的产品名称" v-model:value="productFormState.name"></a-input>
      </a-form-item>
      <a-form-item
          label="产品描述"
          name="desc"
          :rules="[{ required: true, message: '请输入1-100个长度的产品描述！' }]">
        <a-textarea
            v-model:value="productFormState.desc"
            placeholder="请填写产品描述(最多100个字)"
            :auto-size="{ minRows: 2, maxRows: 5 }"/>
      </a-form-item>
      <a-form-item
          label="系统类型"
          name="type"
          :rules="[{ required: true, message: '请选择系统类型！' }]">
        <a-select v-model:value="productFormState.type" placeholder="请选择系统类型" :options="platformTypeOptions"></a-select>
      </a-form-item>
    </a-form>
  </a-drawer>
  <!-- 产品详情抽屉 -->
  <a-drawer v-model:visible="drawerState.visibleOfDetails"
            title="产品详情"
            placement="right"
            @after-visible-change="afterVisibleChangeOfDetails"
            size="default">
    <a-form :model="productFormState"
            name="productForm"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            autocomplete="off">
      <a-form-item
          label="产品名称"
          name="name"
          :rules="[{ required: true, message: '请输入1-10个长度的产品名称！' }]">
        <a-input disabled="true" placeholder="请输入1-10个长度的产品名称" v-model:value="productFormState.name"></a-input>
      </a-form-item>
      <a-form-item
          label="产品描述"
          name="desc"
          :rules="[{ required: true, message: '请输入1-100个长度的产品描述！' }]">
        <a-textarea
            disabled="true"
            v-model:value="productFormState.desc"
            placeholder="请填写产品描述(最多100个字)"
            :auto-size="{ minRows: 2, maxRows: 5 }"/>
      </a-form-item>
      <a-form-item
          label="系统类型"
          name="type"
          :rules="[{ required: true, message: '请选择系统类型！' }]">
        <a-select disabled="true" v-model:value="productFormState.type" placeholder="请选择系统类型" :options="platformTypeOptions"></a-select>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";

import logger from "../../utils/logger";
import {proAddApi, proDelApi, proDetailsApi, proEditApi, proListApi, userAddApi, userListApi} from "../../api/goautapi";
import {openFailedNotification, openSuccessNotification} from "../../components/notification";
import strings from "../../assets/strings";
import timeUtils from "../../utils/timeUtils";

const tag = "/index/adm/ProductAdm";

export default defineComponent({
  name: "ProductAdm",
  setup() {
    const instance = getCurrentInstance();

    // state: 搜索数据
    const searchState = ref({
      productName: ""
    });

    // state: 表格数据
    const tableData = ref([]);
    const tableColumns = ref([
      {title: '产品名称', dataIndex: 'name', key: 'name'},
      {title: '产品描述', dataIndex: 'desc', key: 'desc'},
      {title: '平台类型', key: 'platform', dataIndex: 'platform'},
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

    // state: 表单数据
    const productFormState = ref({
      id: 0,
      name: "",
      desc: "",
      type: [],
    });

    // options: 平台类型options
    const platformTypeOptions = ref([
      {label: "Android", value: 1}, {label: "iOS", value: 2}
    ])

    /**
     * @function onSearchByName
     * @desc 根据产品名称搜索事件
     * @param value str 产品名称
     */
    const onSearchByName = (value) => {
      logger.redundancy(tag, "exec function onSearchByName...");

      proList(getQueryParams());
    };

    onMounted(() => {

      proList(getQueryParams);
    });

    /**
     * @function openAddDrawer
     * @desc 打开添加产品Drawer
     */
    const openAddDrawer = () => {
      logger.redundancy(tag, "exec function openAddDrawer...");
      drawerState.value.visibleOfAdd = true;
    };

    /**
     * @function openDetailsDrawer
     * @desc 打开产品详情Drawer
     * @param id {number} 产品id
     */
    const openDetailsDrawer = (id) => {
      logger.redundancy(tag, "exec function openDetailsDrawer...");
      drawerState.value.visibleOfDetails = true;
      let params = {id: id};
      proDeatils(params);
    };

    /**
     * @function openEditDrawer
     * @desc 打开编辑产品Drawer
     * @param id {number} 产品id
     */
    const openEditDrawer = (id) => {
      logger.redundancy(tag, "exec function openEditDrawer...");
      drawerState.value.visibleOfEdit = true;
      productFormState.value.id = id;
      let params = {id: id};
      proDeatils(params);
    };

    /**
     * @function onClickOfAddPro
     * @desc 点击添加产品按钮事件
     */
    const onClickOfAddPro = () => {
      logger.redundancy(tag, "exec function onClickOfAddPro...");

      proAdd();
    };

    /**
     * @function onClickOfEditPro
     * @desc 点击编辑产品按钮事件
     */
    const onClickOfEditPro = () => {
      logger.redundancy(tag, "exec function onClickOfEditPro...");

      proEdit();
    };

    /**
     * @function onClickOfDelPro
     * @desc 点击删除产品按钮事件
     */
    const onClickOfDelPro = (id) => {
      logger.redundancy(tag, "exec function onClickOfEditPro...");
      let params = {id: id};
      proDel(params);
    };

    /**
     * @function afterVisibleChangeOfAdd
     * @desc 添加产品抽屉显示/隐藏的回调函数
     * @param bool boolean
     */
    const afterVisibleChangeOfAdd = (bool) => {
      console.log('visibleOfAdd', bool);
    };

    /**
     * @function afterVisibleChangeOfEdit
     * @desc 编辑产品抽屉显示/隐藏的回调函数
     * @param bool boolean
     */
    const afterVisibleChangeOfEdit = (bool) => {
      console.log('visibleOfEdit', bool);
    };

    /**
     * @function afterVisibleChangeOfDetails
     * @desc 产品详情抽屉显示/隐藏的回调函数
     * @param bool boolean
     */
    const afterVisibleChangeOfDetails = (bool) => {
      console.log('visibleOfDetails', bool);
    };

    /**
     * @function proAdd
     * @desc 添加产品
     */
    const proAdd = () => {
      logger.redundancy(tag, "exec function proAdd...");

      instance.refs["add"].validateFields().then((data) => {
        logger.info(tag, "data: ", data);

        let body = {
          name: data.name,
          description: data.desc,
          platformType: data.type === 1 ? "Android" : data.type === 2 ? "iOS" : ""
        }

        proAddApi(body).then((res) => {
          logger.info(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              openSuccessNotification("添加产品成功！");
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
          logger.info(tag, "call userAddApi complete!")
        })
      }).catch((err) => {
        logger.error(tag, "err: ", err);
      }).finally(() => {
        logger.info(tag, "call add validateFields function complete!")
      })
    };

    /**
     * @function proDel
     * @desc 删除产品信息
     * @param params {object} 请求参数
     */
    const proDel = (params) => {
      logger.redundancy(tag, "exec function proDel...");

      proDelApi(params).then((res) => {
        logger.info(tag, "res:", res);
        if (res.status === 200) {
          let data = res.data;
          if (data.code === 200) {
            openSuccessNotification("删除产品成功！");
            proList(getQueryParams())
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
        logger.info(tag, "call proDelApi complete!")
      })
    }

    /**
     * @function proEdit
     * @desc 编辑产品
     */
    const proEdit = () => {
      logger.redundancy(tag, "exec function proEdit...");

      instance.refs["edit"].validateFields().then((data) => {
        logger.info(tag, "data: ", data);

        let body = {
          id: productFormState.value.id,
          name: data.name,
          description: data.desc,
          platformType: data.type === 1 ? "Android" : data.type === 2 ? "iOS" : ""
        }

        proEditApi(body).then((res) => {
          logger.info(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              openSuccessNotification("编辑产品成功！");
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
          logger.info(tag, "call proEditApi complete!")
        })
      }).catch((err) => {
        logger.error(tag, "err: ", err);
      }).finally(() => {
        logger.info(tag, "call edit validateFields function complete!")
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
      if(!(searchState.value.productName === "")) {
        params.name = searchState.value.productName;
      }

      return params;
    }

    /**
     * @function proList
     * @desc 分页查询产品列表
     * @param params {object} 请求参数
     */
    const proList = (params) => {
      logger.redundancy(tag, "exec function proList...");

      proListApi(params).then((res) => {
        logger.info(tag, "res:", res);
        if (res.status === 200) {
          let data = res.data;
          if (data.code === 200) {
            let arr = data.data.data;
            if(arr != null || arr.length > 0) {
              tableData.value = [];
              for(let i = 0; i < arr.length; i++) {
                let item = {
                  id: arr[i].ID,
                  key: i,
                  name: arr[i].name,
                  desc: arr[i].description,
                  platform: arr[i].platformType,
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
        openFailedNotification(strings.undefined_error);
      }).finally(() => {
        logger.info(tag, "call userListApi complete!")
      });
    };

    /**
     * @function proDetails
     * @desc 获取产品详情
     * @param params {object} 请求参数
     */
    const proDeatils = (params) => {
      logger.redundancy(tag, "exec function proDetails...");

      proDetailsApi(params).then((res) => {
        logger.info(tag, "res:", res);
        if(res.status === 200) {
          let data = res.data;
          if(data.code === 200) {
            productFormState.value.name = data.data.name;
            productFormState.value.desc = data.data.description;
            productFormState.value.type = data.data.platformType === "Android" ? 1 : 2
          }else {
            openFailedNotification(data.message);
          }
        }else {
          openFailedNotification(strings.undefined_error);
        }
      }).catch((err) => {
        openFailedNotification(strings.undefined_error);
      }).finally(() => {
        logger.info(tag, "call proDetailsApi complete!");
      })
    };

    return {
      searchState,
      tableData,
      tableColumns,
      drawerState,
      productFormState,
      platformTypeOptions,
      onSearchByName,
      openAddDrawer,
      openDetailsDrawer,
      openEditDrawer,
      onClickOfAddPro,
      onClickOfEditPro,
      onClickOfDelPro,
      afterVisibleChangeOfAdd,
      afterVisibleChangeOfEdit,
      afterVisibleChangeOfDetails
    }
  },
  methods: {}
})
</script>

<style scoped>
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
  .search-item-search {
    width: 240px;
  }
</style>