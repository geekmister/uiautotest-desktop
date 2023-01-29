<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>用例管理</a-breadcrumb-item>
        <a-breadcrumb-item>用例统计</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面可以查看用例统计信息！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button type="primary" class="margin-right-10" @click="onClickOfAction('返回')">返回</a-button>
    </div>
  </div>
  <!-- 统计 -->
  <div class="statistics-div">
    <!-- 报表类型 -->
    <a-card title="请选择报表类型" size="small">
      <div class="report-type-div">
        <a-checkbox>按照产品统计</a-checkbox>
        <a-checkbox>按照分组统计</a-checkbox>
        <a-checkbox>按照状态统计</a-checkbox>
        <a-checkbox>按照创建人统计</a-checkbox>
        <a-checkbox>按照创建时间统计</a-checkbox>
        <a-checkbox>按照迭代统计</a-checkbox>
        <a-checkbox>按照适用环境统计</a-checkbox>
      </div>
    </a-card>
    <!-- 图表 -->
    <div class="chart-div">
      <div>
        <a-tag color="grey">默认</a-tag>
        <a-tag color="red">饼图</a-tag>
        <a-tag color="orange">柱状图</a-tag>
        <a-tag color="green">折线图</a-tag>
      </div>
      <div class="graph-div">
        <div id="pie"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {defineComponent, getCurrentInstance} from "vue";
  import { Pie } from '@antv/g2plot';

  export default defineComponent({
    name: "Statistics",
    setup() {
      const instance = getCurrentInstance();

      /**
       * @function onClickOfAction
       * @desc 操作点击事件
       * @param event str 点击事件 [返回 | 保存]
       */
      const onClickOfAction = (event) => {
        console.log("event: ", event);
        switch (event) {
          case "返回":
            instance.proxy.$router.push("/index/cases/list");
            break;
          case "保存":
            break;
          default:
            break;
        }
      };

      return {
        onClickOfAction,
      };
    },
    mounted() {
      const piePlot = new Pie('pie', {
        data: [
          { type: '分类一', value: 27 },
          { type: '分类二', value: 25 },
          { type: '分类三', value: 18 },
          { type: '分类四', value: 15 },
          { type: '分类五', value: 10 },
          { type: '其他', value: 5 },
        ],
        angleField: 'value',
        colorField: 'type',
      });

      piePlot.render();
    }
  })
</script>

<style scoped>
  /* layout 统计 */
  .statistics-div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    margin-top: 10px;
  }
  .report-type-div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex-shrink: 0;
  }
  .chart-div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    padding: 10px 10px;
    margin-left: 10px;
    background-color: white;
  }
  .graph-div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }
</style>