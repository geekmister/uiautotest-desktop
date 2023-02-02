<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>用例管理</a-breadcrumb-item>
        <a-breadcrumb-item>用例详情</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面查看测试用例！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button class="margin-right-10" @click="onCliickOfBack">返回</a-button>
    </div>
  </div>
  <!-- 测试用例 -->
  <div class="case-card-div">
    <!-- 编辑用例 -->
    <div class="case-card-left-div">
      <span>编辑测试用例</span>
      <!-- 基础信息 -->
      <a-card style="margin-top: 10px" size="small" title="基础信息">
        <a-input :disabled=true v-model:value="caseState.number" placeholder="请输入测试用例编号"></a-input>
        <a-input :disabled=true v-model:value="caseState.title" style="margin-top: 10px"
                 placeholder="请输入测试用例标题"></a-input>
        <a-input :disabled=true v-model:value="caseState.description" style="margin-top: 10px"
                 placeholder="请输入测试用例描述"></a-input>
        <a-select :disabled=true v-model:value="caseState.productId" :options="proBoxOptions"
                  style="margin-top: 10px; width: 100%" placeholder="请选择所属产品"></a-select>
        <a-select :disabled=true v-model:value="caseState.workgroupId" :options="groupBoxOptions"
                  style="margin-top: 10px; width: 100%" placeholder="请选择所属业务组"></a-select>
        <a-select :disabled=true v-model:value="caseState.status" :options="statusOptions"
                  style="margin-top: 10px; width: 100%" placeholder="请选择测试用例状态"></a-select>
        <div style="border: 1px solid #d9d9d9; margin-top: 10px">
          <span style="padding-top: 10px; padding-left: 10px; color: #d9d9d9;">请选择适用环境</span>
          <div style="width: 100%; padding-left: 20px; padding-top: 10px">
            <a-radio-group :disabled=true v-model:value="caseState.environmentId" name="envRaidoGroup"
                           :options="groupBoxOptions">
            </a-radio-group>
          </div>
        </div>
        <div style="border: 1px solid #d9d9d9; margin-top: 10px">
          <span style="padding-top: 10px; padding-left: 10px; color: #d9d9d9;">请选择所属迭代</span>
          <div style="width: 100%; padding-left: 20px; padding-top: 10px">
            <a-radio-group :disabled=true v-model:value="caseState.iterationId" name="iteraRaidoGroup"
                           :options="iterationBoxOptions">
            </a-radio-group>
          </div>
        </div>
      </a-card>
      <!-- 测试步骤 -->
      <a-card style="margin-top: 10px" size="small" title="测试步骤">
        <template v-for="(item, i) in caseState.testCaseSteps">
          <a-card size="small" :title="`步骤${i + 1}`">
            <a-select :disabled=true v-model:value="caseState.testCaseSteps[i].operateType"
                      :options="operateTypeOptions" style="margin-top: 10px; width: 100%"
                      placeholder="请选择元素操作事件"></a-select>

            <template v-if="item.operateType === 'pressButton'">
              <a-select :disabled=true v-model:value="caseState.testCaseSteps[i].operate.btn" :options="btnOptions"
                        style="margin-top: 10px; width: 100%" placeholder="请选择物理按键"></a-select>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'dragfromtoforduration'">
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.fromX" style="margin-top: 10px;"
                       placeholder="请输入起始横坐标点"></a-input>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.fromY" style="margin-top: 10px;"
                       placeholder="请输入起始纵坐标点"></a-input>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.toX" style="margin-top: 10px;"
                       placeholder="请输入终点横坐标点"></a-input>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.toY" style="margin-top: 10px;"
                       placeholder="请输入终点纵坐标点"></a-input>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.duration" style="margin-top: 10px;"
                       placeholder="请输入滑动时间(单位: 秒)"></a-input>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'touchAndHold'">
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.x" style="margin-top: 10px;"
                       placeholder="请输入横坐标点"></a-input>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.y" style="margin-top: 10px;"
                       placeholder="请输入纵坐标点"></a-input>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.duration" style="margin-top: 10px;"
                       placeholder="请输入触摸时间(单位: 秒)"></a-input>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'keys'">
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.value" style="margin-top: 10px;"
                       placeholder="请输入内容"></a-input>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'elements'">
              <a-select :disabled=true v-model:value="caseState.testCaseSteps[i].operate.using" :options="findTypeOptions"
                        style="margin-top: 10px; width: 100%" placeholder="请选择元素识别方式"></a-select>
              <template v-if="item.operate.using === 'link text' || item.operate.using === 'partial link text'">
                <a-select :disabled=true v-model:value="caseState.testCaseSteps[i].operate.attribute" :options="attributeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素属性"></a-select>
                <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.value" style="margin-top: 10px;"
                         placeholder="请输入元素识别内容"></a-input>
              </template>
              <template v-else-if="item.operate.using === 'class name'">
                <a-select :disabled=true v-model:value="caseState.testCaseSteps[i].operate.type" :options="elementTypeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素类型"></a-select>
              </template>
              <template v-else-if="item.operate.using === 'xpath'">
                <a-select :disabled=true v-model:value="caseState.testCaseSteps[i].operate.type" :options="elementTypeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素类型"></a-select>
                <a-select :disabled=true v-model:value="caseState.testCaseSteps[i].operate.attribute" :options="attributeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素属性"></a-select>
                <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.value" style="margin-top: 10px;"
                         placeholder="请输入元素识别内容"></a-input>
              </template>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'attribute'">
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.id" style="margin-top: 10px;"
                       placeholder="请输入元素id"></a-input>
              <a-select :disabled=true v-model:value="caseState.testCaseSteps[i].operate.attribute"
                        :options="attributeOptions"
                        style="margin-top: 10px; width: 100%" placeholder="请选择元素元素属性"></a-select>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'click'">
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.id" style="margin-top: 10px;"
                       placeholder="请输入元素id"></a-input>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'input'">
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.id" style="margin-top: 10px;"
                       placeholder="请输入元素id"></a-input>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.value" style="margin-top: 10px;"
                       placeholder="请输入输入内容"></a-input>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'clear'">
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.id" style="margin-top: 10px;"
                       placeholder="请输入元素id"></a-input>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'wait'">
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.time" style="margin-top: 10px;"
                       placeholder="请输入等待时间(单位：秒)"></a-input>
              <a-input :disabled=true v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
          </a-card>
        </template>
      </a-card>
      <!-- 检查信息 -->
      <a-card style="margin-top: 10px" size="small" title="检查信息">
        <template v-for="(item, i) in caseState.testCaseCheckPoint">
          <a-card size="small" :title="`检查点${i + 1}`">
            <a-select :disabled=true v-model:value="caseState.testCaseCheckPoint[i].operateType"
                      :options="operateTypeOptionsOfCheckPoint"
                      style="margin-top: 10px; width: 100%" placeholder="请选择元素操作事件"></a-select>

            <template v-if="item.operateType === 'elements'">
              <a-select :disabled=true v-model:value="caseState.testCaseCheckPoint[i].operate.using" :options="findTypeOptions"
                        style="margin-top: 10px; width: 100%" placeholder="请选择元素识别方式"></a-select>
              <template v-if="item.operate.using === 'link text' || item.operate.using === 'partial link text'">
                <a-select :disabled=true v-model:value="caseState.testCaseCheckPoint[i].operate.attribute" :options="attributeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素属性"></a-select>
                <a-input :disabled=true v-model:value="caseState.testCaseCheckPoint[i].operate.value" style="margin-top: 10px;"
                         placeholder="请输入元素识别内容"></a-input>
              </template>
              <template v-else-if="item.operate.using === 'class name'">
                <a-select :disabled=true v-model:value="caseState.testCaseCheckPoint[i].operate.type" :options="elementTypeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素类型"></a-select>
              </template>
              <template v-else-if="item.operate.using === 'xpath'">
                <a-select :disabled=true v-model:value="caseState.testCaseCheckPoint[i].operate.type" :options="elementTypeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素类型"></a-select>
                <a-select :disabled=true v-model:value="caseState.testCaseCheckPoint[i].operate.attribute" :options="attributeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素属性"></a-select>
                <a-input :disabled=true v-model:value="caseState.testCaseCheckPoint[i].operate.value" style="margin-top: 10px;"
                         placeholder="请输入元素识别内容"></a-input>
              </template>
              <a-input :disabled=true v-model:value="caseState.testCaseCheckPoint[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入检查点描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'attribute'">
              <a-input :disabled=true v-model:value="caseState.testCaseCheckPoint[i].operate.id" style="margin-top: 10px;"
                       placeholder="请输入元素id"></a-input>
              <a-select :disabled=true v-model:value="caseState.testCaseCheckPoint[i].operate.attribute"
                        :options="attributeOptions"
                        style="margin-top: 10px; width: 100%" placeholder="请选择元素元素属性"></a-select>
              <a-input :disabled=true v-model:value="caseState.testCaseCheckPoint[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入检查点描述"></a-input>
            </template>
          </a-card>
        </template>
      </a-card>
    </div>
    <!-- 用例预览 -->
    <div class="case-card-right-div">
      <span>测试用例预览</span>
      <a-textarea :disabled=true v-model:value="yamlState"
                  style="width: 100%; height: calc(100% - 30px); margin-top: 10px; resize: none; border: none;"/>
    </div>
  </div>
