<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>任务大厅</a-breadcrumb-item>
        <a-breadcrumb-item>创建任务</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面创建任务，并设置此任务的执行时间！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button class="margin-right-10" @click="onCliickOfBack">返回</a-button>
      <a-button class="margin-right-10" type="primary" @click="onCliickOfSave">保存</a-button>
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
          <a-input placeholder="请输入1-10个长度的任务名称" v-model:value="formState.name"></a-input>
        </a-form-item>
        <a-form-item
            label="任务描述" name="desc" :rules="[{ required: true, message: '请输入1-100个长度的任务描述！' }]">
          <a-textarea v-model:value="formState.desc" placeholder="请填写任务描述(最多100个字)"
                      :auto-size="{ minRows: 2, maxRows: 5 }"/>
        </a-form-item>
        <a-form-item label="所属产品" name="forProduct" :rules="[{ required: true, message: '请选择所属产品！' }]">
          <a-select placeholder="请选择所属产品" v-model:value="formState.forProduct"
                    @change="onChangeOfForProduct" :options="proBoxOptions">
          </a-select>
        </a-form-item>
        <a-form-item label="所属分组" name="forGroup" :rules="[{ required: true, message: '请选择所属分组！' }]">
          <a-select placeholder="请选择所属分组" v-model:value="formState.forGroup"
                    :options="groupBoxOptions"></a-select>
        </a-form-item>
        <a-form-item label="所属迭代" name="forIteration" :rules="[{ required: true, message: '请选择所属迭代！' }]">
          <a-select placeholder="请选择所属迭代" v-model:value="formState.forIteration"
                    :options="iterationBoxOptions"></a-select>
        </a-form-item>
        <a-form-item label="任务时效" name="aging" :rules="[{ required: true, message: '请选择任务时效！' }]">
          <a-select placeholder="请选择任务时效" v-model:value="formState.aging" :options="execTypeBoxOptions"></a-select>
        </a-form-item>
        <a-form-item label="选择设备" name="device" :rules="[{ required: true, message: '请选择设备！' }]">
          <a-select placeholder="请选择设备" v-model:value="formState.device" :options="devicesBoxOptions"></a-select>
        </a-form-item>
        <a-form-item label="测试环境" name="device" :rules="[{ required: true, message: '请选择测试环境！' }]">
          <a-select placeholder="请选择测试环境" v-model:value="formState.forEnv" :options="envBoxOptions"></a-select>
        </a-form-item>
      </a-form>
    </div>
    <div class="content-lr-right-div">
      <span>关联用例(已选择{{checkboxState.checkedList.length}}条)</span>
      <p style="margin-top: 20px; background-color: #f0f2f5; font-size: 12px; padding: 10px 10px">
        温馨提示：<br/>创建左侧任务信息时，选择所属产品、所属分组、用例状态、所属迭代、选择设备、测试环境后将自动筛选符合条件的测试用例！</p>
      <a-card style="margin-top: 10px" size="small" title="请勾选测试用例">
        <template #extra>
          <a-button class="margin-right-10" @click="onCliickOfClear">清除</a-button>
          <a-button type="primary" @click="onCliickOfAll">全选</a-button>
        </template>
        <a-checkbox-group style="display: block; margin-left: 20px; margin-right: 20px"
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
    deviceBoxApi,
    envBoxApi,
    groupBoxApi,
    iteraBoxApi,
    proBoxApi,
    taskAddApi
  } from "../../api/goautapi";
  import logger from "../../utils/logger";
  import {openFailedNotification, openSuccessNotification} from "../../components/notification";
  import strings from "../../assets/strings";

  const tag = "/index/case/Add";

  export default defineComponent({
    name: "Add",
    setup() {
      const router = useRouter();

      /* 生命周期函数 */

      onMounted(() => {
        proBox();
        groupBox();
        envBox();
        caseBox();
        deviceBox();
      });

      /* state等相关数据 */

      // options: 产品options
      const proBoxOptions = ref([]);

      // options: 业务组options
      const groupBoxOptions = ref([]);

      // options: 迭代options
      const iterationBoxOptions = ref([]);

      // options: 任务类型
      const execTypeBoxOptions = ref([
          {label: "及时任务", value: 1}, {label: "定时任务(后续开通)", value: 2, disabled: true}
      ]);

      // options: 设备
      const devicesBoxOptions = ref([]);

      // options: 环境options
      const envBoxOptions = ref([]);

      // state: 表单数据
      const formState = ref({
        name: "", desc: "", forProduct: [], forGroup: [], forIteration: [], aging: [], device: [], forEnv: [], file: []
      });

      // state: checkbox数据
      const checkboxState = ref({
        plainOptions: [],
        checkedList: []
      });

      /* 人机交互事件 */

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
       * @function onCliickOfBack
       * @desc 返回按钮点击事件
       */
      const onCliickOfBack = () => {
        logger.redundancy(tag, "exec function onCliickOfBack...");
        router.push("/index/task/list");
      }

      /**
       * @function onCliickOfSava
       * @desc 保存按钮点击事件
       */
      const onCliickOfSave = () => {
        logger.redundancy(tag, "exec function onCliickOfSave...");
        taskAdd();
      }

      /**
       * @function onCliickOfClear
       * @desc 清除按钮点击事件
       */
      const onCliickOfClear = () => {
        logger.redundancy(tag, "exec function onCliickOfClear...");
        logger.debug(tag, "checkboxState:", checkboxState);
        checkboxState.value.checkedList = [];
        logger.debug(tag, "checkboxState:", checkboxState);
      }

      /**
       * @function onCliickOfAll
       * @desc 全选按钮点击事件
       */
      const onCliickOfAll = () => {
        logger.redundancy(tag, "exec function onCliickOfAll...");
        logger.debug(tag, "checkboxState:", checkboxState);
        checkboxState.value.checkedList = [];
        for(let i = 0; i < checkboxState.value.plainOptions.length; i++) {
          checkboxState.value.checkedList.push(checkboxState.value.plainOptions[i].value);
        }
        logger.debug(tag, "checkboxState:", checkboxState);
      }

      /* 接口对接函数 */

      /**
       * @function proBox
       * @desc 查询产品列表
       */
      const proBox = () => {
        logger.redundancy(tag, "exec function proBox...");

        proBoxApi().then((res) => {
          logger.info(tag, "res:", res);
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
          logger.redundancy(tag, "call proBoxApi complete!");
        })
      }

      /**
       * @function groupBox
       * @desc 查询分组列表
       */
      const groupBox = () => {
        logger.redundancy(tag, "exec function groupBox...");

        groupBoxApi().then((res) => {
          logger.info(tag, "res:", res);
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
          logger.info(tag, "res:", res);
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
          logger.redundancy(tag, "call iteraBoxApi complete!");
        })
      }

      /**
       * @function envBox
       * @desc 查询环境列表
       */
      const envBox = () => {
        logger.redundancy(tag, "exec function envBox...");

        envBoxApi().then((res) => {
          logger.info(tag, "res:", res);
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
          logger.redundancy(tag, "call envBoxApi complete!");
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
          logger.redundancy(tag, "call envBoxApi complete!");
        })
      }

      /**
       * @function deviceBox
       * @desc 获取设备下拉选项
       */
      const deviceBox = () => {
        logger.redundancy(tag, "exec function deviceBox...");

        deviceBoxApi().then((res) => {
          logger.debug(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              let arr = data.data;
              if(arr != null) {
                for(let i = 0; i < arr.length; i++) {
                  let item = {
                    value: arr[i].id,
                    label: arr[i].name,
                    type: arr[i].type
                  };
                  devicesBoxOptions.value.push(item);
                }
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
          logger.redundancy(tag, "call deviceBoxApi complete!");
        })
      }

      /**
       * @function taskAdd
       * @desc 添加测试任务
       */
      const taskAdd = () => {
        logger.redundancy(tag, "exec function taskAdd...");

        let dn = "";
        let dt = "";
        for(let i = 0; i < devicesBoxOptions.value.length; i++) {
          if(formState.value.device === devicesBoxOptions.value[i].value) {
            dn = devicesBoxOptions.value[i].label;
            dt = devicesBoxOptions.value[i].type;
            break;
          }
        }

        let body = {
          task: {
            name: formState.value.name,
            description: formState.value.desc,
            productId: formState.value.forProduct,
            iterationId: formState.value.forIteration,
            environmentId: formState.value.forEnv,
            workgroupId: formState.value.forGroup,
            execType: formState.value.aging,
            deviceId: formState.value.device,
            deviceName: dn,
            deviceType: dt,
            creatorId: 0
          },
          caseIds: checkboxState.value.checkedList,
        };

        taskAddApi(body).then((res) => {
          logger.info(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              openSuccessNotification("添加任务成功！");
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
          logger.redundancy(tag, "call taskAddApi complete!")
        })
      }

      return {
        proBoxOptions,
        groupBoxOptions,
        iterationBoxOptions,
        execTypeBoxOptions,
        devicesBoxOptions,
        envBoxOptions,
        formState,
        checkboxState,
        onChangeOfForProduct,
        onCliickOfBack,
        onCliickOfSave,
        onCliickOfClear,
        onCliickOfAll
      }
    },
    components: {
      UploadOutlined, CaretUpOutlined, CaretDownOutlined
    }
  })
</script>

<style scoped>

</style>