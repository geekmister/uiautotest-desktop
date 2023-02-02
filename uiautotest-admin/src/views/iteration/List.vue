<template>
  <div class="page-guide-card-div">
    <a-breadcrumb>
      <a-breadcrumb-item>迭代</a-breadcrumb-item>
      <a-breadcrumb-item>列表</a-breadcrumb-item>
    </a-breadcrumb>
    <span>您可以在此页面查阅到迭代相关的信息！</span>
  </div>
  <div class="page-search-card-div">
    <div>
      <span>所属产品：</span>
      <a-select v-model:value="forProductValue" placeholder="请选择所属产品"
                class="search-item-common" :options="proOptions"></a-select>
    </div>
    <a-input-search
        v-model:value="value"
        placeholder="请输入迭代名称"
        enter-button="搜索"
        size="default"
        @search="onSearch"
        class="search-item-search"/>
  </div>
  <div class="page-table-card-div">
    <a-table :columns="tableState.columns" :dataSource="tableState.data" style="width: 100%;">
      <template #bodyCell="{column, record}">
        <template v-if="column.key === 'action'">
          <a @click="onClickOfDetails(record.id)">详情</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
  import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";

  import logger from "../../utils/logger";
  import {iteraListApi, proBoxApi} from "../../api/goautapi";
  import {openFailedNotification} from "../../components/notification";
  import strings from "../../assets/strings";
  import timeUtils from "../../utils/timeUtils";

  const tag = "/index/Iteration/List";

  export default defineComponent({
    name: "List",
    setup() {
      const instance = getCurrentInstance();

      // options: 产品列表
      const proOptions = ref([]);

      // state: 表格数据
      const tableState = ref({
        columns: [
          {title: '迭代名称', dataIndex: 'name', key: 'name'},
          {title: '迭代描述', dataIndex: 'desc', key: 'desc'},
          {title: '创建时间', key: 'createTime', dataIndex: 'createTime'},
          {title: '更新时间', key: 'updateTime', dataIndex: 'updateTime'},
          {title: '所属产品', key: 'forProduct', dataIndex: 'forProduct'},
          {title: '操作', key: 'action', dataIndex: 'action'}
        ],
        data: []
      });

      const value = ref("");
      const forProductValue = [];
      const onSearch = (searchValue) => {
        console.log('use value', searchValue);
        console.log('or use this.value', value.value);
        iteraList(getQueryParams());
      };

      /**
       * @function onClickOfDetails
       * @desc 迭代详情点击事件
       * @param id {number} 迭代id
       */
      const onClickOfDetails = (id) => {
        instance.proxy.$router.push(`/index/iteration/details/${id}`);
      };

      onMounted(() => {
        proBox();

        iteraList(getQueryParams());
      });

      /**
       * @function proList
       * @desc 获取产品列表
       * @param params {object} 请求参数
       */
      const proBox = () => {
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
                proOptions.value.push(item);
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
      };

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
        if(!(forProductValue instanceof Array)) {
          params.productId = forProductValue.value;
        }

        logger.debug(tag, "params:", params);
        return params;
      }

      /**
       * @function iteraList
       * @desc 分页查询迭代信息
       * @param params {object} 请求参数
       */
      const iteraList = (params) => {
        iteraListApi(params).then((res) => {
          logger.debug(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200) {
              let arr = data.data.data;
              if(arr != null && arr.length > 0) {
                tableState.value.data = [];
                for(let i = 0; i < arr.length; i++) {
                  let item = {
                    id: arr[i].ID,
                    key: i,
                    name: arr[i].name,
                    desc: arr[i].description,
                    createTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].CreatedAt),
                    updateTime: timeUtils.timeStrOfISO8601ToYMDHMS(arr[i].UpdatedAt),
                    forProduct: arr[i].Product.name,
                    action: ['详情']
                  };
                  tableState.value.data.push(item);
                }
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
          logger.info(tag, "call iteraListApi complete!")
        });
      };

      return {
        proOptions,
        tableState,
        value,
        onSearch,
        forProductValue,
        onClickOfDetails
      }
    },
  })
</script>

<style scoped>
  .page-guide-card-div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    background: #ffffff;
    width: 100%;
    height: 60px;
    padding: 0 10px;
  }
  .page-search-card-div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    width: 100%;
    padding: 10px 10px;
    margin-top: 10px;
  }
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
  .search-item-key {

  }
  .search-item-common {
    width: 180px;
  }
  .search-item-search {
    width: 240px;
  }
</style>