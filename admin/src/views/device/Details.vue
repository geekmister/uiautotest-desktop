<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>设备</a-breadcrumb-item>
        <a-breadcrumb-item>详情</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面查阅到设备详情相关的信息！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button type="primary" @click="onClickOfAction('返回')">返回</a-button>
    </div>
  </div>
  <!-- 表格 -->
  <div class="page-table-card-div">
    <a-table
        :columns="tableColumns"
        :dataSource="tableData"
        :pagination="false"
        style="width: 100%;">
    </a-table>
  </div>
</template>

<script>
  import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";

  import {deviceDetailsApi} from "../../api/goautapi";
  import logger from "../../utils/logger";
  import {openFailedNotification} from "../../components/notification";
  import strings from "../../assets/strings";

  const tag = "/index/device/Details";

  export default defineComponent({
    name: "Details",
    props: ["udid"],
    setup(props, ctx) {
      const instance = getCurrentInstance();

      onMounted(() => {
        deviceDetails({udid: props.udid})
      });

      // state: 表格数据
      const tableData =  ref([
      ]);
      const tableColumns = ref([
        {title: '字段', dataIndex: 'filed', key: 'filed'},
        {title: '值', dataIndex: 'value', key: 'value'}
      ]);

      /**
       * @function onClickOfAction
       * @desc 操作点击事件
       * @param event str 点击事件 [返回]
       */
      const onClickOfAction = (event) => {
        console.log("event: ", event);
        switch (event) {
          case "返回":
            instance.proxy.$router.push("/index/device/list");
            break;
          default:
            break;
        }
      };

      /**
       * @function deviceDetails
       * @desc 获取设备详情
       * @param params {object} 请求参数
       */
      const deviceDetails = (params) => {
        deviceDetailsApi(params).then((res) => {
          logger.info(tag, "res:", res);
          if(res.status === 200) {
            let data = res.data;
            if(data.code === 200) {
              let object = data.data;
              tableData.value = [
                {key: '1', filed: 'name', value: object.name},
                {key: "2", filed: "systemVersion", value: object.version},
                {key: "3", filed: "model", value: object.model},
                {key: "4", filed: "udid", value: object.udid},
                {key: "5", filed: "type", value: object.type},
                {key: "6", filed: "ip", value: object.ip},
                {key: "7", filed: "status", value: object.status}
              ];
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
      }

      return {
        tableData,
        tableColumns,
        onClickOfAction
      };
    }
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