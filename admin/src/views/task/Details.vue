<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>任务大厅</a-breadcrumb-item>
        <a-breadcrumb-item>任务详情</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面查阅任务！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button class="margin-right-10" @click="onClickOfBack">返回</a-button>
    </div>
  </div>
  <!-- 内容 -->
  <div class="content-lr-div">
    <div class="content-lr-left-div">
      <span>任务信息</span>
      <a-form :model="formState" name="taskForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
              autocomplete="off" style="margin-top: 20px">
        <a-form-item
            label="任务名称" name="name" :rules="[{ required: true, message: '请输入1-10个长度的任务名称！' }]">
          <a-input :disabled=true placeholder="请输入1-10个长度的任务名称" v-model:value="formState.name"></a-input>
        </a-form-item>
        <a-form-item
            label="任务描述" name="desc" :rules="[{ required: true, message: '请输入1-100个长度的任务描述！' }]">
          <a-textarea :disabled=true v-model:value="formState.desc" placeholder="请填写任务描述(最多100个字)"
                      :auto-size="{ minRows: 2, maxRows: 5 }"/>
        </a-form-item>
        <a-form-item label="所属产品" name="forProduct" :rules="[{ required: true, message: '请选择所属产品！' }]">
          <a-select :disabled=true placeholder="请选择所属产品" v-model:value="formState.forProduct" :options="proBoxOptions">
          </a-select>
        </a-form-item>
        <a-form-item label="所属分组" name="forGroup" :rules="[{ required: true, message: '请选择所属分组！' }]">
          <a-select :disabled=true placeholder="请选择所属分组" v-model:value="formState.forGroup"
                    :options="groupBoxOptions"></a-select>
        </a-form-item>
        <a-form-item label="所属迭代" name="forIteration" :rules="[{ required: true, message: '请选择所属迭代！' }]">
          <a-select :disabled=true placeholder="请选择所属迭代" v-model:value="formState.forIteration"
                    :options="iterationBoxOptions"></a-select>
        </a-form-item>
        <a-form-item label="任务时效" name="aging" :rules="[{ required: true, message: '请选择任务时效！' }]">
          <a-select :disabled=true placeholder="请选择任务时效" v-model:value="formState.aging" :options="execTypeBoxOptions"></a-select>
        </a-form-item>
        <a-form-item label="选择设备" name="device" :rules="[{ required: true, message: '请选择设备！' }]">
          <a-select :disabled=true placeholder="请选择设备" v-model:value="formState.device" :options="devicesBosOptions"></a-select>
        </a-form-item>
        <a-form-item label="测试环境" name="device" :rules="[{ required: true, message: '请选择测试环境！' }]">
          <a-select :disabled=true placeholder="请选择测试环境" v-model:value="formState.forEnv" :options="envBoxOptions"></a-select>
        </a-form-item>
      </a-form>
    </div>
    <div class="content-lr-right-div">
      <span>关联用例(已选择{{checkboxState.checkedList.length}}条)</span>
      <p style="margin-top: 20px; background-color: #f0f2f5; font-size: 12px; padding: 10px 10px">
        温馨提示：<br/>创建左侧任务信息时，选择所属产品、所属分组、用例状态、所属迭代、选择设备、测试环境后将自动筛选符合条件的测试用例！</p>
      <a-card style="margin-top: 10px" size="small" title="请勾选测试用例">
        <a-checkbox-group :disabled=true style="display: block; margin-left: 20px; margin-right: 20px"
                          v-model:value="checkboxState.checkedList" :options="checkboxState.plainOptions" />
      </a-card>
    </div>
  </div>
</template>

