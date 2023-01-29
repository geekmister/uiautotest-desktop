<template>
  <!-- 导航 -->
  <div class="page-guide-card-div">
    <div class="page-guide-card-div-left">
      <a-breadcrumb>
        <a-breadcrumb-item>后台</a-breadcrumb-item>
        <a-breadcrumb-item>权限管理</a-breadcrumb-item>
      </a-breadcrumb>
      <span>您可以在此页面添加角色、查阅角色、编辑角色等相关操作！</span>
    </div>
    <div class="page-guide-card-div-right">
      <a-button type="primary" @click="onClickOfAdd">添加角色</a-button>
    </div>
  </div>
  <!-- 搜索 -->
  <div class="page-search-card-div">
    <div class="page-search-card-row-div">
      <div>
        <span>选择状态：</span>
        <a-select v-model:value="searchState.status" class="page-search-card-item"
                  placeholder="请选择状态" :options="statusOptions"></a-select>
      </div>
      <div>
        <span>角色名称：</span>
        <a-input
            v-model:value="searchState.roleName" placeholder="请输入角色名称" size="default"
            class="page-search-card-item"/>
      </div>
    </div>
    <div class="page-search-card-btn-div">
      <a-button type="primary" class="margin-right-10" @click="onClickOfEmpty">清空</a-button>
      <a-button type="primary" @click="onClickOfSearch">搜索</a-button>
    </div>
  </div>
  <!-- 表格 -->
  <div class="page-table-card-div">
    <a-table :columns="tableState.columns" :dataSource="tableState.data" style="width: 100%;">
      <template #bodyCell="{column, record}">
        <template v-if="column.key === 'action'">
          <template v-for="item in record.action">
            <a class="margin-right-10" v-if="item === '详情'" v-on:click="onClickOfDetails(record.id)">{{item}}</a>
            <a class="margin-right-10" v-else-if="item === '编辑'" v-on:click="onClickOfEdit(record.id)">{{item}}</a>
            <a class="margin-right-10" v-else-if="item === '删除'" v-on:click="onClickOfDel(record.id)">{{item}}</a>
          </template>
        </template>
      </template>
    </a-table>
  </div>
  <!-- drawer: 添加 -->
  <a-drawer v-model:visible="drawerState.visibleAdd" title="添加角色" placement="right"
            @after-visible-change="afterVisibleChangeAdd" size="large">
    <template #extra>
      <a-button type="primary" @click="onClickOfAddSave">保存</a-button>
    </template>
    <a-form
        ref="add" :model="formState" name="roleForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
        autocomplete="off">
      <div class="tag">基本信息</div>
      <a-form-item
          label="角色名称" name="name" :rules="[{ required: true, message: '请输入1-10个长度的角色名称！' }]">
        <a-input placeholder="请输入1-10个长度的角色名称" v-model:value="formState.name"></a-input>
      </a-form-item>
      <a-form-item
          label="角色描述" name="desc" :rules="[{ required: true, message: '请输入1-100个长度的角色描述！' }]">
        <a-textarea
            v-model:value="formState.desc" placeholder="请填写角色描述(最多100个字)"
            :auto-size="{ minRows: 2, maxRows: 5 }"/>
      </a-form-item>
      <a-form-item
          label="状态" name="status" :rules="[{ required: true, message: '请选择状态！' }]">
        <a-select v-model:value="formState.status" :options="statusOptions"
                  placeholder="请选择状态">
        </a-select>
      </a-form-item>
    </a-form>
    <div class="tag">配置权限</div>
    <div class="jur-div margin-left-40 margin-top-20">
      <a-checkbox-group style="margin-top: 10px" v-model:value="jurState.check" :options="jurState.options"/>
    </div>
  </a-drawer>
  <!-- drawer: 编辑 -->
  <a-drawer v-model:visible="drawerState.visibleEdit" title="编辑角色" placement="right"
            @after-visible-change="afterVisibleChangeEdit" size="large">
    <template #extra>
      <a-button type="primary" @click="onClickOfEditSave">保存</a-button>
    </template>
    <a-form
        ref="edit" :model="formState" name="roleForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
        autocomplete="off">
      <div class="tag">基本信息</div>
      <a-form-item
          label="角色名称" name="name" :rules="[{ required: true, message: '请输入1-10个长度的角色名称！' }]">
        <a-input placeholder="请输入1-10个长度的角色名称" v-model:value="formState.name"></a-input>
      </a-form-item>
      <a-form-item
          label="角色描述" name="desc" :rules="[{ required: true, message: '请输入1-100个长度的角色描述！' }]">
        <a-textarea
            v-model:value="formState.desc" placeholder="请填写角色描述(最多100个字)" :auto-size="{ minRows: 2, maxRows: 5 }"/>
      </a-form-item>
      <a-form-item
          label="状态" name="status" :rules="[{ required: true, message: '请选择状态！' }]">
        <a-select v-model:value="formState.status" placeholder="请选择状态" :options="statusOptions">
        </a-select>
      </a-form-item>
    </a-form>
    <div class="tag">配置权限</div>
    <div class="jur-div margin-left-40 margin-top-20">
      <a-checkbox-group style="margin-top: 10px" v-model:value="jurState.check" :options="jurState.options" />
    </div>
  </a-drawer>
  <!-- drawer: 详情 -->
  <a-drawer v-model:visible="drawerState.visibleDetails" title="角色详情" placement="right"
            @after-visible-change="afterVisibleChangeDetails" size="large">
    <a-form
        :model="formState" name="roleForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
        autocomplete="off">
      <div class="tag">基本信息</div>
      <a-form-item label="角色名称" name="name" :rules="[{ required: true, message: '请输入1-10个长度的角色名称！' }]">
        <a-input :disabled="true" placeholder="请输入1-10个长度的角色名称" v-model:value="formState.name"></a-input>
      </a-form-item>
      <a-form-item label="角色描述" name="desc" :rules="[{ required: true, message: '请输入1-100个长度的角色描述！' }]">
        <a-textarea
            v-model:value="formState.desc" placeholder="请填写角色描述(最多100个字)"
            :auto-size="{ minRows: 2, maxRows: 5 }" :disabled="true"/>
      </a-form-item>
      <a-form-item label="状态" name="status" :rules="[{ required: true, message: '请选择状态！' }]">
        <a-select :disabled="true" v-model:value="formState.status" placeholder="请选择状态" :options="statusOptions">
        </a-select>
      </a-form-item>
      <div class="tag">配置权限</div>
      <div class="jur-div margin-left-40 margin-top-20">
        <a-checkbox-group style="margin-top: 10px" v-model:value="jurState.check" :options="jurState.options" />
      </div>
    </a-form>
  </a-drawer>
