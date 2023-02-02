<template>
  <a-layout class="page-guide-card-layout">
    <a-breadcrumb>
      <a-breadcrumb-item>产品</a-breadcrumb-item>
      <a-breadcrumb-item>列表</a-breadcrumb-item>
    </a-breadcrumb>
    <span>您可以在此页面查阅到产品相关的信息！</span>
  </a-layout>
  <a-layout class="page-search-card-layout">
    <a-input-search
        v-model:value="value"
        placeholder="请输入产品名称"
        enter-button="搜索"
        size="default"
        @search="onSearch"
        style="width: 300px"/>
  </a-layout>
  <a-layout class="page-table-card-layout">
    <a-table :columns="tableState.columns" :dataSource="tableState.data" style="width: 100%;">
      <template #bodyCell="{column, record}">
        <template v-if="column.key === 'action'">
          <a @click="onClickOfDetails(record.id)">详情</a>
        </template>
      </template>
    </a-table>
  </a-layout>
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";
import logger from "../../utils/logger";
import {proListApi} from "../../api/goautapi";
import {openFailedNotification} from "../../components/notification";
import strings from "../../assets/strings";
import timeUtils from "../../utils/timeUtils";

  const tag = "/index/product/list";

  export default defineComponent({
    name: "List",
    setup() {
      const instance = getCurrentInstance();

      const value = ref("");
      const onSearch = (searchValue) => {
        console.log('use value', searchValue);
        console.log('or use this.value', value.value);
        proList(getQueryParams());
      };

      // state: 表格数据
      const tableState = ref({
        columns: [
          {title: '产品名称', dataIndex: 'name', key: 'name'},
          {title: '产品描述', dataIndex: 'desc', key: 'desc'},
          {title: '平台类型', key: 'platform', dataIndex: 'platform'},
          {title: '创建时间', key: 'createTime', dataIndex: 'createTime'},
          {title: '更新时间', key: 'updateTime', dataIndex: 'updateTime'},
          {title: "操作", key: "action", dataIndex: "action"}
        ],
        data: []
      });

      /**
       * @function onClickOfDetails
       * @desc 表格详情点击事件
       * @param id number 产品id
       */
      const onClickOfDetails = (id) => {
        instance.proxy.$router.push(`/index/product/details/${id}`);
      };

      onMounted(() => {
        proList(getQueryParams());
      });

      /**
       * @function getQueryParams
       * @desc 获取查询参数
       * @return {{type: UnwrapRef<*[]>, status: UnwrapRef<*[]>}}
       */
      const getQueryParams = () => {
        logger.redundancy(tag, "exec function getQueryParams...");

        let params = {
          pageNum: 1,
          pageSize: 10
        };
        if(!(value.value === "")) {
          params.name = value.value;
        }

        return params;
      }

      /**
       * @function proList
       * @desc 分页查询产品列表
       * @param params {object} 请求参数
       */
      const proList = (params) => {
        proListApi(params).then((res) => {
          logger.info(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              let arr = data.data.data;
              for(let i = 0; i < arr.length; i++) {
                let item = {
                  id: arr[i].ID,
                  key: i,
                  name: arr[i].name,
                  desc: arr[i].description,
                  platform: arr[i].platformType,
                  createTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].CreatedAt),
                  updateTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].UpdatedAt),
                  action: ['详情']
                };
                tableState.value.data.push(item);
              }
            }else {
              openFailedNotification(data.msg);
            }
          }else {
            openFailedNotification(strings.undefined_error);
          }
        }).catch((err) => {
          openFailedNotification(strings.undefined_error);
        }).finally(() => {
          logger.info(tag, "call proListApi complete!")
        });
      };

      return {
        tableState,
        value,
        onSearch,
        onClickOfDetails
      }
    },
  })
</script>

<style scoped>
  .page-guide-card-layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    background: #ffffff;
    width: 100%;
    height: 60px;
    padding: 0 10px;
  }
  .page-search-card-layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    background: #ffffff;
    width: 100%;
    padding: 10px 10px;
    margin-top: 10px;
  }
  .page-table-card-layout {
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