<script>
  import {defineComponent, onMounted, ref, watch} from "vue";
  import {useRouter} from "vue-router";
  import { UploadOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons-vue';

  import {
    caseBoxApi,
    envBoxApi,
    groupBoxApi,
    iteraBoxApi,
    proBoxApi,
    taskDetailsApi
  } from "../../api/goautapi";
  import logger from "../../utils/logger";
  import {openFailedNotification} from "../../components/notification";
  import strings from "../../assets/strings";

  const tag = "/index/task/details";

  export default defineComponent({
    name: "Details",
    props: ["id"],
    setup(props, ctx) {
      const router = useRouter();

      /* 生命周期函数 */

      onMounted(() => {
        proBox();
        groupBox();
        envBox();
        caseBox();
        taskDetails({id: props.id});
      });

      /* state等相关数据 */

      /* state等相关数据 */

      // options: 产品options
      const proBoxOptions = ref([]);

      // options: 业务组options
      const groupBoxOptions = ref([]);

      // options: 迭代options
      const iterationBoxOptions = ref([]);

      // options: 任务类型
      const execTypeBoxOptions = ref([{label: "及时任务", value: 1}, {label: "定时任务", value: 2}]);

      // options: 设备
      const devicesBosOptions = ref([{label: "Android of Huawei", value: "1"}, {label: "iOS of Apple", value: "2"}]);

      // options: 环境options
      const envBoxOptions = ref([]);

      // state: 表单数据
      const formState = ref({
        name: "", desc: "", forProduct: [], forGroup: [], forIteration: [],
        aging: [], device: [], forEnv: [], file: []
      });

      // state: checkbox数据
      const checkboxState = ref({
        plainOptions: [],
        checkedList: []
      });

      /* 人机交互事件 */

      /**
       * @function handleChange
       * @desc 上传文件监听
       * @param info object 信息
       */
      const handleChange = info => {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }

        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      };

      /**
       * @function onClickOfBack
       * @desc 点击返回按钮事件
       */
      const onClickOfBack = () => {
        logger.redundancy(tag, "exec function onClickOfBack...");

        router.push("/index/task/list")
      }

      /* 接口对接函数 */

      /**
       * @function caseDetails
       * @desc 获取任务详情
       * @param params {object} 请求参数
       */
      const taskDetails = (params) => {
        taskDetailsApi(params).then((res) => {
          logger.info(tag, "res:", res);
          if(res.status === 200) {
            let data = res.data;
            if(data.code === 200) {
              formState.value.name = data.data.task.name;
              formState.value.desc = data.data.task.description;
              formState.value.forProduct = data.data.task.productId;
              formState.value.forGroup = data.data.task.workgroupId;
              formState.value.forIteration = data.data.task.iterationId;
              formState.value.aging = data.data.task.execType;
              formState.value.device = data.data.task.deviceId;
              formState.value.forEnv = data.data.task.environmentId;

              checkboxState.value.checkedList = data.data.caseIds;

              iterationBox(formState.value.forProduct);
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
        let params = {
          productId: productId
        }

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
              openFailedNotification(data.msg);
            }
          }else {
            openFailedNotification(strings.undefined_error);
          }
        }).catch((err) => {
          logger.error(tag, "err:", err);
          openFailedNotification(strings.undefined_error);
        }).finally(() => {
          logger.info(tag, "call iteraBoxApi complete!");
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
       * @function caseBox
       * @desc 查询用例列表
       */
      const caseBox = () => {
        logger.redundancy(tag, "exec function caseBox...");

        caseBoxApi().then((res) => {
          logger.debug(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              let arr = data.data;
              for(let i = 0; i < arr.length; i++) {
                let item = {
                  value: arr[i].id,
                  label: arr[i].title
                };
                checkboxState.value.plainOptions.push(item);
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
          logger.info(tag, "call caseBoxApi complete!");
        })
      }

      return {
        formState,
        proBoxOptions,
        groupBoxOptions,
        iterationBoxOptions,
        execTypeBoxOptions,
        devicesBosOptions,
        envBoxOptions,
        checkboxState,
        handleChange,
        onClickOfBack
      }
    },
    components: {
      UploadOutlined, CaretUpOutlined, CaretDownOutlined
    }
  })
</script>

<style scoped>

</style>