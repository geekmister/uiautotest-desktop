<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>用例管理</a-breadcrumb-item>
        <a-breadcrumb-item>创建用例</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面创建测试用例，且预览测试用例YAML文档！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button class="margin-right-10" @click="onClickOfRefresh">生成预览</a-button>
      <a-button class="margin-right-10" @click="onCliickOfBack">返回</a-button>
      <a-button type="primary" @click="onCliickOfSave">保存</a-button>
    </div>
  </div>
  <!-- 测试用例 -->
  <div class="case-card-div">
    <!-- 编辑用例 -->
    <div class="case-card-left-div">
      <span>编辑测试用例</span>
      <!-- 基础信息 -->
      <a-card style="margin-top: 10px" size="small" title="基础信息">
        <a-input v-model:value="caseState.number" placeholder="请输入测试用例编号"></a-input>
        <a-input v-model:value="caseState.title" style="margin-top: 10px" placeholder="请输入测试用例标题"></a-input>
        <a-input v-model:value="caseState.description" style="margin-top: 10px" placeholder="请输入测试用例描述"></a-input>
        <a-select v-model:value="caseState.productId" :options="proBoxOptions" @change="onChangeOfForProduct"
                  style="margin-top: 10px; width: 100%" placeholder="请选择所属产品"></a-select>
        <a-select v-model:value="caseState.workgroupId" :options="groupBoxOptions"
                  style="margin-top: 10px; width: 100%" placeholder="请选择所属业务组"></a-select>
        <a-select v-model:value="caseState.status" :options="statusOptions"
                  style="margin-top: 10px; width: 100%" placeholder="请选择测试用例状态"></a-select>
        <div style="border: 1px solid #d9d9d9; margin-top: 10px">
          <span style="padding-top: 10px; padding-left: 10px; color: #d9d9d9;">请选择适用环境</span>
          <div style="width: 100%; padding-left: 20px; padding-top: 10px">
            <a-radio-group v-model:value="caseState.environmentId" name="envRaidoGroup" :options="groupBoxOptions">
            </a-radio-group>
          </div>
        </div>
        <div style="border: 1px solid #d9d9d9; margin-top: 10px">
          <span style="padding-top: 10px; padding-left: 10px; color: #d9d9d9;">请选择所属迭代</span>
          <div style="width: 100%; padding-left: 20px; padding-top: 10px">
            <a-radio-group v-model:value="caseState.iterationId" name="iteraRaidoGroup" :options="iterationBoxOptions">
            </a-radio-group>
          </div>
        </div>
      </a-card>
      <!-- 测试步骤 -->
      <a-card style="margin-top: 10px" size="small" title="测试步骤">
        <template #extra><a @click="onClickOfAddStep">添加步骤</a></template>
        <template v-for="(item, i) in caseState.testCaseSteps">
          <a-card size="small" :title="`步骤${i + 1}`">
            <template #extra v-if="caseState.testCaseSteps.length > 1">
              <a @click="onClickOfStepsDel(i)">删除</a>
            </template>

            <a-select v-model:value="caseState.testCaseSteps[i].operateType" :options="operateTypeOptions"
                      @change="onChangeOfOperateType" @focus="onFocusOfOperateType(i)"
                      style="margin-top: 10px; width: 100%" placeholder="请选择元素操作事件"></a-select>

            <template v-if="item.operateType === 'pressButton'">
              <a-select v-model:value="caseState.testCaseSteps[i].operate.btn" :options="btnOptions"
                        style="margin-top: 10px; width: 100%" placeholder="请选择物理按键"></a-select>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'dragfromtoforduration'">
              <a-input v-model:value="caseState.testCaseSteps[i].operate.fromX" style="margin-top: 10px;"
                       placeholder="请输入起始横坐标点"></a-input>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.fromY" style="margin-top: 10px;"
                       placeholder="请输入起始纵坐标点"></a-input>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.toX" style="margin-top: 10px;"
                       placeholder="请输入终点横坐标点"></a-input>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.toY" style="margin-top: 10px;"
                       placeholder="请输入终点纵坐标点"></a-input>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.duration" style="margin-top: 10px;"
                       placeholder="请输入滑动时间(单位: 秒)"></a-input>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'touchAndHold'">
              <a-input v-model:value="caseState.testCaseSteps[i].operate.x" style="margin-top: 10px;"
                       placeholder="请输入横坐标点"></a-input>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.y" style="margin-top: 10px;"
                       placeholder="请输入纵坐标点"></a-input>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.duration" style="margin-top: 10px;"
                       placeholder="请输入触摸时间(单位: 秒)"></a-input>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'keys'">
              <a-input v-model:value="caseState.testCaseSteps[i].operate.value" style="margin-top: 10px;"
                       placeholder="请输入内容"></a-input>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'elements'">
              <a-select v-model:value="caseState.testCaseSteps[i].operate.using" :options="findTypeOptions"
                        style="margin-top: 10px; width: 100%" placeholder="请选择元素识别方式"></a-select>
              <template v-if="item.operate.using === 'link text' || item.operate.using === 'partial link text'">
                <a-select v-model:value="caseState.testCaseSteps[i].operate.attribute" :options="attributeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素属性"></a-select>
                <a-input v-model:value="caseState.testCaseSteps[i].operate.value" style="margin-top: 10px;"
                         placeholder="请输入元素识别内容"></a-input>
              </template>
              <template v-else-if="item.operate.using === 'class name'">
                <a-select v-model:value="caseState.testCaseSteps[i].operate.type" :options="elementTypeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素类型"></a-select>
              </template>
              <template v-else-if="item.operate.using === 'xpath'">
                <a-select v-model:value="caseState.testCaseSteps[i].operate.type" :options="elementTypeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素类型"></a-select>
                <a-select v-model:value="caseState.testCaseSteps[i].operate.attribute" :options="attributeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素属性"></a-select>
                <a-input v-model:value="caseState.testCaseSteps[i].operate.value" style="margin-top: 10px;"
                         placeholder="请输入元素识别内容"></a-input>
              </template>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'attribute'">
              <a-input v-model:value="caseState.testCaseSteps[i].operate.id" style="margin-top: 10px;"
                       placeholder="请输入元素id"></a-input>
              <a-select v-model:value="caseState.testCaseSteps[i].operate.attribute" :options="attributeOptions"
                        style="margin-top: 10px; width: 100%" placeholder="请选择元素元素属性"></a-select>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'click'">
              <a-input v-model:value="caseState.testCaseSteps[i].operate.id" style="margin-top: 10px;"
                       placeholder="请输入元素id"></a-input>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'input'">
              <a-input v-model:value="caseState.testCaseSteps[i].operate.id" style="margin-top: 10px;"
                       placeholder="请输入元素id"></a-input>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.value" style="margin-top: 10px;"
                       placeholder="请输入输入内容"></a-input>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'clear'">
              <a-input v-model:value="caseState.testCaseSteps[i].operate.id" style="margin-top: 10px;"
                       placeholder="请输入元素id"></a-input>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'wait'">
              <a-input v-model:value="caseState.testCaseSteps[i].operate.time" style="margin-top: 10px;"
                       placeholder="请输入等待时间(单位：秒)"></a-input>
              <a-input v-model:value="caseState.testCaseSteps[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入步骤描述"></a-input>
            </template>
          </a-card>
        </template>
      </a-card>
      <!-- 检查信息 -->
      <a-card style="margin-top: 10px" size="small" title="检查信息">
        <template #extra><a @click="onClickOfAddStepOfCheckPoint">添加检查点</a></template>
        <template v-for="(item, i) in caseState.testCaseCheckPoint">
          <a-card size="small" :title="`检查点${i + 1}`">
            <template #extra v-if="caseState.testCaseCheckPoint.length > 1">
              <a @click="onClickOfCheckPointDel(i)">删除</a>
            </template>

            <a-select v-model:value="caseState.testCaseCheckPoint[i].operateType"
                      :options="operateTypeOptionsOfCheckPoint" @change="onChangeOfOperateTypeOfCheckPoint"
                      @focus="onFocusOfOperateTypeOfCheckPoint(i)"
                      style="margin-top: 10px; width: 100%" placeholder="请选择元素操作事件"></a-select>

            <template v-if="item.operateType === 'elements'">
              <a-select v-model:value="caseState.testCaseCheckPoint[i].operate.using" :options="findTypeOptions"
                        style="margin-top: 10px; width: 100%" placeholder="请选择元素识别方式"></a-select>
              <template v-if="item.operate.using === 'link text' || item.operate.using === 'partial link text'">
                <a-select v-model:value="caseState.testCaseCheckPoint[i].operate.attribute" :options="attributeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素属性"></a-select>
                <a-input v-model:value="caseState.testCaseCheckPoint[i].operate.value" style="margin-top: 10px;"
                         placeholder="请输入元素识别内容"></a-input>
              </template>
              <template v-else-if="item.operate.using === 'class name'">
                <a-select v-model:value="caseState.testCaseCheckPoint[i].operate.type" :options="elementTypeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素类型"></a-select>
              </template>
              <template v-else-if="item.operate.using === 'xpath'">
                <a-select v-model:value="caseState.testCaseCheckPoint[i].operate.type" :options="elementTypeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素类型"></a-select>
                <a-select v-model:value="caseState.testCaseCheckPoint[i].operate.attribute" :options="attributeOptions"
                          style="margin-top: 10px; width: 100%" placeholder="请选择元素属性"></a-select>
                <a-input v-model:value="caseState.testCaseCheckPoint[i].operate.value" style="margin-top: 10px;"
                         placeholder="请输入元素识别内容"></a-input>
              </template>
              <a-input v-model:value="caseState.testCaseCheckPoint[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入检查点描述"></a-input>
            </template>
            <template v-else-if="item.operateType === 'attribute'">
              <a-input v-model:value="caseState.testCaseCheckPoint[i].operate.id" style="margin-top: 10px;"
                       placeholder="请输入元素id"></a-input>
              <a-select v-model:value="caseState.testCaseCheckPoint[i].operate.attribute" :options="attributeOptions"
                        style="margin-top: 10px; width: 100%" placeholder="请选择元素元素属性"></a-select>
              <a-input v-model:value="caseState.testCaseCheckPoint[i].operate.info" style="margin-top: 10px;"
                       placeholder="请输入检查点描述"></a-input>
            </template>
          </a-card>
        </template>
      </a-card>
    </div>
    <!-- 用例预览 -->
    <div class="case-card-right-div">
      <span>测试用例预览</span>
      <a-textarea :disabled=true placeholder="请点击生成预览按钮查看测试用例YAML文档" v-model:value="yamlState"
                  style="width: 100%; height: 100%; margin-top: 10px; resize: none; border: none;"/>
    </div>
  </div>
