<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>任务大厅</a-breadcrumb-item>
        <a-breadcrumb-item>测试报告</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面可以查看测试报告信息！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button type="primary" class="margin-right-10" @click="onClickOfBack">返回</a-button>
    </div>
  </div>
  <!-- 测试报告详情 -->
  <a-card title="测试报告详情" size="default" style="margin-top: 10px">
    <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
      <a-table
          :columns="reportState.detailsTableColumns" :dataSource="reportState.detailsTableData"
          :pagination="false" style="width: 100%;" size="small">
        <template #bodyCell="{column, record}">
          <template v-if="column.key === 'value' && record.filed === '任务日志'">
            <a class="margin-right-10" :href="record.value" target="_blank">点击下载日志</a>
          </template>
        </template>
      </a-table>
      <div
          style="display: flex; flex-direction: row; justify-content: center; align-items: flex-start; width: 100%;">
        <div id="pie"></div>
      </div>
    </div>
  </a-card>
  <!-- 错误用例 -->
  <a-card title="错误用例" size="default" style="margin-top: 10px">
    <a-table
        :columns="reportState.errorCaseTableColumns" :dataSource="reportState.errorCaseTableData"
        :pagination="false" size="small">
      <template #expandedRowRender="{ column, record }">
        <a-table style="margin-bottom: 10px; margin-left: 20px; margin-right: 20px"
            :columns="record.expandColumn" :dataSource="record.expandData" :pagination="false" size="small">
          <template #bodyCell="{column, record}">
            <template v-if="column.key === 'value' && record.filed === '截图'">
              <img style="max-width: 25%; min-height: 25%" :src="record.value"/>
            </template>
          </template>
        </a-table>
      </template>
    </a-table>
  </a-card>
  <!-- 全部用例 -->
  <a-card title="全部用例" size="default" style="margin-top: 10px">
    <a-table
        :columns="reportState.allCaseTableColumns" :dataSource="reportState.allCaseTableData" :pagination="false" size="small">
      <template #expandedRowRender="{ column, record }">
        <a-table style="margin-bottom: 10px; margin-left: 20px; margin-right: 20px"
                 :columns="record.expandColumn" :dataSource="record.expandData" :pagination="false" size="small">
          <template #bodyCell="{column, record}">
            <template v-if="column.key === 'value' && record.filed === '截图'">
              <img style="max-width: 25%; min-height: 25%" :src="record.value"/>
            </template>
          </template>
        </a-table>
      </template>
    </a-table>
  </a-card>
</template>

