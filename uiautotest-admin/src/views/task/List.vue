<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>任务管理</a-breadcrumb-item>
        <a-breadcrumb-item>任务列表</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面查添加、编辑、删除、查阅测试任务相关的信息！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button type="primary" @click="onClickOfAdd">创建任务</a-button>
    </div>
  </div>
  <!-- 搜索 -->
  <div class="page-search-card-div">
    <div class="page-search-card-row-div">
      <div>
        <span>所属产品：</span>
        <a-select v-model:value="searchState.productId" :options="proBoxOptions"
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
            v-model:value="searchState.searchKey" placeholder="请输入任务标题" size="default"
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
          <a class="margin-right-10" v-else-if="item === '开始'" @click="onClickOfStart(record.id)">{{item}}</a>
          <template v-if="record.status === '已结束'">
            <a class="margin-right-10" v-if="item === '报告'" @click="onClickOfReport(record.id)">{{item}}</a>
<!--            <a class="margin-right-10" v-else-if="item === '日志'" @click="onClickOfLog(record.id)">{{item}}</a>-->
          </template>
        </template>
        <template v-else-if="column.key === 'schedule'">
          <a-progress :percent="record.schedule"></a-progress>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
  import {defineComponent, onMounted, ref} from "vue";
  import {useRouter} from "vue-router";

  import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
  import {taskStartApi, taskDelApi, taskListApi, proBoxApi} from "../../api/goautapi";
  import logger from "../../utils/logger";
  import {openFailedNotification, openSuccessNotification} from "../../components/notification";
  import strings from "../../assets/strings";
  import timeUtils from "../../utils/timeUtils";

  const tag = "/index/task/list";

  export default defineComponent({
    name: "List",
    setup() {
      const router = useRouter();

      /* 生命周期函数 */

      onMounted(() => {
        proBox();
        taskList(getQueryParams());
      });

      /* state等相关数据 */

      // state: 搜索数据
      const searchState = ref({
        productId: [], status: [], searchKey: "", time: [], pageNum: 1, pageSize: 10
      });

      // state: 表格数据
      const tableState = ref({
        columns: [
          {title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true},
          {title: '任务描述', dataIndex: 'desc', key: 'desc', ellipsis: true},
          {title: "状态", key: "status", dataIndex: "status", ellipsis: true},
          {title: '所属产品', key: 'forProduct', dataIndex: 'forProduct', ellipsis: true},
          {title: '所属分组', key: 'group', dataIndex: 'group', ellipsis: true},
          {title: '所属迭代', key: 'iteration', dataIndex: 'iteration', ellipsis: true},
          {title: '适用环境', key: 'env', dataIndex: 'env', ellipsis: true},
          {title: '任务类型', key: 'aging', dataIndex: 'aging', ellipsis: true},
          {title: '创建者', key: 'creator', dataIndex: 'creator', ellipsis: true},
          {title: '任务进度', key: 'schedule', dataIndex: 'schedule', width: "100px"},
          {title: '创建时间', key: 'createTime', dataIndex: 'createTime', ellipsis: true},
          {title: "更新时间", key: "updateTime", dataIndex: "updateTime", ellipsis: true},
          {title: "操作", key: "action", dataIndex: "action", width: "200px"}
        ],
        data: []
      });

      // options: 产品options
      const proBoxOptions = ref([]);

      // options: 用例状态options
      const statusOptions = ref([
        {label: "未开始", value: 0},
        {label: "进行中", value: 1},
        {label: "已暂停", value: 2},
        {label: "已终止", value: 3},
        {label: "已结束", value: 4},
        {label: "异常", value: 5}
      ]);

      /* 人机交互事件 */

      /**
       * @function onClickOfAdd
       * @desc 添加按钮点击事件
       */
      const onClickOfAdd = () => {
        router.push("/index/task/add");
      }

      /**
       * @function onClickOfEmpty
       * @desc 点击清空事件
       */
      const onClickOfEmpty = () => {
        logger.redundancy(tag, "exec function onClickOfEmpty...");

        searchState.value.productId = [];
        searchState.value.status = [];
        searchState.value.time = [];
        searchState.value.searchKey = "";
      }

      /**
       * @function onClickOfSearch
       * @desc 点击搜索事件
       */
      const onClickOfSearch = () => {
        logger.redundancy(tag, "exec function onClickOfSearch...");

        taskList(getQueryParams());
      }

      /**
       * @function onClickOfDetails
       * @desc 表格详情点击事件
       * @param id number 产品id
       */
      const onClickOfDetails = (id) => {
        router.push(`/index/task/details/${id}`);
      };

      /**
       * @function onClickOfEdit
       * @desc 编辑按钮点击事件
       * @param id {number} 用例id
       */
      const onClickOfEdit = (id) => {
        router.push(`/index/task/edit/${id}`);
      }

      /**
       * @function onClickOfDel
       * @desc 删除按钮点击事件
       * @param id {number} 用例id
       */
      const onClickOfDel = (id) => {
        taskDel({id: id});
      }

      /**
       * @function onClickOfStart
       * @param deviceId {String} 任务id
       */
      const onClickOfStart = (id) => {
        taskStart(id);
      }

      /**
       * @function onClickOfLog
       * @param deviceId {String} 任务id
       */
      const onClickOfLog = (id) => {
        router.push(`/index/task/log/${id}`);
      }

      /**
       * @function onClickOfReport
       * @param deviceId {String} 任务id
       */
      const onClickOfReport = (id) => {
        router.push(`/index/task/report/${id}`);
      }

      /* 接口对接函数 */

      /**
       * @function proBox
       * @desc 查询产品列表
       */
      const proBox = () => {
        logger.redundancy(tag, "exec function proBox...");

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
       * @function getQueryParams
       * @desc 获取查询参数对象
       */
      const getQueryParams = () => {
        logger.redundancy(tag, "exec function getQueryParams...");
        logger.debug(tag, "searchState:", searchState.value);

        let params = {pageNum: 1, pageSize: 10};
        if(!(searchState.value.productId instanceof Array)) {
          params.productId = searchState.value.productId;
        }
        if(!(searchState.value.status instanceof Array)) {
          params.status = searchState.value.status;
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
       * @function taskList
       * @desc 分页查询任务列表
       * @param params {object} 请求参数
       */
      const taskList = (params) => {
        logger.redundancy(tag, "exec function taskList...");

        taskListApi(params).then((res) => {
          logger.info(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              tableState.value.data = [];
              let arr = data.data.data;
              if(arr != null && arr.length > 0) {
                for(let i = 0; i < arr.length; i++) {
                  let item = {
                    id: arr[i].ID,
                    key: i,
                    name: arr[i].name,
                    desc: arr[i].description,
                    status: arr[i].status === 0 ? "未开始" : arr[i].status === 1 ? "待确认" : arr[i].status === 2
                        ? "拒绝执行" : arr[i].status === 3 ? "执行中" : arr[i].status === 4 ? "已结束" :
                            arr[i].status === 5 ? "异常" : "未知状态",
                    forProduct: arr[i].Product.name,
                    group: arr[i].Workgroup.name,
                    iteration: arr[i].Iteration.name,
                    env: arr[i].Environment.name,
                    aging: arr[i].execType === 1 ? "及时任务" : arr[i].execType === 2 ? "定时任务" : "未知类型",
                    creator: arr[i].creatorId,
                    schedule: arr[i].progressBar,
                    createTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].CreatedAt),
                    updateTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].UpdatedAt),
                    action: ['刷新', "编辑", "详情", "删除", "报告", "日志", "开始"]
                  };
                  tableState.value.data.push(item);
                }
              }
            }else {
              openFailedNotification(data.message);
            }
          }else {
            openFailedNotification(strings.undefined_error);
          }
        }).catch((err) => {
          openFailedNotification(strings.undefined_error);
        }).finally(() => {
          logger.info(tag, "call taskListApi complete!")
        });
      };

      /**
       * @function taskDel
       * @desc 删除任务信息
       * @param params {object} 请求参数
       */
      const taskDel = (params) => {
        logger.redundancy(tag, "exec function caseDel...");
        taskDelApi(params).then((res) => {
          logger.info(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              openSuccessNotification("删除任务成功！");
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
          logger.info(tag, "call taskDelApi complete!")
        })
      }

      /**
       * @function taskStart
       * @param id {Number} 任务id
       */
      const taskStart = (id) => {
        let body = {id: id}
        taskStartApi(body).then((res) => {
          logger.info(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              openSuccessNotification("启动任务成功！");
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
          logger.info(tag, "call taskStartApi complete!")
        })
      }

      return {
        searchState,
        tableState,
        proBoxOptions,
        statusOptions,
        locale,
        onClickOfAdd,
        onClickOfEmpty,
        onClickOfSearch,
        onClickOfDetails,
        onClickOfEdit,
        onClickOfDel,
        onClickOfStart,
        onClickOfLog,
        onClickOfReport
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