</template>

<script>
  import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";
  import yaml from "js-yaml";

  import {caseAddApi, envBoxApi, groupBoxApi, iteraBoxApi, proBoxApi, userAddApi} from "../../api/goautapi";
  import logger from "../../utils/logger";
  import {openFailedNotification, openSuccessNotification} from "../../components/notification";
  import strings from "../../assets/strings";
  import {isPositiveInteger, isNumDecimals} from "../../utils/datautils";
  import store from "../../store/store";

  const tag = "/index/case/Add";

  export default defineComponent({
    name: "Add",
    setup() {
      /* 页面变量或者常量 */

      const instance = getCurrentInstance();
      // 当前测试用例步骤数组下标
      let testCaseStepIndex = -1;
      // 当前测试用例检查点数组下标
      let testCaseCheckPointIndex = -1;

      /* 生命周期函数 */

      onMounted(() => {
        proBox();
        groupBox();
        envBox();
        iterationBox();
      });

      /* state等相关数据 */

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
        {label: "指定操作等待时", value: "wait"},
        {label: "搜索元素属性值(后续支持)", value: "attribute", disabled: true},
        {label: "指定元素id点击(后续支持)", value: "click", disabled: true},
        {label: "指定元素id输入(后续支持)", value: "input", disabled: true},
        {label: "指定元素id清除(后续支持)", value: "clear", disabled: true}
      ]);

      // options: 元素操作方式options
      const operateTypeOptionsOfCheckPoint = ref([
        {label: "查找页面内元素", value: "elements"},
        {label: "搜索元素属性值(后续支持)", value: "attribute", disabled: true}
      ]);

      // options: 元素属性options
      const attributeOptions = ref([
        {label: "name", value: "name"},
        {label: "value", value: "value"},
        {label: "label", value: "label"}
      ]);

      // options: 元素类型options
      const elementTypeOptions = ref([
        {label: "Application", value: "Application"},
        {label: "Window", value: "Window"},
        {label: "Other", value: "Other"},
        {label: "CollectionView", value: "CollectionView"},
        {label: "TabBar", value: "TabBar"},
        {label: "StaticText", value: "StaticText"},
        {label: "Image", value: "Image"},
        {label: "Table", value: "Table"},
        {label: "Cell", value: "Cell"},
        {label: "Button", value: "Button"},
        {label: "PageIndicator", value: "PageIndicator"}
      ]);

      // options: 物理按键类型options
      const btnOptions = ref([
        {label: "HOME键", value: "home"},
        {label: "电源键", value: "powers"},
        {label: "音量减", value: "volumeDown"},
        {label: "音量加", value: "volumeUp"}
      ]);

      /* 人机交互事件 */

      /**
       * @function onClickOfRefresh
       * @desc 刷新按钮点击事件
       */
      const onClickOfRefresh = () => {
        logger.redundancy(tag, "exec function onClickOfRefresh...");
        let body = onInspectOfTestCase();

        if(body != null) {
          yamlState.value = "";
          yamlState.value = yaml.dump(body, {'styles': {'!!null': 'canonical'}, 'sortKeys': true});
          logger.debug(tag, "yamlState:", yamlState);
        }
      }

      /**
       * @function onCliickOfBack
       * @desc 返回按钮点击事件
       */
      const onCliickOfBack = () => {
        logger.redundancy(tag, "exec function onCliickOfBack...");
        instance.proxy.$router.push("/index/cases/list");
      }

      /**
       * @function onCliickOfSave
       * @desc 保存按钮点击事件
       */
      const onCliickOfSave = () => {
        logger.redundancy(tag, "exec function onCliickOfSave...");
        logger.debug(tag, "caseState:", caseState.value);

        let body = onInspectOfTestCase();
        if(body != null) {
          caseAdd(body);
        }
      }

      /**
       * @function onInspectOfTestCase
       * @desc 测试用例检查事件
       * @return {null|object} null: 检查失败；object: 检查成功，返回请求数据
       */
      const onInspectOfTestCase = () => {
        logger.redundancy(tag, "exec function onInspectOfTestCase...");
        logger.debug(tag, "caseState:", caseState);
        logger.debug(tag, "caseState:", JSON.stringify(caseState.value));

        let body = {
          number: caseState.value.number,
          title: caseState.value.title,
          description: caseState.value.description,
          productId: caseState.value.productId,
          workgroupId: caseState.value.workgroupId,
          iterationId: caseState.value.iterationId,
          environmentId: caseState.value.environmentId,
          creatorId: 0,
          status: caseState.value.status,
          testCaseSteps: caseState.value.testCaseSteps,
          testCaseCheckPoint: caseState.value.testCaseCheckPoint,
          code: yaml.dump(caseState.value, {'styles': {'!!null': 'canonical'}, 'sortKeys': true})
        };

        /* 检查测试用例基础信息 */

        // TODO 方便调试，此处代码先注释掉，并且body中的creatorId先写死，此处功能已验证通过
        // if(body.creatorId < 1) {
        //   openFailedNotification("发生异常，请重新登录！");
        //   return null;
        // }

        if(body.number === "") {
          openFailedNotification("请输入测试用例编号！");
          return null;
        }

        if(body.title === "") {
          openFailedNotification("请输入测试用例标题！");
          return null;
        }

        if(body.description === "") {
          openFailedNotification("请输入测试用例描述！");
          return null;
        }

        if(body.productId.length === 0) {
          openFailedNotification("请选择所属产品！");
          return null;
        }

        if(body.workgroupId.length === 0) {
          openFailedNotification("请选择所属业务组！");
          return null;
        }

        if(body.status.length === 0) {
          openFailedNotification("请选择测试用例状态！");
          return null;
        }

        if(body.environmentId.length === 0) {
          openFailedNotification("请选择适用环境！");
          return null;
        }

        if(body.iterationId.length === 0) {
          openFailedNotification("请选择所属迭代！");
          return null;
        }

        /* 检查测试用例步骤 */

        for(let i = 0; i < body.testCaseSteps.length; i++) {
          let item = body.testCaseSteps[i];

          // 滑动事件
          if(item.operateType === "dragfromtoforduration") {
            if(!isPositiveInteger(item.operate.fromX)) {
              openFailedNotification(`测试步骤 ${i} 起始横坐标请输入正整数，如: 100！`);
              return null;
            }

            if(!isPositiveInteger(item.operate.fromY)) {
              openFailedNotification(`测试步骤 ${i} 起始纵坐标请输入正整数，如: 100！`);
              return null;
            }

            if(!isPositiveInteger(item.operate.toX)) {
              openFailedNotification(`测试步骤 ${i} 终点横坐标请输入正整数，如: 100！`);
              return null;
            }

            if(!isPositiveInteger(item.operate.toY)) {
              openFailedNotification(`测试步骤 ${i} 终点纵坐标请输入正整数，如: 100！`);
              return null;
            }

            if(isNumDecimals(item.operate.duration) <= 0) {
              openFailedNotification(`测试步骤 ${i} 滚动时间，请按照1.000这种格式设置！`);
              return null;
            }
          }

          // 触摸事件
          if(item.operateType === "touchAndHold") {
            if(!isPositiveInteger(item.operate.x)) {
              openFailedNotification(`测试步骤 ${i} 横坐标请输入正整数，如: 100！`);
              return null;
            }

            if(!isPositiveInteger(item.operate.y)) {
              openFailedNotification(`测试步骤 ${i} 纵坐标请输入正整数，如: 100！`);
              return null;
            }

            if(isNumDecimals(item.operate.duration) <= 0) {
              openFailedNotification(`测试步骤 ${i} 触摸时间，请按照1.000这种格式设置！`);
              return null;
            }
          }

          // 不指定元素输入事件
          if(item.operateType === "keys") {
            if(body.testCaseSteps[i].operate.value === "") {
              openFailedNotification(`测试步骤 ${i} 输入内容，请输入内容！`);
            }
          }

          // 点击指定元素
          if(item.operateType === "click") {
            if(item.operate.id.length != 36) {
              openFailedNotification(`测试步骤 ${i} 请检查元素id是否正确！`);
              return null;
            }
          }

          // 指定元素输入内容
          if(item.operateType === "input") {
            if(item.operate.id.length != 36) {
              openFailedNotification(`测试步骤 ${i} 请检查元素id是否正确！`);
              return null;
            }
          }

          // 指定元素清除内容
          if(item.operateType === "clear") {
            if(item.operate.id.length != 36) {
              openFailedNotification(`测试步骤 ${i} 请检查元素id是否正确！`);
              return null;
            }
          }

          // 查找元素
          if(item.operateType === "elements") {
            if(item.operate.using != "class name" && item.operate.value === "") {
              openFailedNotification(`检查点 ${i} 请输入内容！`);
              return null;
            }
            // else {
            //   if(item.operate.using === "class name") {
            //     body.testCaseSteps[i].operate.type = `XCUIElementType${item.operate.type}`;
            //   }else if(item.operate.using === "link text" || item.operate.using === "partial link text") {
            //     body.testCaseSteps[i].operate.value = `${item.operate.attribute}=${item.operate.value}`;
            //   }else if(item.operate.using === "xpath") {
            //     body.testCaseSteps[i].operate.value =
            //         `//XCUIElementType${item.operate.type}[@${item.operate.attribute}='${item.operate.value}']`;
            //   }
            // }
          }

          // 指定元素属性获取属性值
          if(item.operateType === "attribute") {
            if(item.operate.id.length != 36) {
              openFailedNotification(`检查点 ${i} 请检查元素id是否正确！`);
              return null;
            }
          }

          // 等待
          if(item.operateType === "wait") {
            if(!isPositiveInteger(item.operate.time)) {
              openFailedNotification(`检查点 ${i} 等待时间请输入正整数，如：10！`);
              return null;
            }
          }
        }

        /* 检查测试用例检查点 */

        for(let i = 0; i < body.testCaseCheckPoint.length; i++) {
          let item  = body.testCaseCheckPoint[i];

          // 查找元素
          if(item.operateType === "elements") {
            if(item.operate.using != "class name" && item.operate.value === "") {
              openFailedNotification(`检查点 ${i} 请输入内容！`);
              return null;
            }
            // else {
            //   if(item.operate.using === "class name") {
            //     body.testCaseCheckPoint[i].operate.type = `XCUIElementType${item.operate.type}`;
            //   }else if(item.operate.using === "link text" || item.operate.using === "partial link text") {
            //     body.testCaseCheckPoint[i].operate.value = `${item.operate.attribute}=${item.operate.value}`;
            //   }else if(item.operate.using === "xpath") {
            //     body.testCaseCheckPoint[i].operate.value =
            //         `//XCUIElementType${item.operate.type}[@${item.operate.attribute}='${item.operate.value}']`;
            //   }
            // }
          }

          // 指定元素属性获取属性值
          if(item.operateType === "attribute") {
            if(item.operate.id.length != 36) {
              openFailedNotification(`检查点 ${i} 请检查元素id是否正确！`);
              return null;
            }
          }
        }

        logger.debug(tag, "body:", body);
        return body;
      }

      /**
       * @function onChangeOfForProduct
       * @desc 所属产品下拉框变化监听事件
       */
      const onChangeOfForProduct = (value, option) => {
        logger.redundancy(tag, "exec function onChangeOfForProduct...");
        logger.debug(tag, "value:", value, "option:", option);
        iterationBox(value);
      }

      /**
       * @function onChangeOfOperateType
       * @desc 操作类型下拉框变化监听事件
       * @param value 选中选项value
       * @param option 选中选项option
       */
      const onChangeOfOperateType = (value, option) => {
        logger.redundancy(tag, "exec function onChangeOfOperateType...");
        logger.debug(tag, "value:", value, "option:", option);

        if(testCaseStepIndex === -1) {return;}

        if(value === "pressButton") {
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {};
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {btn: [], info: ""}
        }else if(value === "dragfromtoforduration") {
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {};
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {
            fromX: "",
            fromY: "",
            toX: "",
            toY: "",
            duration: "",
            info: ""
          }
        }else if(value === "touchAndHold") {
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {};
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {
            x: "",
            y: "",
            duration: "",
            info: ""
          }
        }else if(value === "keys") {
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {};
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {
            value: "",
            info: ""
          }
        }else if(value === "elements") {
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {};
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {
            using: [],
            attribute: [],
            type: [],
            value: "",
            info: ""
          }
        }else if(value === "attribute") {
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {};
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {
            id: "",
            attribute: [],
            info: ""
          }
        }else if(value === "click") {
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {};
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {
            id: "",
            info: ""
          }
        }else if(value === "input") {
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {};
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {
            id: "",
            value: "",
            info: ""
          }
        }else if(value === "clear") {
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {};
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {
            id: "",
            info: ""
          }
        }else if(value === "wait") {
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {};
          caseState.value.testCaseSteps[testCaseStepIndex].operate = {
            time: "",
            info: ""
          }
        }

        logger.redundancy(tag, "caseState testCaseStep:", caseState.value.testCaseSteps);
      }

      /**
       * @function onClickOfAddStep
       * @desc 添加步骤按钮点击事件
       */
      const onClickOfAddStep = () => {
        logger.redundancy(tag, "exec function onClickOfAddStep...");
        caseState.value.testCaseSteps.push({operateType: [], operate: {}});
      }

      /**
       * @function onClickOfStepsDel
       * @param index 下标
       */
      const onClickOfStepsDel = (index) => {
        logger.redundancy(tag, "exec function onClickOfStepsDel...");
        caseState.value.testCaseSteps.splice(index, index);
      }

      /**
       * @function onFocusOfOperateType
       * @desc 操作类型下拉框获得焦点监听事件
       * @param index caseState item
       */
      const onFocusOfOperateType = (index) => {
        logger.redundancy(tag, "exec function onFocusOfOperateType...");
        logger.debug(tag, "index:", index);
        testCaseStepIndex = index;
      }

      /**
       * @function onClickOfAddStepOfCheckPoint
       * @desc 添加步骤按钮点击事件
       */
      const onClickOfAddStepOfCheckPoint = () => {
        logger.redundancy(tag, "exec function onClickOfAddStepOfCheckPoint...");
        caseState.value.testCaseCheckPoint.push({operateType: [], operate: {}});
      }

      /**
       * @function onClickOfCheckPointDel
       * @param index 下标
       */
      const onClickOfCheckPointDel = (index) => {
        logger.redundancy(tag, "exec function onClickOfCheckPointDel...");
        caseState.value.testCaseCheckPoint.splice(index, index);
      }

      /**
       * @function onChangeOfOperateTypeOfCheckPoint
       * @desc 操作类型下拉框变化监听事件
       * @param value 选中选项value
       * @param option 选中选项option
       */
      const onChangeOfOperateTypeOfCheckPoint = (value, option) => {
        logger.redundancy(tag, "exec function onChangeOfOperateTypeOfCheckPoint...");
        logger.debug(tag, "value:", value, "option:", option);

        if(testCaseStepIndex === -1) {return;}

        if(value === "elements") {
          caseState.value.testCaseCheckPoint[testCaseCheckPointIndex].operate = {};
          caseState.value.testCaseCheckPoint[testCaseCheckPointIndex].operate = {
            using: [],
            attribute: [],
            type: [],
            value: "",
            info: ""
          }
        }else if(value === "attribute") {
          caseState.value.testCaseCheckPoint[testCaseCheckPointIndex].operate = {};
          caseState.value.testCaseCheckPoint[testCaseCheckPointIndex].operate = {
            id: "",
            attribute: [],
            info: ""
          }
        }
      }

      /**
       * @function onFocusOfOperateTypeOfCheckPoint
       * @desc 操作类型下拉框获得焦点监听事件
       * @param index caseState item
       */
      const onFocusOfOperateTypeOfCheckPoint = (index) => {
        logger.redundancy(tag, "exec function onFocusOfOperateTypeOfCheckPoint...");
        logger.debug(tag, "index:", index);
        testCaseCheckPointIndex = index;
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
              openFailedNotification(data.message);
            }
          }else {
            openFailedNotification(strings.undefined_error);
          }
        }).catch((err) => {
          logger.error(tag, "err:", err);
          openFailedNotification(strings.undefined_error);
        }).finally(() => {
          logger.redundancy(tag, "call proBoxApi complete!");
        })
      }

      /**
       * @function envBox
       * @desc 查询环境列表
       */
      const envBox = () => {
        logger.redundancy(tag, "exec function envBox...");

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
              openFailedNotification(data.message);
            }
          }else {
            openFailedNotification(strings.undefined_error);
          }
        }).catch((err) => {
          logger.error(tag, "err:", err);
          openFailedNotification(strings.undefined_error);
        }).finally(() => {
          logger.redundancy(tag, "call envBoxApi complete!");
        })
      }

      /**
       * @function groupBox
       * @desc 查询分组列表
       */
      const groupBox = () => {
        logger.redundancy(tag, "exec function groupBox...");

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
              openFailedNotification(data.message);
            }
          }else {
            openFailedNotification(strings.undefined_error);
          }
        }).catch((err) => {
          logger.error(tag, "err:", err);
          openFailedNotification(strings.undefined_error);
        }).finally(() => {
          logger.redundancy(tag, "call groupBoxApi complete!");
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

      /**
       * @function caseAdd
       * @param body {obect} 请求数据
       * @desc 添加测试用例
       */
      const caseAdd = (body) => {
        logger.redundancy(tag, "exec function caseAdd...");

        caseAddApi(body).then((res) => {
          logger.info(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              openSuccessNotification("添加测试用例成功！");
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
          logger.redundancy(tag, "call caseAddApi complete!")
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
        elementTypeOptions,
        operateTypeOptionsOfCheckPoint,
        onClickOfRefresh,
        onCliickOfBack,
        onCliickOfSave,
        onChangeOfForProduct,
        onChangeOfOperateType,
        onFocusOfOperateType,
        onClickOfAddStep,
        onClickOfStepsDel,
        onClickOfAddStepOfCheckPoint,
        onClickOfCheckPointDel,
        onChangeOfOperateTypeOfCheckPoint,
        onFocusOfOperateTypeOfCheckPoint,
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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    background-color: white;
    margin-left: 5px;
    padding: 10px 10px;
  }
</style>