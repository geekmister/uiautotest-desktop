<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>产品</a-breadcrumb-item>
        <a-breadcrumb-item>详情</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面查阅到产品详情相关的信息！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button type="primary" @click="onClickOfAction('返回')">返回</a-button>
    </div>
  </div>
  <!-- 表格 -->
  <div class="page-table-card-div">
    <a-table :columns="tableState.columns" :dataSource="tableState.data" :pagination="false" style="width: 100%;"></a-table>
  </div>
</template>

<script>
  import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";

  import logger from "../../utils/logger";
  import {proDetailsApi} from "../../api/goautapi";
  import {openFailedNotification} from "../../components/notification";
  import strings from "../../assets/strings";
  import timeUtils from "../../utils/timeUtils";

  const tag = "/index/product/details";

  export default defineComponent({
    name: "Details",
    props: ["id"],
    setup(props, ctx) {
      const instance = getCurrentInstance();

      // state: 表格数据
      const tableState = ref({
        columns: [
          {title: '字段', dataIndex: 'filed', key: 'filed'},
          {title: '值', dataIndex: 'value', key: 'value'}
        ],
        data: []
      });

      /**
       * @function onClickOfAction
       * @desc 操作点击事件
       * @param event str 点击事件 [返回]
       */
      const onClickOfAction = (event) => {
        console.log("event: ", event);
        switch (event) {
          case "返回":
            instance.proxy.$router.push("/index/product/list");
            break;
          default:
            break;
        }
      };

      onMounted(() => {
        let params = {id: props.id};
        proDeatils(params);
      });

      /**
       * @function proDetails
       * @desc 获取产品详情
       * @param params {object} 请求参数
       */
      const proDeatils = (params) => {
        proDetailsApi(params).then((res) => {
          logger.info(tag, "res:", res);
          if(res.status === 200) {
            let data = res.data;
            if(data.code === 200) {
              tableState.value.data.push({key: '1', filed: '产品名称', value: data.data.name});
              tableState.value.data.push({key: '2', filed: '产品描述', value: data.data.description});
              tableState.value.data.push({key: '3', filed: '平台类型', value: data.data.platformType});
              tableState.value.data.push({key: '4', filed: '创建时间',
                value: timeUtils.timeStrOfISO8601ToYMDHMS(data.data.CreatedAt)});
              tableState.value.data.push({key: '5', filed: '更新时间',
                value: timeUtils.timeStrOfISO8601ToYMDHMS(data.data.UpdatedAt)});
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
        tableState,
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