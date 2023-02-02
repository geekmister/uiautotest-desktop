<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>设备</a-breadcrumb-item>
        <a-breadcrumb-item>设备列表</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面查阅到设备相关的信息！</span></div>
  </div>
  <!-- 搜索 -->
  <div class="page-search-card-div">
    <div>
      <span>设备类型：</span>
      <a-select v-model:value="searchState.type" placeholder="请选择设备类型"
                :options="typeOptions" class="search-item-common">
      </a-select>
      <span class="margin-left-20">忙碌状态：</span>
      <a-select v-model:value="searchState.status" placeholder="请选择设备状态"
                :options="statusOptions" class="search-item-common">
      </a-select>
    </div>
    <a-button class="margin-right-10" @click="onClickOfScan">设备扫描</a-button>
  </div>
  <!-- 表格 -->
  <div class="page-table-card-div">
    <a-table :columns="tableState.columns" :dataSource="tableState.data" style="width: 100%;">
      <template #bodyCell="{column, record}">
        <template v-if="column.key === 'action'" v-for="item in record.action">
          <a class="margin-right-10" v-if="item === '详情'" @click="onClickOfDetails(record.udid)">{{item}}</a>
          <a class="margin-right-10" v-else-if="item === '刷新'"
             @click="onClickOfRefresh(record.udid, record.id)">{{item}}</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
  import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";

  import logger from "../../utils/logger";
  import {deviceDetailsApi, deviceListApi, deviceRefreshApi, deviceScanApi} from "../../api/goautapi";
  import {openFailedNotification, openSuccessNotification, openWarnNotification} from "../../components/notification";
  import strings from "../../assets/strings";

  const tag = "/index/device/List";

  export default defineComponent({
    name: "List",
    setup() {
      const instance = getCurrentInstance();

      /* 生命周期函数 */

      onMounted(() => {});

      /* state等相关数据 */

      // state: 搜索数据
      const searchState = ref({
        type: [], status: []
      });

      // state: 表格数据
      const tableState = ref({
        columns: [
          {title: "设备唯一id", key: "udid", dataIndex: "udid", ellipsis: true},
          {title: '名称', dataIndex: 'name', key: 'name', ellipsis: true},
          {title: '链接类型', dataIndex: 'connectionType', key: 'connectionType', ellipsis: true},
          {title: "忙碌状态", key: "status", dataIndex: "status", ellipsis: true},
          {title: '系统版本', dataIndex: 'version', key: 'version', ellipsis: true},
          {title: '型号', key: 'model', dataIndex: 'model', ellipsis: true},
          {title: "设备类型", key: "type", dataIndex: "type", ellipsis: true},
          {title: "设备IP", key: "ip", dataIndex: "ip", ellipsis: true},
          {title: "客户端绑定地址", key: "bindClientAddr", dataIndex: "bindClientAddr", ellipsis: true},
          {title: "操作", key: "action", dataIndex: "action"}
        ],
        data: []
      });

      // options: 设备状态options
      const statusOptions = ref([{label: "空闲中", value: "leisure"}, {label: "占用中", value: "busy"}]);

      // options: 设备类型options
      const typeOptions = ref([{label: "iOS", value: "iOS"}, {label: "Android", value: "Android"}]);

      /* 人机交互事件 */

      /**
       * @function onClickOfScan
       * @desc 设备扫描
       */
      const onClickOfScan = () => {
        deviceScan();
      };

      /**
       * @function onClickOfRefresh
       * @desc 刷新设备
       * @param udid {String} 设备唯一id
       * @param id {number} 行记录id
       */
      const onClickOfRefresh = (udid, id) => {
        deviceRefresh(udid, id);
      }

      /**
       * @function onClickOfDetails
       * @desc 设备详情
       * @param udid {string} 设备唯一id
       */
      const onClickOfDetails = (udid) => {
        instance.proxy.$router.push(`/index/device/details/${udid}`);
      }

      /* 接口对接函数 */

      /**
       * @function deviceScan
       * @desc 设备扫描
       */
      const deviceScan = () => {
        logger.debug(tag, "exec function taskAdd...");

        deviceScanApi().then((res) => {
          logger.info(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              openSuccessNotification("扫描设备成功！");
              deviceList(getQueryParams());
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
          logger.info(tag, "call deviceScan complete!")
        })
      }

      /**
       * @function getQueryParams
       * @desc 获取查询参数
       * @return {{type: UnwrapRef<*[]>, status: UnwrapRef<*[]>}}
       */
      const getQueryParams = () => {
        logger.redundancy(tag, "exec function getQueryParams...");

        let params = {};
        if(!(searchState.value.type instanceof Array)) {
          params.type = searchState.value.type;
        }
        if(!(searchState.value.status instanceof Array)) {
          params.status = searchState.value.status;
        }

        return params;
      }

      /**
       * @function deviceList
       * @desc 查询设备列表
       * @param params
       */
      const deviceList = (params) => {
        logger.debug(tag, "exec function deviceList...");

        deviceListApi(params).then((res) => {
          logger.debug(tag, "res:", res);

          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {

              if(!(data.data === null)) {
                tableState.value.data = [];
                let arr = data.data;
                for(let i = 0; i < arr.length; i++) {
                  let item = {
                    id: i,
                    udid: arr[i].udid,
                    name: arr[i].name,
                    connectionType: arr[i].connectionType,
                    status: arr[i].status,
                    version: arr[i].version,
                    model: arr[i].model,
                    type: arr[i].type,
                    ip: arr[i].ip,
                    bindClientAddr: arr[i].bindClientAddr,
                    action: ["详情", "刷新"]
                  };
                  tableState.value.data.push(item);
                }
              }else {
                openWarnNotification("当前无设备在线！");
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
          logger.info(tag, "call deviceListApi complete!")
        });
      }

      /**
       * @function deviceRefresh
       * @desc 设备刷新
       * @param udid {string} 设备唯一id
       * @param id {number} 行记录id
       */
      const deviceRefresh = (udid, id) => {
        logger.debug(tag, "exec function deviceRefresh...");

        deviceRefreshApi({udid: udid}).then((res) => {
          logger.info(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              openSuccessNotification("刷新设备成功！");

              deviceDetailsApi({udid: udid}).then((res) => {
                logger.info(tag, "res:", res);
                if(res.status === 200) {
                  let data = res.data;
                  if(data.code === 200) {
                    let object = data.data;
                    tableState.value.data[id].udid = object.udid;
                    tableState.value.data[id].name = object.name;
                    tableState.value.data[id].connectionType = object.connectionType;
                    tableState.value.data[id].status = object.status;
                    tableState.value.data[id].version = object.version;
                    tableState.value.data[id].model = object.model;
                    tableState.value.data[id].type = object.type;
                    tableState.value.data[id].ip = object.ip;
                    tableState.value.data[id].bindClientAddr = object.bindClientAddr;
                  }else {
                    openFailedNotification(data.message);
                  }
                }else {
                  openFailedNotification(strings.undefined_error);
                }
              }).catch((err) => {
                openFailedNotification(strings.undefined_error);
              }).finally(() => {
                logger.info(tag, "call taskDetailsApi complete!");
              })
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
          logger.info(tag, "call deviceScan complete!")
        })
      }

      return {
        searchState,
        tableState,
        statusOptions,
        typeOptions,
        onClickOfScan,
        onClickOfRefresh,
        onClickOfDetails,
      }
    }
  })
</script>

<style scoped>
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
</style>