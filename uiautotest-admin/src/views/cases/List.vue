<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>用例管理</a-breadcrumb-item>
        <a-breadcrumb-item>用例列表</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面查添加、编辑、删除、查阅测试用例相关的信息！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button type="primary" @click="onClickOfAdd">添加用例</a-button>
    </div>
  </div>
  <!-- 搜索 -->
  <div class="page-search-card-div">
    <div class="page-search-card-row-div">
      <div>
        <span>所属产品：</span>
        <a-select v-model:value="searchState.forProduct" :options="proBoxOptions"
                  placeholder="请选择所属产品" class="page-search-card-condition-item-common">
        </a-select>
      </div>
      <div>
        <span>选择状态：</span>
        <a-select v-model:value="searchState.status" :options="statusOptions"
                  placeholder="请选择状态" class="page-search-card-condition-item-common">
        </a-select>
      </div>
      <div>
        <span>用例标题：</span>
        <a-input
            v-model:value="searchState.caseName" placeholder="请输入用例标题" size="default"
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
        <template v-if="column.key === 'action'" v-for="item in record.action">
          <a class="margin-right-10" v-if="item === '详情'" @click="onClickOfDetails(record.id)">{{item}}</a>
          <a class="margin-right-10" v-else-if="item === '编辑'" @click="onClickOfEdit(record.id)">{{item}}</a>
          <a class="margin-right-10" v-else-if="item === '删除'" @click="onClickOfDel(record.id)">{{item}}</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
  import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";

  import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
  import {
    caseDelApi,
    caseListApi,
    proBoxApi,
  } from "../../api/goautapi";
  import logger from "../../utils/logger";
  import {openFailedNotification, openSuccessNotification} from "../../components/notification";
  import strings from "../../assets/strings";
  import timeUtils from "../../utils/timeUtils";
  import {useRouter} from "vue-router";

  const tag = "/index/case/List";

  export default defineComponent({
    name: "List",
    setup() {
      const instance = getCurrentInstance();
      const router = useRouter();

      /* 生命周期函数 */

      onMounted(() => {
        caseList(getQueryParams());
        proBox();
      });

      /* state等相关数据 */

      // state: 表格数据
      const tableState = ref({
        columns: [
          {title: '用例标题', dataIndex: 'name', key: 'name', ellipsis: true},
          {title: '测试描述', dataIndex: 'desc', key: 'desc', ellipsis: true},
          {title: "状态", key: "status", dataIndex: "status", ellipsis: true},
          {title: '所属产品', key: 'forProduct', dataIndex: 'forProduct', ellipsis: true},
          {title: '所属分组', key: 'group', dataIndex: 'group', ellipsis: true},
          {title: '所属迭代', key: 'iteration', dataIndex: 'iteration', ellipsis: true},
          {title: '适用环境', key: 'env', dataIndex: 'env', ellipsis: true},
          {title: '创建时间', key: 'createTime', dataIndex: 'createTime', ellipsis: true},
          {title: "更新时间", key: "updateTime", dataIndex: "updateTime", ellipsis: true},
          {title: "创建者", key: "creator", dataIndex: "creator", ellipsis: true},
          {title: "操作", key: "action", dataIndex: "action", width: "150px"}
        ],
        data: []
      });

      // state: 搜索数据
      const searchState = ref({
        forProduct: [], status: [], time: [], caseName: "",
      });

      // options: 产品options
      const proBoxOptions = ref([]);

      // options: 用例状态options
      const statusOptions = ref([{label: "无效", value: 0}, {label: "有效", value: 1}]);

      /* 人机交互事件 */

      /**
       * @function onClickOfAdd
       * @desc 添加按钮点击事件
       */
      const onClickOfAdd = () => {
        router.push("/index/cases/add");
      }

      /**
       * @function onClickOfDetails
       * @desc 详情按钮点击事件
       * @param id {number} 用例id
       */
      const onClickOfDetails = (id) => {
        instance.proxy.$router.push(`/index/cases/details/${id}`);
      }

      /**
       * @function onClickOfEdit
       * @desc 编辑按钮点击事件
       * @param id {number} 用例id
       */
      const onClickOfEdit = (id) => {
        instance.proxy.$router.push(`/index/cases/edit/${id}`);
      }

      /**
       * @function onClickOfDel
       * @desc 删除按钮点击事件
       * @param id {number} 用例id
       */
      const onClickOfDel = (id) => {
        caseDel({id: id});
      }

      /**
       * @function onClickOfSearch
       * @desc 点击搜索事件
       */
      const onClickOfSearch = () => {
        logger.redundancy(tag, "exec function onClickOfSearch...");

        caseList(getQueryParams());
      }

      /**
       * @function onClickOfEmpty
       * @desc 点击清空事件
       */
      const onClickOfEmpty = () => {
        logger.redundancy(tag, "exec function onClickOfEmpty...");

        searchState.value.forProduct = [];
        searchState.value.status = [];
        searchState.value.time = [];
        searchState.value.caseName = "";
      }

      /* 接口对接函数 */

      /**
       * @function getQueryParams
       * @desc 获取查询参数对象
       */
      const getQueryParams = () => {
        logger.redundancy(tag, "exec function getQueryParams...");
        logger.debug(tag, "searchState:", searchState.value);

        let params = {pageNum: 1, pageSize: 10};
        if(!(searchState.value.forProduct instanceof Array)) {
          params.productId = searchState.value.forProduct;
        }
        if(!(searchState.value.status instanceof Array)) {
          params.status = searchState.value.status;
        }
        if(!(searchState.value.caseName === "")) {
          params.searchKey = searchState.value.caseName;
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
       * @function caseList
       * @desc 分页查询用例信息
       * @param params
       */
      const caseList = (params) => {
        logger.redundancy(tag, "exec function caseList...")
        caseListApi(params).then((res) => {
          logger.info(tag, "res:", res);

          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              let arr = data.data.data;
              tableState.value.data = [];
              if(arr != null && arr.length > 0) {
                for(let i = 0; i < arr.length; i++) {
                  let item = {
                    id: arr[i].ID,
                    key: i,
                    name: arr[i].title,
                    desc: arr[i].description,
                    createTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].CreatedAt),
                    updateTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].UpdatedAt),
                    forProduct: arr[i].Product.name,
                    status: arr[i].status === 0 ? "无效" : arr[i].status === 1 ? "有效" : "未知",
                    group: arr[i].Workgroup.name,
                    iteration: arr[i].Iteration.name,
                    env: arr[i].Environment.name,
                    creator: arr[i].Creator.username,

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
          logger.error(tag, "err:", err);
          openFailedNotification(strings.undefined_error);
        }).finally(() => {
          logger.info(tag, "call caseListApi complete!")
        });
      }

      /**
       * @function proBox
       * @desc 查询产品列表
       */
      const proBox = () => {
        proBoxApi().then((res) => {
          logger.debug(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              let arr = data.data;
              for(let i = 0; i < arr.length; i++) {
                let item = {
                  value: arr[i].id,
                  label: arr[i].name
                };
                proBoxOptions.value.push(item);
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
      }

      /**
       * @function caseDel
       * @desc 删除用例信息
       * @param params {object} 请求参数
       */
      const caseDel = (params) => {
        logger.redundancy(tag, "exec function caseDel...");

        caseDelApi(params).then((res) => {
          logger.info(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              openSuccessNotification("删除用例成功！");
              caseList(getQueryParams());
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
          logger.info(tag, "call caseDelApi complete!")
        })
      }

      return {
        tableState,
        searchState,
        proBoxOptions,
        statusOptions,
        locale,
        onClickOfAdd,
        onClickOfDetails,
        onClickOfEdit,
        onClickOfDel,
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