</template>

<script>
  import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";

  import {caseDetailsApi, envBoxApi, groupBoxApi, iteraBoxApi, proBoxApi} from "../../api/goautapi";
  import logger from "../../utils/logger";
  import {openFailedNotification} from "../../components/notification";
  import strings from "../../assets/strings";
  import yaml from "js-yaml";
  import store from "../../store/store";

  const tag = "/index/cases/details";

  export default defineComponent({
    name: "Details",
    props: ["id"],
    setup(props, ctx) {
      const instance = getCurrentInstance();

      /* ===== 生命周期函数 ===== */

      onMounted(() => {
        proBox();
        groupBox();
        envBox();
        iterationBox();
        caseDetails({id: props.id});
      });

      /* ===== state等相关数据 ===== */

      // state: 测试用例yaml格式数据
      const yamlState = ref("");

      // state: 测试用例数据
      const caseState = ref({
        number: "", title: "", description: "", productId: [], workgroupId: [],
        iterationId: [], environmentId: [], creatorId: store.state.userId, status: [],
        testCaseSteps: [{operateType: [], operate: {}}],
        testCaseCheckPoint: [{operateType: [], operate: {}}]
      });

      // options: 产品options
      const proBoxOptions = ref([]);

      // options: 业务组options
      const groupBoxOptions = ref([]);

      // options: 环境options
      const envBoxOptions = ref([]);

      // options: 用例状态options
      const statusOptions = ref([{label: "无效", value: 0}, {label: "有效", value: 1}]);

      // options: 迭代options
      const iterationBoxOptions = ref([]);

      // options: 元素识别方式options
      const findTypeOptions = ref([
        {label: "class name", value: "class name"},
        {label: "link text(推荐方式)", value: "link text"},
        {label: "partial link text(推荐方式)", value: "partial link text"},
        {label: "xpath", value: "xpath"}
      ]);

      // options: 元素操作方式options
      const operateTypeOptions = ref([
        {label: "点击手机物理键", value: "pressButton"},
        {label: "根据坐标点滑动", value: "dragfromtoforduration"},
        {label: "根据坐标点触摸", value: "touchAndHold"},
        {label: "不指定元素输入", value: "keys"},
        {label: "查找页面内元素", value: "elements"},
        {label: "搜索元素属性值", value: "attribute"},
        {label: "指定元素id点击", value: "click"},
        {label: "指定元素id输入", value: "input"},
        {label: "指定元素id清除", value: "clear"},
        {label: "指定操作等待时", value: "wait"}
      ]);

      // options: 元素操作方式options
      const operateTypeOptionsOfCheckPoint = ref([
        {label: "查找页面内元素", value: "elements"},
        {label: "搜索元素属性值", value: "attribute"}
      ]);

      // options: 元素属性options
      const attributeOptions = ref([
        {label: "name", value: "name"},
        {label: "value", value: "value"},
        {label: "label", value: "label"}
      ]);

      // options: 物理按键类型options
      const btnOptions = ref([
        {label: "HOME键", value: "home"},
        {label: "电源键", value: "powers"},
        {label: "音量减", value: "volumeDown"},
        {label: "音量加", value: "volumeUp"}
      ]);

      /* ===== 人机交互事件 ===== */

      /**
       * @function onCliickOfBack
       * @desc 返回按钮点击事件
       */
      const onCliickOfBack = () => {
        instance.proxy.$router.push("/index/cases/list");
      }

      /* ===== 接口对接函数 ===== */

      /**
       * @function caseDetails
       * @desc 获取用例详情
       * @param params {object} 请求参数
       */
      const caseDetails = (params) => {
        caseDetailsApi(params).then((res) => {
          logger.info(tag, "res:", res);
          if(res.status === 200) {
            let data = res.data;
            if(data.code === 200) {
              caseState.value.number = data.data.number;
              caseState.value.title = data.data.title;
              caseState.value.description = data.data.description;
              caseState.value.productId = data.data.productId;
              caseState.value.workgroupId = data.data.workgroupId;
              caseState.value.iterationId = data.data.iterationId;
              caseState.value.environmentId = data.data.environmentId;
              caseState.value.creatorId = data.data.creatorId;
              caseState.value.status = data.data.status;
              let testCase = yaml.load(data.data.code);
              logger.debug(tag, "testCase:", testCase);
              caseState.value.testCaseSteps = testCase.testCaseSteps;
              caseState.value.testCaseCheckPoint = testCase.testCaseCheckPoint;

              yamlState.value = data.data.code;

              iterationBox(caseState.value.productId);
            }else {
              openFailedNotification(data.message);
            }
          }else {
            openFailedNotification(strings.undefined_error);
          }
        }).catch((err) => {
          openFailedNotification(strings.undefined_error);
        }).finally(() => {
          logger.info(tag, "call caseDetailsApi complete!");
        })
      };

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
       * @function envBox
       * @desc 查询环境列表
       */
      const envBox = () => {
        envBoxApi().then((res) => {
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
                envBoxOptions.value.push(item);
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
          logger.info(tag, "call envBoxApi complete!");
        })
      }

      /**
       * @function groupBox
       * @desc 查询分组列表
       */
      const groupBox = () => {
        groupBoxApi().then((res) => {
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
                groupBoxOptions.value.push(item);
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
          logger.info(tag, "call groupBoxApi complete!");
        })
      }

      /**
       * @function iterationBox
       * @desc 查询迭代列表
       */
      const iterationBox = (productId) => {
        logger.redundancy(tag, "exec function iterationBox...");
        logger.debug(tag, "productId:", productId);

        let params = {productId: productId}

        if(productId === undefined) {return;}

        iteraBoxApi(params).then((res) => {
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
                iterationBoxOptions.value.push(item);
              }
            }else {
              openFailedNotification(data.message);
            }
          }else {
            openFailedNotification(strings.undefined_error);
          }
        }).catch((err) => {
          logger.error(tag, "err:", err);
          openFailedNotification(strings.undefined_error);
        }).finally(() => {
          logger.redundancy(tag, "call iteraBoxApi complete!");
        })
      }

      return {
        yamlState,
        caseState,
        proBoxOptions,
        groupBoxOptions,
        envBoxOptions,
        statusOptions,
        iterationBoxOptions,
        findTypeOptions,
        operateTypeOptions,
        btnOptions,
        attributeOptions,
        operateTypeOptionsOfCheckPoint,
        onCliickOfBack
      };
    }
  })
</script>

<style scoped>
  /* layout 测试用例 */
  .case-card-div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: calc(100% - 70px);
    margin-top: 10px;
  }
  .case-card-left-div {
    width: 100%;
    height: 100%;
    background-color: white;
    margin-right: 5px;
    padding: 10px 10px;
  }
  .case-card-right-div {
    width: 100%;
    height: 100%;
    background-color: white;
    margin-left: 5px;
    padding: 10px 10px;
  }
</style>