</template>

<script>
  import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";
  import {useRouter} from "vue-router";

  import {addRoleApi, delRoleApi, editRoleApi, roleDetailsApi, roleListApi, routeListApi} from "../../api/goautapi";
  import logger from "../../utils/logger";
  import {openFailedNotification, openSuccessNotification, openWarnNotification} from "../../components/notification";
  import strings from "../../assets/strings";

  const tag = "/index/adm/JurisdictionAdm";
  const router = useRouter();

  export default defineComponent({
    name: "JurisdictionAdm",
    props: ["id"],
    setup(props, ctx) {
      const instance = getCurrentInstance();

      /* 生命周期函数 */

      onMounted(() => {
        logger.redundancy(tag, "exec function onMounted...");

        roleList();
      });

      /* state等相关数据 */

      // state: 搜索数据
      const searchState = ref({
        status: [], roleName: ""
      });

      // state: 列表页表格数据
      const tableState = ref({
        data: [],
        columns: [
          {title: '角色名称', dataIndex: 'roleName', key: 'roleName'},
          {title: '角色描述', dataIndex: 'roleDesc', key: 'roleDesc'},
          {title: '状态', key: 'status', dataIndex: 'status'},
          {title: "操作", key: "action", dataIndex: "action"}
        ]
      })

      // state: drawer数据
      const drawerState = ref({
        visibleAdd: false,
        visibleEdit: false,
        visibleDetails: false,
      });

      // state: 角色表单数据
      const formState = ref({
        id: 0, name: "", desc: "", status: [],
      });

      // state: 权限列表数据
      const jurState = ref({
            data: [],
            check: [],
            options: []
      })

      // options: 状态options
      const statusOptions = ref([{label: "已启用", value: 0}, {label: "已禁用", value: 1}]);

      /* 人机交互事件 */

      /**
       * @function afterVisibleChangeOfAdd
       * @desc 添加角色抽屉显示/隐藏的回调函数
       * @param bool boolean
       */
      const afterVisibleChangeAdd = (bool) => {
        logger.redundancy("visibleAdd", bool);

        if(bool) {routeList();}

        if(!bool) {
          jurState.value.data = [];
          jurState.value.check = [];
          jurState.value.options = [];
        }
      };

      /**
       * @function afterVisibleChangeOfEdit
       * @desc 编辑角色抽屉显示/隐藏的回调函数
       * @param bool boolean
       */
      const afterVisibleChangeEdit = (bool) => {
        logger.redundancy("visibleEdit", bool);

        if(!bool) {
          jurState.value.data = [];
          jurState.value.check = [];
          jurState.value.options = [];
        }
      };

      /**
       * @function afterVisibleChangeOfDetails
       * @desc 角色详情抽屉显示/隐藏的回调函数
       * @param bool boolean
       */
      const afterVisibleChangeDetails = (bool) => {
        logger.redundancy("visibleDetails", bool);

        if(!bool) {
          jurState.value.data = [];
          jurState.value.check = [];
          jurState.value.options = [];
        }
      }

      /**
       * @function onClickOfSearch
       * @desc 点击搜索事件
       */
      const onClickOfSearch = () => {
        logger.redundancy(tag, "exec function onClickOfSearch...");

        roleList();
      }

      /**
       * @function onClickOfEmpty
       * @desc 点击清空事件
       */
      const onClickOfEmpty = () => {
        logger.redundancy(tag, "exec function onClickOfEmpty...");

        searchState.value.status = [];
        searchState.value.roleName = "";
      }

      /**
       * @function onClickOfAdd
       * @desc 点击添加角色事件
       */
      const onClickOfAdd = () => {
        logger.redundancy(tag, "exec function onClickOfAdd...");

        drawerState.value.visibleAdd = true;
      }

      /**
       * @function onClickOfAddSave
       * @desc 点击添加角色保存按钮事件
       */
      const onClickOfAddSave = () => {
        logger.redundancy(tag, "exec function onClickOfAddSave...");

        addRole();
      }

      /**
       * @function onClickOfEdit
       * @desc 点击编辑事件
       * @param id {number} 角色id
       */
      const onClickOfEdit = (id) => {
        logger.redundancy(tag, "exec function onClickOfEdit...");

        drawerState.value.visibleEdit = true;
        getRole(id);
      }

      /**
       * @function onClickOfEditSave
       * @desc 点击编辑角色保存按钮事件
       */
      const onClickOfEditSave = () => {
        logger.redundancy(tag, "exec function onClickOfEditSave...");

        editRole();
      }

      /**
       * @function onClickOfDetails
       * @desc 点击详情按钮事件
       * @param id {number} 角色id
       */
      const onClickOfDetails = (id) => {
        logger.redundancy(tag, "exec function onClickOfDetails...");

        drawerState.value.visibleDetails = true;
        getRole(id);
      }

      /**
       * @function onClickOfDel
       * @desc 点击删除按钮事件
       * @param id {number} 角色id
       */
      const onClickOfDel = (id) => {
        logger.redundancy(tag, "exec function onClickOfDel...");

        delRole(id);
      }

      /* 接口对接函数 */

      /**
       * @function routeList
       * @desc 获取所有路由信息
       */
      const routeList = () => {
        logger.redundancy(tag, "exec function routeList...");

        routeListApi().then((res) => {
          logger.info(tag, "res:", res);
          if(res.data.code === 200) {
            let data = res.data.data;
            jurState.value.data = data;
            for (let i = 0; i < data.length; i++) {
              jurState.value.options.push({
                label: data[i].name,
                value: data[i].ID
              });
            }
          }else {
            openFailedNotification(res.data.message);
          }
        }).catch((err) => {
          logger.error(tag, "err", err);
          openFailedNotification(err);
        }).finally(() => {
          logger.info(tag, "call routeList api complete!");
        });
      };

      /**
       * @function getSearchParams
       * @desc 获取查询参数对象
       */
      const getSearchParams = () => {
        logger.redundancy(tag, "exec function getSearchParams...");

        let params = {pageNum: 1, pageSize: 10};
        if(!(searchState.value.status instanceof Array)) {
          params.disabled = searchState.value.status;
        }
        if(!(searchState.value.roleName === "")) {
          params.searchKey = searchState.value.roleName;
        }
        logger.debug(tag, "params:", params);

        return params;
      }

      /**
       * @function roleList
       * @desc 分页查询角色信息
       */
      const roleList = () => {
        logger.redundancy(tag, "exec function getRoleList...");

        roleListApi(getSearchParams()).then((res) => {
          logger.info(tag, "res:", res);
          if (res.status === 200) {
            let data = res.data;
            if (data.code === 200){
              let arr = data.data.data;
              tableState.value.data = [];
              if(arr.length > 0) {
                for(let i = 0; i < arr.length; i++) {
                  tableState.value.data.push({
                    key: i,
                    id: arr[i].ID,
                    roleName: arr[i].name,
                    roleDesc: arr[i].description,
                    status: arr[i].disabled === 0 ? "已启用" : arr[i].disabled === 1 ? "已禁用" : "",
                    action: ['详情', "编辑", "删除"]
                  });
                }
                logger.debug(tag, "tableState:", tableState);
              }
            }else {
              openFailedNotification(data.message);
            }
          }else {
            openFailedNotification(strings.undefined_error);
          }
        }).catch((err) => {
          logger.error(tag, "err:", err);
          if(err.status === 401) {
            router.push("/login");
          }else {
            openFailedNotification(strings.undefined_error);
          }
        }).finally(() => {
          logger.info(tag, "call roleList api complete!");
        });
      }

      /**
       * @function addRole
       * @desc 添加角色
       */
      const addRole = () => {
        logger.redundancy(tag, "exec addRole function...");

        instance.refs["add"].validateFields().then((data) => {
          logger.info(tag, "data: ", data);
          let body = {
            role: {
              name: "",
              description: "",
              disabled: 0,
            },
            routeIds: []
          }
          body.role.name = data.name;
          body.role.description = data.desc;
          body.role.disabled = data.status;
          if(jurState.value.check.length === 0) {
            openWarnNotification("请勾选权限！");
            return;
          }
          for(let i = 0; i < jurState.value.check.length; i++) {
            body.routeIds.push(jurState.value.check[i]);
          }
          addRoleApi(body).then((res) => {
            logger.info(tag, "res:", res);
            if (res.status === 200) {
              let data = res.data;
              if (data.code === 200) {
                openSuccessNotification("添加角色成功！");
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
            logger.info(tag, "call addRole api complete!")
          })
        }).catch((err) => {
          logger.error(tag, "err: ", err);
        }).finally(() => {
          logger.info(tag, "call validateFields function complete!")
        })
      };

      /**
       * @function editRole
       * @desc 编辑角色
       */
      const editRole = () => {
        logger.redundancy(tag, "exec editRole function...");

        instance.refs["edit"].validateFields().then((data) => {
          logger.info(tag, "data: ", data);
          let body = {
            role: {
              id: formState.value.id,
              name: "",
              description: "",
              disabled: 0,
            },
            routeIds: []
          }
          body.role.name = data.name;
          body.role.description = data.desc;
          body.role.disabled = data.status;
          logger.debug(tag, "check:", jurState.value.check);
          body.routeIds = jurState.value.check;

          editRoleApi(body).then((res) => {
            logger.info(tag, "res:", res);
            if (res.status === 200) {
              let data = res.data;
              if (data.code === 200) {
                openSuccessNotification("编辑角色成功！");
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
            logger.info(tag, "call addRole api complete!")
          })
        }).catch((err) => {
          logger.error(tag, "err: ", err);
        }).finally(() => {
          logger.info(tag, "call validateFields function complete!")
        })
      }

      /**
       * @function getRole
       * @param id {number} 角色id
       */
      const getRole = (id) => {
        logger.redundancy(tag, "exec getRole function...");

        routeListApi().then((res) => {
          logger.info(tag, "res:", res);
          if(res.data.code === 200) {
            let data = res.data.data;
            jurState.value.data = data;
            for (let i = 0; i < data.length; i++) {
              jurState.value.options.push({
                label: data[i].name,
                value: data[i].ID
              });
            }
          }else {
            openFailedNotification(res.data.message);
          }
        }).catch((err) => {
          logger.error(tag, "err", err);
          openFailedNotification(err);
        }).finally(() => {
          logger.info(tag, "call routeList api complete!");
        });

        let params = {id: id}
        roleDetailsApi(params).then((res) => {
          logger.info(tag, "res:", res);
          if(res.status === 200) {
            let data = res.data;
            if(data.code === 200) {
              formState.value.id = data.data.role.ID;
              formState.value.name = data.data.role.name;
              formState.value.desc = data.data.role.description;
              formState.value.status = data.data.role.disabled;
              logger.debug(tag, "routeIds:", data.data.routeIds);
              if(data.data.routeIds != null && data.data.routeIds.length > 0) {
                for(let i = 0; i < data.data.routeIds.length; i++) {
                  jurState.value.check.push(data.data.routeIds[i]);
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
          logger.info("call roleDetailsApi function complete!")
        })
      }

      /**
       * @function delRole
       * @param id {number} 角色id
       */
      const delRole = (id) => {
        logger.redundancy(tag, "exec delRole function...");

        let body = {id: id};

        delRoleApi(body).then((res) => {
          logger.info(tag, "res:", res);
          if(res.status === 200) {
            let data = res.data;
            if(data.code === 200) {
              openSuccessNotification("删除角色成功！");
              roleList();
            }else {
              openFailedNotification(data.message);
            }
          }else {
            openFailedNotification(data.msg);
          }
        }).catch((err) => {
          logger.error(tag, "err", err);
          openFailedNotification(err);
        }).finally(() => {
          logger.info(tag, "call delRoleApi api complete!");
        });
      };

      return {
        searchState,
        tableState,
        drawerState,
        formState,
        jurState,
        statusOptions,
        afterVisibleChangeAdd,
        afterVisibleChangeEdit,
        afterVisibleChangeDetails,
        onClickOfSearch,
        onClickOfEmpty,
        onClickOfAdd,
        onClickOfAddSave,
        onClickOfEdit,
        onClickOfEditSave,
        onClickOfDetails,
        onClickOfDel
      }
    }
  })
</script>

<style scoped>
  .page-search-card-div {
    display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; padding: 10px 10px;
    width: 100%; margin-top: 10px;background: #ffffff;
  }
  .page-search-card-row-div {
    display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap;
  }
  .page-search-card-btn-div {
    display: flex; flex-direction: row; justify-content: flex-end; align-items: center;width: 100%; margin-top: 10px;
  }
  .page-search-card-item {
    width: 180px;
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
  .tag {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    width: 100%;
    margin-left: 10px;
    padding-left: 10px;
    border-left-color: #1890ff;
    border-left-width: 4px;
    border-left-style: solid;
  }
</style>