<script>
  import {defineComponent, onMounted, ref} from "vue";
  import {useRouter} from "vue-router";
  import { Pie } from '@antv/g2plot';
  import logger from "../../utils/logger";
  import {getBaseUrl, taskListApi, taskReportApi} from "../../api/goautapi";
  import timeUtils from "../../utils/timeUtils";
  import {openFailedNotification} from "../../components/notification";
  import strings from "../../assets/strings";

  const tag = "/index/task/Report"

  export default defineComponent({
    name: "Report",
    props: ["id"],
    setup(props, ctx) {
      const router = useRouter();

      /* 生命周期函数 */

      onMounted(() => {
        logger.redundancy(tag, "exec function onMounted...");

        taskReport();
      });

      /* state等相关数据 */

      // state: 测试报告数据
      const reportState = ref({
        logFilePath: "",
        detailsTableColumns: [
          {title: '字段', dataIndex: 'filed', key: 'filed'},
          {title: '值', dataIndex: 'value', key: 'value'}
        ],
        detailsTableData: [],
        errorCaseTableColumns: [
          {title: '用例id', dataIndex: 'caseId', key: 'caseId'},
          {title: '用例名称', dataIndex: 'name', key: 'name', ellipsis: true},
          {title: '用例描述', dataIndex: 'desc', key: 'desc', ellipsis: true},
          {title: '测试结果', dataIndex: 'result', key: 'result'},
          {title: '设备名称', dataIndex: 'device', key: 'device'},
          {title: '平台类型', dataIndex: 'platform', key: 'platform'},
          {title: '执行时间', dataIndex: 'exceTime', key: 'exceTime'}
        ],
        errorCaseTableData: [],
        allCaseTableColumns: [
          {title: '用例id', dataIndex: 'caseId', key: 'caseId'},
          {title: '用例名称', dataIndex: 'name', key: 'name', ellipsis: true},
          {title: '用例描述', dataIndex: 'desc', key: 'desc', ellipsis: true},
          {title: '测试结果', dataIndex: 'result', key: 'result'},
          {title: '设备名称', dataIndex: 'device', key: 'device'},
          {title: '平台类型', dataIndex: 'platform', key: 'platform'},
          {title: '执行时间', dataIndex: 'exceTime', key: 'exceTime'}
        ],
        allCaseTableData: []
      });

      /* 人机交互事件 */

      /**
       * @function onClickOfBack
       * @desc 操作点击返回按钮事件
       */
      const onClickOfBack = () => {
        router.push("/index/task/list");
      };

      /* 接口对接函数 */

      /**
       * @function taskReport
       * @desc 查询任务报告
       */
      const taskReport = () => {
        logger.redundancy(tag, "exec function taskReport...");

        taskReportApi({id: props.id}).then((res) => {
          logger.info(tag, "res:", res);

          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              reportState.value.logFilePath = data.data.filePath;
              reportState.value.detailsTableData = [
                {key: '1', filed: '任务名称', value: data.data.taskName},
                {key: "2", filed: "任务描述", value: data.data.taskDesc},
                {key: "3", filed: "执行环境", value: data.data.environment},
                {key: "5", filed: "所属产品", value: data.data.product},
                {key: "6", filed: "所属迭代", value: data.data.iteration},
                {key: "7", filed: "创建者", value: data.data.creator},
                {key: "8", filed: "执行设备", value: data.data.deviceName},
                {key: "9", filed: "开始时间", value: timeUtils.timeStampToYMDHMS(data.data.beginTime)},
                {key: "10", filed: "结束时间", value: timeUtils.timeStampToYMDHMS(data.data.endTime)},
                {key: "11", filed: "任务日志",
                  value: `${getBaseUrl()}${data.data.filePath.substr(1, data.data.filePath.length)}`},
              ];
              if(data.data.testCaseReports != null && data.data.testCaseReports.length > 0) {
                for(let i = 0; i < data.data.testCaseReports.length; i++) {
                  let item  = data.data.testCaseReports[i];
                  reportState.value.allCaseTableData.push({
                    key: i,
                    caseId: item.caseNumber,
                    name: item.caseName,
                    desc: item.caseDesc,
                    result: item.result === "Success" ? "成功" : item.result === "Failed" ? "失败" : "未知结果",
                    device: item.device,
                    platform: item.platformType,
                    exceTime: timeUtils.timeStampToYMDHMS(item.beginTime),
                    expandColumn: [
                      {title: '字段', dataIndex: 'filed', key: 'filed'}, {title: '值', dataIndex: 'value', key: 'value'}
                    ],
                    expandData: [
                      {key: '1', filed: '所属产品', value: data.data.product},
                      {key: '2', filed: '状态', value: item.status === "Success" ? "成功" :
                            item.status === "Failed" ? "失败" : "未知结果"},
                      {key: '3', filed: '执行环境', value: data.data.environment},
                      {key: '4', filed: '所属迭代', value: data.data.iteration},
                      {key: '5', filed: '截图', value: `data:image/png;base64,${item.failedScreenShot}`},
                      {key: '6', filed: '失败原因', value: item.failedCause},
                      {key: '7', filed: '操作步骤', value: item.failedStep}
                    ]
                  });

                  if(item.result === "Failed") {
                    reportState.value.errorCaseTableData.push({
                      key: i,
                      caseId: item.caseNumber,
                      name: item.caseName,
                      desc: item.caseDesc,
                      result: item.result === "Success" ? "成功" :
                          item.result === "Failed" ? "失败" : "未知结果",
                      device: item.device,
                      platform: item.platformType,
                      exceTime: timeUtils.timeStampToYMDHMS(item.beginTime),
                      expandColumn: [
                        {title: '字段', dataIndex: 'filed', key: 'filed'}, {title: '值', dataIndex: 'value', key: 'value'}
                      ],
                      expandData: [
                        {key: '1', filed: '所属产品', value: data.data.product},
                        {key: '2', filed: '状态', value: item.status === "Success" ? "成功" :
                              item.status === "Failed" ? "失败" : "未知结果"},
                        {key: '3', filed: '执行环境', value: data.data.environment},
                        {key: '4', filed: '所属迭代', value: data.data.iteration},
                        {key: '5', filed: '截图', value: `data:image/png;base64,${item.failedScreenShot}`},
                        {key: '6', filed: '失败原因', value: item.failedCause},
                        {key: '7', filed: '操作步骤', value: item.failedStep}
                      ]
                    });
                  }
                }
              }

              const piePlot = new Pie('pie', {
                data: [
                  { type: '成功', value: reportState.value.allCaseTableData.length
                        - reportState.value.errorCaseTableData.length },
                  { type: '失败', value: reportState.value.errorCaseTableData.length }
                ],
                angleField: 'value',
                colorField: 'type',
              });

              piePlot.render();
            }else {
              openFailedNotification(data.message);
            }
          }else {
            openFailedNotification(strings.undefined_error);
          }
        }).catch((err) => {
          openFailedNotification(strings.undefined_error);
        }).finally(() => {
          logger.info(tag, "call taskReportApi complete!")
        });
      };

      return {
        reportState,
        onClickOfBack
      };
    }
  });
</script>

<style scoped>

</style>