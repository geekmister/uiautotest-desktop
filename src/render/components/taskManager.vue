<template>
  <div class="taskManager-container">

    <!-- 标题区 -->
    <span class="font-size-16 font-weight-600 font-color-white mtop-9">任务管理</span>
    <div class="icon-bg-grey taskManager-btn-return btn-pointer" v-on:click="sendEvent('close')">
      <img :src="iconReturn" class="icon-size-25 curser-pointer" />
    </div>

    <!-- 任务信息 -->
    <div class="taskmanager-taskinfo-table">
      <div class="taskmanager-taskinfo-table-title">
        <span class="font-size-14 font-weight-600 font-color-white mleft-10 left-text">任务信息</span>
        <img :src="dataShowTaskInfo ? iconDown : iconRight"
             class="icon-hide-show curser-pointer" @click="dataShowTaskInfo = dataShowTaskInfo ? false : true"/>
      </div>
      <div v-show="dataShowTaskInfo" class="taskManager-table-row" v-for="item in dataTaskInfo">
        <span class="taskManager-taskinfo-table-row-key">{{item.key}}</span>
        <span class="taskManager-taskinfo-table-row-value">{{item.value}}</span>
      </div>
    </div>

    <!-- 执行进度 -->
    <div class="taskmanager-process-table">
      <div class="taskmanager-process-table-title">
        <span class="font-size-14 font-weight-600 font-color-white mleft-10 left-text">执行进度</span>
        <img :src="dataShowProcess ? iconDown : iconRight" class="icon-hide-show curser-pointer"
             @click="dataShowProcess = dataShowProcess ? false : true" />
      </div>
      <div v-show="dataShowProcess" class="taskManager-table-row" v-for="item in dataProcess">
        <span class="taskManager-taskinfo-table-row-caseid">{{item.caseId}}</span>
        <span class="taskManager-taskinfo-table-row-casename">{{item.caseName}}</span>
        <span class="taskManager-taskinfo-table-row-casedesc">{{item.caseDesc}}</span>
        <span v-if="item.caseStatus == '失败'"
              class="taskManager-taskinfo-table-row-casestatus font-color-orange">{{item.caseStatus}}</span>
        <span v-else-if="item.caseStatus == '成功'"
              class="taskManager-taskinfo-table-row-casestatus font-color-green">{{item.caseStatus}}</span>
        <span v-else class="taskManager-taskinfo-table-row-casestatus font-color-white">{{item.caseStatus}}</span>
      </div>
    </div>
  </div>
</template>

<script>

  import {ref} from "vue";

  const tag = "/render/components/taskManager.vue";

  export default {
    name: "taskManagerComponent",
    setup(props, context) {

    },
    data() {
      return {
        iconReturn: require("../assets/images/icon/return@2x.png"),
        iconDown: ref(require("../assets/images/icon/down@2x.png")),
        iconRight: ref(require("../assets/images/icon/right@2x.png")),
        dataShowTaskInfo: ref(true),
        dataShowProcess: ref(true),
        dataTaskInfo: ref([]),
        dataProcess: ref([])
      }
    },
    inject: ["parentData"],
    watch: {
      parentData: {
        handler (value) {
          console.log(tag, "value:", value);

          switch (value.taskStatus) {
            case 1:
              for (let item in value.taskInfo) {
                let data = {
                  key: item,
                  value: value.taskInfo[item]
                }
                this.dataTaskInfo.push(data);
              }

              for(let i = 0; i < value.testCases.length; i++) {
                let data = {
                  caseId: value.testCases[i].id,
                  caseName: value.testCases[i].number,
                  caseDesc: value.testCases[i].description,
                  caseStatus: "待执行"
                }
                this.dataProcess.push(data);
              }
              break;
            case 2:
              let process = value.taskProcess;
              this.dataProcess[process.index].caseStatus = process.result === "SUCCESS" ? "成功" : "失败";
              break;
            case 3:
              break;
            default:
              this.dataTaskInfo = [];
              this.dataProcess = [];
              break;
          }
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      // 发送事件
      sendEvent: function (event) {
        console.log("event: ", event);

        this.$emit("receiveChildEvent", {
          "channel": "taskManager.vue",
          "event": event
        });
      }
    }
  }
</script>

<style scoped>
  @import url('../assets/css/base.css');

  .taskManager-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 800px;
    height: 100%;
    position: absolute;
    right: 150px;
    background: #000000;
    padding-top: 20px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 20px;
    z-index: 99;
    overflow-y: scroll;
  }

  .taskManager-btn-return {
    position: absolute;
    top: 20px;
    right: 10px;
  }

  .taskmanager-taskinfo-table {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    margin-top: 20px;
  }

  .taskmanager-taskinfo-table-title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 40px;
    background: #202129;
    margin-top: 20px;
    position: relative;
  }

  .icon-hide-show {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .taskManager-table-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #202129;
  }

  .taskManager-taskinfo-table-row-key {
    width: 120px;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #ffffff;
    line-height: 20px;
    margin-left: 20px;
    margin-right: 10px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }

  .taskManager-taskinfo-table-row-value {
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #ffffff;
    line-height: 20px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }

  .taskmanager-process-table {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    margin-top: 20px;
  }

  .taskmanager-process-table-title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 40px;
    background: #202129;
    margin-top: 20px;
    position: relative;
  }

  .taskManager-taskinfo-table-row-caseid {
    width: 120px;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #ffffff;
    line-height: 20px;
    margin-left: 20px;
    margin-right: 10px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }

  .taskManager-taskinfo-table-row-casename {
    width: 170px;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #ffffff;
    line-height: 20px;
    margin-right: 10px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }

  .taskManager-taskinfo-table-row-casedesc {
    width: 320px;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #ffffff;
    line-height: 20px;
    margin-right: 10px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }

  .taskManager-taskinfo-table-row-casestatus {
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    line-height: 20px;
  }
</style>