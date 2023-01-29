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
  <!-- 内容 -->
  <div>{{logState}}</div>
</template>

<script>
  import {defineComponent, onMounted, ref} from "vue";
  import {useRouter} from "vue-router";

  export default defineComponent({
    name: "Log",
    props: ["id"],
    setup(props, ctx) {
      const router = useRouter();

      /* 生命周期函数 */

      onMounted(() => {

      });

      /* state等相关数据 */

      // state: 日志数据
      const logState = ref("");

      /* 人机交互事件 */

      /**
       * @function onClickOfBack
       * @desc 操作点击返回按钮事件
       */
      const onClickOfBack = () => {
          router.push("/index/task/list");
      };

      /* 接口对接函数 */

      return {
        logState,
        onClickOfBack
      }
    },
  });
</script>

<style scoped>

</style>