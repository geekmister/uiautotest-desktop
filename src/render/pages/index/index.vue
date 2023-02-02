<template>

  <!-- 父容器 -->
  <div class="container">

    <!-- 右侧面板 -->
    <div class="right-panel">

      <!-- logo区域 -->
      <div class="logo-area">
        <img :src="iconLogo" class="logo-img"/>
        <span class="font-size-14 font-weight-600 font-color-white">UIAUTOTEST</span>
      </div>

      <!-- login区域 -->
      <div class="login-area">
        <span class="font-size-14 font-weight-600 font-color-white">未登录</span>
        <span class="font-size-12 font-weight-400 font-color-white">2021-09-22 10:29</span>
      </div>

      <!-- status区域 -->
      <div class="status-area">
        <div class="status-item">
          <div :class="classConnectionStatus">
            <img :src="iconConnection" class="icon-size-25">
          </div>
          <span class="font-size-12 font-weight-400 font-color-white mtop-5">连接</span>
        </div>
        <div class="status-item">
          <div :class="classServerStatus">
            <img :src="iconServer" class="icon-size-25">
          </div>
          <span class="font-size-12 font-weight-400 font-color-white mtop-5">服务</span>
        </div>
        <div class="status-item">
          <div :class="classWdaStatus">
            <img :src="iconWda" class="icon-size-25">
          </div>
          <span class="font-size-12 font-weight-400 font-color-white mtop-5">WDA</span>
        </div>
      </div>

      <!-- nav区域 -->
      <div class="nav-area">
        <div :class="classNavItemIphoneList" style="margin-top: 20px" v-on:click="handleIphoneListEvent()">
          <img :src="iconIphone" class="icon-size-25 mleft-10"/>
          <span class="font-size-14 font-weight-400 font-color-white mleft-10">手机列表</span>
        </div>
        <div :class="dataSettingShow ? 'nav-item-green' : 'nav-item-grey'"
             style="margin-top: 1px" v-on:click="handleShowSetting()">
          <img :src="iconSysset" class="icon-size-20 mleft-13"/>
          <span class="font-size-14 font-weight-400 font-color-white mleft-12">偏好设置</span>
        </div>
        <div :class="dataTaskManagerShow ? 'nav-item-green nav-item-taskmanager' : 'nav-item-grey nav-item-taskmanager'"
             @click="handleTaskManagerEvent">
          <img :src="iconTask" class="icon-size-17 mleft-15"/>
          <span class="font-size-14 font-weight-400 font-color-white mleft-13">任务管理</span>
          <template v-if="parentData.taskStatus === 1 || parentData.taskStatus === 2">
            <img :src="iconDoing" class="nav-item-taskmanager-doing-icon roate"/>
          </template>
          <template v-else>
            <img :src="iconDoing" class="nav-item-taskmanager-doing-icon"/>
          </template>
        </div>
      </div>

      <!-- ctr区域 -->
      <div class="ctr-area">
        <img class="status-img icon-size-70" :src="iconStatus"/>
        <span class="font-size-14 font-weight-400 font-color-white mtop-50">{{dataStatusTipText}}</span>
        <div
            class="btn-bg font-size-14 font-weight-600 font-color-black mtop-10 btn-pointer"
            v-on:click="handleOnekeyLaunchEvent()">{{dataStatusBtnText}}</div>
      </div>

      <!-- 关闭区域 -->
      <div
          class="close-clint-btn font-size-14 font-weight-600 font-color-white"
          @click="handleCloseClient()">退出客户端</div>
    </div>

    <!-- 开端引导 -->
    <div :class="classOpenGuide">
      <span id="typeText" class="font-size-14 font-weight-400 font-color-white" style="line-height: 30px"></span>
    </div>

    <!-- 错误提示 -->
    <div :class="classErrorArea">
      <span class="font-size-14 font-weight-600 font-color-black error-title">发生错误</span>
      <span class="font-size-12 font-weight-400 font-color-black error-content">{{dataErrorContent}}</span>
      <img :src="iconClose" class="icon-size-20 error-close" v-on:click="handleErrorAreaDisplay(0)">
    </div>

    <!-- 任务清单 -->
    <div :class="classTaskInfo">
      <span class="taskinfo-title font-size-14 font-weight-600 font-color-black">任务清单</span>
      <div class="taskinfo-row mtop-40">
        <span class="font-size-12 font-weight-400 font-color-black left-text">任务id</span>
        <span class="font-size-12 font-weight-400 font-color-black right-text">{{dataTaskInfo.id}}</span>
      </div>
      <div class="taskinfo-row mtop-10">
        <span class="font-size-12 font-weight-400 font-color-black left-text">任务名称</span>
        <span class="font-size-12 font-weight-400 font-color-black right-text">{{dataTaskInfo.name}}</span>
      </div>
      <div class="taskinfo-row mtop-10">
        <span class="font-size-12 font-weight-400 font-color-black left-text">任务描述</span>
        <span class="font-size-12 font-weight-400 font-color-black right-text">{{dataTaskInfo.desc}}</span>
      </div>
      <div class="taskinfo-row mtop-10">
        <span class="font-size-12 font-weight-400 font-color-black left-text">执行环境</span>
        <span class="font-size-12 font-weight-400 font-color-black right-text">{{dataTaskInfo.environment}}</span>
      </div>
      <div class="taskinfo-row mtop-10">
        <span class="font-size-12 font-weight-400 font-color-black left-text">创建者</span>
        <span class="font-size-12 font-weight-400 font-color-black right-text">{{dataTaskInfo.creator}}</span>
      </div>
      <div class="taskinfo-row mtop-10">
        <span class="font-size-12 font-weight-400 font-color-black left-text">所属产品</span>
        <span class="font-size-12 font-weight-400 font-color-black right-text">{{dataTaskInfo.forProduct}}</span>
      </div>
      <div class="taskinfo-row mtop-10">
        <span class="font-size-12 font-weight-400 font-color-black left-text">所属迭代</span>
        <span class="font-size-12 font-weight-400 font-color-black right-text">{{dataTaskInfo.forIteration}}</span>
      </div>
      <div class="taskinfo-row mtop-10">
        <span class="font-size-12 font-weight-400 font-color-black left-text">设备名称</span>
        <span class="font-size-12 font-weight-400 font-color-black right-text">{{dataTaskInfo.deviceName}}</span>
      </div>
      <div class="taskinfo-row mtop-10">
        <span class="font-size-12 font-weight-400 font-color-black left-text">所属业务组</span>
        <span class="font-size-12 font-weight-400 font-color-black right-text">{{dataTaskInfo.forGroup}}</span>
      </div>
      <div class="taskinfo-row mtop-10">
        <span class="font-size-12 font-weight-400 font-color-black left-text">测试用例条数</span>
        <span class="font-size-12 font-weight-400 font-color-black right-text">{{dataTaskInfo.testCases.length}}</span>
      </div>
      <div class="taskinfo-row mtop-10">
        <span class="font-size-12 font-weight-400 font-color-black left-text">UDID</span>
        <span class="font-size-12 font-weight-400 font-color-black right-text">{{dataTaskInfo.udid}}</span>
      </div>
      <div class="denyexec" v-on:click="handleDenyexec()">拒绝执行</div>
      <div class="agreeexec" v-on:click="handleAgreeexec()">同意执行</div>
    </div>

    <!-- 手机列表 -->
    <div :class="classIphoneListArea">
      <span class="font-size-16 font-weight-600 font-color-white mtop-9">手机列表</span>
      <div class="icon-bg-grey iPhone-list-btn-return btn-pointer" v-on:click="handleIphoneListEvent()">
        <img :src="iconReturn" class="icon-size-25" />
      </div>
      <div class="iPhone-list-title-area mtop-30">
        <span class="font-size-14 font-weight-600 font-color-white mleft-10">手机名称</span>
        <span class="font-size-14 font-weight-600 font-color-white mleft-30">连接方式</span>
        <span class="font-size-14 font-weight-600 font-color-white mleft-30">UDID</span>
        <span class="font-size-14 font-weight-600 font-color-white mleft-125">操作</span>
      </div>
      <template v-for="item in dataIphones.value" :key="index">
        <div class="iPhone-list-row">
          <span class="font-size-12 font-weight-400 font-color-white mleft-10 text-overwidth-show" style="width: 76px">{{ item.name }}</span>
          <span class="font-size-12 font-weight-400 font-color-white mleft-10 text-overwidth-show" style="width: 76px">{{ item.connectionType }}</span>
          <span class="font-size-12 font-weight-400 font-color-white mleft-10 text-overwidth-show" style="width: 150px">{{ item.udid }}</span>
          <span class="font-size-12 font-weight-400 font-color-white mleft-10">{{ item.status == "未连接" ? "连接" : "" }}</span>
        </div>
      </template>
    </div>

    <!-- 偏好设置 -->
    <settingComponent v-show="dataSettingShow"
               @receiveChildEvent="receiveChildEvent"></settingComponent>

    <!-- 任务管理 -->
    <taskManagerComponent v-show="dataTaskManagerShow"
                          @receiveChildEvent="receiveChildEvent"></taskManagerComponent>

    <!-- 内容面板 -->
    <div :class="classContentArea">

      <!-- 镜像面板 -->
      <div class="mirror-area">
        <img
            :src="`data:image/png;base64,${dataMirror}`"
            style="width: 450px; height: 800px; cursor: pointer;"
            ondragstart="return false;"
            @click="handleMirrorClickEvent()"
            @mousedown="handleOnMouseDown()"
            @mouseup="handleOnMouseUp()"
            @mousemove="handleOnMouseMove()"/>
        <template v-for="item in dataPageTreeSources" :key="index">
          <div :class="classMirrorVdom" :style="item.style" @click="handleVirtElementClick(item)" :tabindex="item.level"/>
        </template>
      </div>

      <!-- 操作区域 -->
      <div class="operation-area">

        <!-- 控制面板 -->
        <div class="ctr-pannel-area">
          <div class="ctr-label">
            <span class="font-size-14 font-weight-600 font-color-white">控制面板</span>
            <img :src="iconFlod" class="icon-size-20 mleft-5"/>
          </div>
          <div class="ctr-operation-area">
            <div class="ctr-operation-item btn-pointer" v-on:click="handleLoadPageTreeSourcesEvent()">
              <div :class="classMirrorVdomSwitch">
                <img :src="iconVdom" class="icon-size-30"/>
              </div>
              <span class="font-size-12 font-weight-400 font-color-white mtop-5">虚拟DOM</span>
            </div>
            <div class="ctr-operation-item btn-pointer" v-on:click="handleMirrorClickSwitchEvent()">
              <div :class="classMirrorClickSwitch">
                <img :src="iconOperation" class="icon-size-25"/>
              </div>
              <span class="font-size-12 font-weight-400 font-color-white mtop-5">点击事件</span>
            </div>
            <div class="ctr-operation-item btn-pointer" v-on:click="handleMirrorSwipeSwitchEvent()">
              <div :class="classMirrorSwipeSwitch">
                <img :src="iconSwipe" class="icon-size-25"/>
              </div>
              <span class="font-size-12 font-weight-400 font-color-white mtop-5">滑动事件</span>
            </div>
            <div class="ctr-operation-item btn-pointer" v-on:click="handleMirrorPhysicsBtnEvent('home')">
              <div class="icon-bg-grey">
                <img :src="iconHome" class="icon-size-25"/>
              </div>
              <span class="font-size-12 font-weight-400 font-color-white mtop-5">HOME</span>
            </div>
            <div class="ctr-operation-item btn-pointer" v-on:click="handleSwitchLocationBtnEvent()">
              <div :class="dataLocationEventSwitch ? 'icon-bg-green' : 'icon-bg-grey'">
                <img :src="iconLocation" class="icon-size-25"/>
              </div>
              <span class="font-size-12 font-weight-400 font-color-white mtop-5">坐标</span>
            </div>
            <div class="ctr-operation-item btn-pointer" v-on:click="handleSwitchMirrorBtnEvent()">
              <div :class="dataMirrorStatus ? 'icon-bg-green' : 'icon-bg-grey'">
                <img :src="iconMirror" class="icon-size-25"/>
              </div>
              <span class="font-size-12 font-weight-400 font-color-white mtop-5">镜像</span>
            </div>
            <div class="ctr-operation-item btn-pointer" v-on:click="handleMirrorPhysicsBtnEvent('powers')">
              <div class="icon-bg-grey">
                <img :src="iconPower" class="icon-size-25"/>
              </div>
              <span class="font-size-12 font-weight-400 font-color-white mtop-5">电源</span>
            </div>
            <div class="ctr-operation-item btn-pointer" v-on:click="handleMirrorPhysicsBtnEvent('volumeDown')">
              <div class="icon-bg-grey">
                <img :src="iconVolumeDown" class="icon-size-25"/>
              </div>
              <span class="font-size-12 font-weight-400 font-color-white mtop-5">音量-</span>
            </div>
            <div class="ctr-operation-item btn-pointer" v-on:click="handleMirrorPhysicsBtnEvent('volumeUp')">
              <div class="icon-bg-grey">
                <img :src="iconVolumeUp" class="icon-size-25"/>
              </div>
              <span class="font-size-12 font-weight-400 font-color-white mtop-5">音量+</span>
            </div>
          </div>
        </div>

        <!-- 数据区域 -->
        <div class="data-area">

          <!-- 页面节点树 -->
          <div class="page-tree-area">
            <span class="font-size-14 font-weight-600 font-color-white">页面节点树</span>
            <div class="page-tree-content">
              <a-tree
                  :expandedKeys="expandedKeys"
                  :auto-expand-parent="autoExpandParent"
                  :treeData="dataPageTree"
                  @expand="onExpand"
                  @select="onSelect"
                  style="color: #ffffff">
                <template #title="{ title }">
                  <span v-if="title.indexOf(searchValue) > -1" style="color: #ffffff">
                    {{ title.substr(0, title.indexOf(searchValue)) }}
                    <span style="color: #f50">{{ searchValue }}</span>
                    {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
                  </span>
                  <span v-else>{{ title }}</span>
                </template>
              </a-tree>
              <!-- 坐标文本 -->
              <span
                  v-show="dataLocationEventSwitch"
                  class="location-text font-size-14 font-color-white font-weight-400">{{dataLocationText}}</span>
            </div>
          </div>

          <!-- 元素属性表 -->
          <div class="element-table-area">
            <span class="font-size-14 font-weight-600 font-color-white">元素属性表</span>
            <div class="element-table-content">
              <div class="element-table-title">
                <span class="font-size-14 font-weight-600 font-color-white mleft-10 left-text">FInd By</span>
                <span class="font-size-14 font-weight-600 font-color-white right-text">Selector</span>
              </div>
              <div class="element-table-row">
                <span class="font-size-12 font-weight-400 font-color-white mleft-10 left-text">XPath</span>
                <span class="font-size-12 font-weight-400 font-color-white right-text">{{dataElementData.key}}</span>
              </div>
              <div class="divider"/>
              <div class="element-table-title">
                <span class="font-size-14 font-weight-600 font-color-white mleft-10 left-text">Attribute</span>
                <span class="font-size-14 font-weight-600 font-color-white right-text">Value</span>
              </div>
              <div class="element-table-row">
                <span class="font-size-12 font-weight-400 font-color-white mleft-10 left-text">frame</span>
                <span class="font-size-12 font-weight-400 font-color-white right-text">{{dataElementData.frame}}</span>
              </div>
              <div class="divider"/>
              <div class="element-table-row">
                <span class="font-size-12 font-weight-400 font-color-white mleft-10 left-text">isAccessible</span>
                <span class="font-size-12 font-weight-400 font-color-white right-text">{{dataElementData.isAccessible}}</span>
              </div>
              <div class="divider"/>
              <div class="element-table-row">
                <span class="font-size-12 font-weight-400 font-color-white mleft-10 left-text">isEnabled</span>
                <span class="font-size-12 font-weight-400 font-color-white right-text">{{dataElementData.isEnabled}}</span>
              </div>
              <div class="divider"/>
              <div class="element-table-row">
                <span class="font-size-12 font-weight-400 font-color-white mleft-10 left-text">isVisible</span>
                <span class="font-size-12 font-weight-400 font-color-white right-text">{{dataElementData.isVisible}}</span>
              </div>
              <div class="divider"/>
              <div class="element-table-row">
                <span class="font-size-12 font-weight-400 font-color-white mleft-10 left-text">key</span>
                <span class="font-size-12 font-weight-400 font-color-white right-text">{{dataElementData.key}}</span>
              </div>
              <div class="divider"/>
              <div class="element-table-row">
                <span class="font-size-12 font-weight-400 font-color-white mleft-10 left-text">label</span>
                <span class="font-size-12 font-weight-400 font-color-white right-text">{{dataElementData.label}}</span>
              </div>
              <div class="divider"/>
              <div class="element-table-row">
                <span class="font-size-12 font-weight-400 font-color-white mleft-10 left-text">name</span>
                <span class="font-size-12 font-weight-400 font-color-white right-text">{{dataElementData.name}}</span>
              </div>
              <div class="divider"/>
              <div class="element-table-row">
                <span class="font-size-12 font-weight-400 font-color-white mleft-10 left-text">rawIdentifier</span>
                <span class="font-size-12 font-weight-400 font-color-white right-text">{{dataElementData.rawIdentifier}}</span>
              </div>
              <div class="divider"/>
              <div class="element-table-row">
                <span class="font-size-12 font-weight-400 font-color-white mleft-10 left-text">rect</span>
                <span class="font-size-12 font-weight-400 font-color-white right-text">{{dataElementData.rect}}</span>
              </div>
              <div class="divider"/>
              <div class="element-table-row">
                <span class="font-size-12 font-weight-400 font-color-white mleft-10 left-text">title</span>
                <span class="font-size-12 font-weight-400 font-color-white right-text">{{dataElementData.title}}</span>
              </div>
              <div class="divider"/>
              <div class="element-table-row">
                <span class="font-size-12 font-weight-400 font-color-white mleft-10 left-text">type</span>
                <span class="font-size-12 font-weight-400 font-color-white right-text">{{dataElementData.type}}</span>
              </div>
              <div class="divider"/>
              <div class="element-table-row">
                <span class="font-size-12 font-weight-400 font-color-white mleft-10 left-text">value</span>
                <span class="font-size-12 font-weight-400 font-color-white right-text">{{dataElementData.value}}</span>
              </div>
              <div class="divider"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TypeIt from "typeit";
  import {ref} from "vue";
  import {getCurrentInstance, onMounted, onUpdated, onUnmounted} from 'vue';
  import {
    deviceInfo,
    dragfromtoforduration,
    locked, pressBtn,
    screenShot,
    session,
    source,
    status,
    touchAndHold, windowSize
  } from "../../../api/wdaLinks";
  import {data} from "./data";
  import {whetherExec} from "../../../api/operationLinks";
  import settingComponent from "../../components/setting";
  import taskManagerComponent from "../../components/taskManager";

  const app = window.require('electron').app;
  const ipcRenderer = window.require('electron').ipcRenderer;
  const path = window.require("path");
  const tag = "index.vue";
  let pathData = {};

  export default {
    name: "index",
    components: {
      settingComponent,
      taskManagerComponent
    },
    setup(props, context) {

      const instance = getCurrentInstance();

      // 监听页面加载完成启动开端引导打字机
      document.addEventListener("DOMContentLoaded", function () {
        new TypeIt("#typeText", {
          strings:
              ["> 开端引导",
                "Step 零：建议先登录；",
                "Step 一：请将iPhone通过USB连接到电脑，并根据操作提示信任设备（多数出现在首次连接）；",
                "Step 二：点击右侧导航一键启动按钮，如遇错误提示则按照错误提示进行后续操作；",
                "Step 三：当连接、服务、WDA全部变为绿色的时候则代表启动成功；",
                "Step 四：默认连接iPhone列表的第一台设备，如需切换请在手机列表中进行操作；",
                " ",
                " ",
                "* 注意",
                "  1. Windows系统需要自行安装itunes；"],
        }).go();
      });

      // 注册一键启动监听事件
      ipcRenderer.on("oneKeyLaunchResult", (e, args) => {
        console.log(tag, "receive message: oneKeyLaunchResult");
        console.log(tag, "args: " + args);

        let result = JSON.parse(args);
        if(result.status == "SUCCESS") {
          if(result.message == "Connection Success!") {
            instance.data.classConnectionStatus = "icon-bg-green";
          }else if(result.message == "Server Success!") {
            instance.data.classServerStatus = "icon-bg-green";
          }else if(result.message == "WDA Success!") {
            instance.data.dataWdapid = result.wdaPid;
            instance.data.dataIphones.value = result.iphoneList;
            instance.data.classWdaStatus = "icon-bg-green";
            instance.data.iconStatus = require("../../assets/images/icon/status-light@2x.png");
            clearInterval(instance.proxy.launchBreathingLight);
            instance.data.dataStatusTipText = "已启动";
            instance.data.dataStatusBtnText = "一键关闭";
            instance.proxy.handleOpenGuideDisplay(0);
            instance.proxy.handleContentAreaDisplay(1);
            instance.proxy.handleLoadMirror();
            ipcRenderer.send("lanuchHeartBeatTask");
          }
        }else {
          instance.data.dataErrorContent = result.message;
          instance.proxy.handleErrorAreaDisplay(1);
          clearInterval(instance.proxy.launchBreathingLight);
          instance.data.iconStatus = require("../../assets/images/icon/status-normal@2x.png");
          instance.data.dataStatusTipText = "启动失败";
          instance.data.dataStatusBtnText = "重新启动";
          instance.proxy.handleOpenGuideDisplay(1);
          instance.proxy.handleContentAreaDisplay(0);
        }
      });

      // 注册一键关闭操作事件监听
      ipcRenderer.on("oneKeyCloseResult", (e, args) => {
        console.log(tag, "receive message: oneKeyCloseResult");

        let result = JSON.parse(args);
        if(result.status == "SUCCESS") {
          instance.data.classConnectionStatus = "icon-bg-grey";
          instance.data.dataIphones.value = [];
          instance.data.classServerStatus = "icon-bg-grey";
          instance.data.classWdaStatus = "icon-bg-grey";
          instance.data.iconStatus = require("../../assets/images/icon/status-normal@2x.png");
          instance.data.dataStatusTipText = "未启动";
          instance.data.dataStatusBtnText = "一键启动";
          instance.proxy.handleOpenGuideDisplay(1);
          instance.proxy.handleContentAreaDisplay(0);
        }else {
          instance.data.dataErrorContent = result.message;
          instance.data.iconStatus = require("../../assets/images/icon/status-light@2x.png");
          instance.proxy.handleErrorAreaDisplay(1);
        }

        clearInterval(instance.proxy.launchBreathingLight);
        clearInterval(instance.proxy.loadMirror);
        ipcRenderer.send("stopHeartBeatTask");
      });

      // 注册确认任务事件
      ipcRenderer.on("confirmTask", (e, args) => {
        console.log(tag, "receive message: confirmTask", args);
        instance.data.dataTaskInfo = args;
        console.log(tag, "receive message: confirmTask", instance.data.dataTaskInfo);
        instance.data.classTaskInfo = "taskinfo-area";
      });

      // 注册消息快递
      ipcRenderer.on("mainProcess", (event, args) => {
        console.log(tag, "receive message of mainProcess", " args: ", args);

        if(args.event === "receiveSettingData") {
          instance.data.parentData.settingFile = args.settingFile;
        }
        else if(args.event === "renderTaskManager") {
          let data = args.data;

          instance.data.parentData.taskInfo = data.taskInfo;
          instance.data.parentData.testCases = data.testCases;
          instance.data.parentData.taskStatus = 1;
        }
        else if(args.event === "taskProcess") {
          instance.data.parentData.taskProcess = args.data;
          instance.data.parentData.taskStatus = 2;
        }
        else if(args.event === "completeTask") {
          instance.data.parentData.taskStatus = 3;
        }
        else if(args.event === "receivePathData") {
          pathData = args.pathData;
        }
      });

      const expandedKeys = ref([]);
      const searchValue = ref('');
      const autoExpandParent = ref(true);
      const dataList = [];

      const onExpand = keys => {
        expandedKeys.value = keys;
        autoExpandParent.value = false;
      };

      const onSelect = (selectedKeys, info) => {
        let nodeData = info.selectedNodes[0].props.dataRef;
        console.log(tag, "nodeData: ", nodeData);
        instance.proxy.initElementData(nodeData);
      };

      onMounted(() => {

        ipcRenderer.send("index.vue", "getPathData");
      });
      onUpdated(() => {});
      onUnmounted(() => {});

      return {
        expandedKeys,
        searchValue,
        autoExpandParent,
        onExpand,
        onSelect,
        iconClose: require("../../assets/images/icon/close@2x.png"),
      };
    },
    data() {
      return {
        iconLogo: require("../../assets/images/icon/logo@2x.png"),
        iconConnection: require("../../assets/images/icon/connection@2x.png"),
        iconServer: require("../../assets/images/icon/server@2x.png"),
        iconWda: require("../../assets/images/icon/wda@2x.png"),
        iconIphone: require("../../assets/images/icon/iphone@2x.png"),
        iconSysset: require("../../assets/images/icon/sysset@2x.png"),
        iconTask: require("../../assets/images/icon/task@2x.png"),
        iconStatus: require("../../assets/images/icon/status-normal@2x.png"),
        iconClose: require("../../assets/images/icon/close@2x.png"),
        iconFlod: require("../../assets/images/icon/down@2x.png"),
        iconVdom: require("../../assets/images/icon/vdom@2x.png"),
        iconOperation: require("../../assets/images/icon/operation@2x.png"),
        iconHome: require("../../assets/images/icon/home@2x.png"),
        iconPower: require("../../assets/images/icon/power@2x.png"),
        iconVolumeDown: require("../../assets/images/icon/volumeDown@2x.png"),
        iconVolumeUp: require("../../assets/images/icon/volumeUp@2x.png"),
        iconLocation: require("../../assets/images/icon/location@2x.png"),
        iconMirror: require("../../assets/images/icon/mirror@2x.png"),
        iconReturn: require("../../assets/images/icon/return@2x.png"),
        iconSwipe: require("../../assets/images/icon/swipe@2x.png"),
        iconDoing: require("../../assets/images/icon/doing@2x.png"),
        dataMirror: data.normalMirror,
        dataErrorContent: ref(""),
        dataScreenShot: ref(""),
        dataIphones: ref([]),
        dataStatusTipText: ref("未启动"),
        dataStatusBtnText: ref("一键启动"),
        dataWdapid: ref(0),
        dataMirrorEventSwitch: ref(false),
        dataMirrorSwipeEventSwitch: ref(false),
        dataLocationEventSwitch: ref(false),
        dataMirrorStatus: ref(false),
        dataLocationText: ref(""),
        dataSessionId: ref(""),
        dataDragInfo: {
          fromX: 0,
          fromY: 0,
          toX: 0,
          toY: 0,
          duration: 0.200
        },
        dataPageTreeSources: ref([]),
        dataScreenInfo: {
          originWidth: 0,
          originHeight: 0,
          actualWidth: 450,
          actualHeight: 800,
          xScale: 0.00,
          yScale: 0.00
        },
        dataPageTree: ref([]),
        dataElementData: ref({
          frame: "",
          isAccessible: "",
          isEnabled: "",
          isVisible: "",
          key: "",
          label: "",
          name: "",
          rawIdentifier: "",
          rect: "",
          title: "",
          type: "",
          value: "",
        }),
        dataTaskInfo: ref({
          id: 0,              // 任务id
          name: '',           // 任务名称
          desc: '',           // 任务描述
          environment: '',    // 执行环境
          creator: '',        // 创建者
          forProduct: '',     // 所属产品
          forIteration: '',   // 所属迭代
          deviceName: '',     // 设备名称
          forGroup: '',       // 所属业务组
          testCases: [],      // 测试用例yaml文件下载地址集合
          udid: ''            // 设备唯一id
        }),
        dataSettingShow: ref(false),
        dataTaskManagerShow: ref(false),
        classErrorArea: ref("hide"),
        classOpenGuide: ref("open-guide"),
        classContentArea: ref("hide"),
        classConnectionStatus: ref("icon-bg-grey"),
        classServerStatus: ref("icon-bg-grey"),
        classWdaStatus: ref("icon-bg-grey"),
        classIphoneListArea: ref("hide"),
        classNavItemIphoneList: ref("nav-item-grey"),
        classMirrorVdom: ref("hide"),
        classMirrorVdomSwitch: ref("icon-bg-grey"),
        classMirrorClickSwitch: ref("icon-bg-grey"),
        classMirrorSwipeSwitch: ref("icon-bg-grey"),
        classTaskInfo: ref("hide"),
        parentData: {
          settingFile: "",
          taskInfo: {},
          testCases: [],
          taskProcess: {},
          taskStatus: 0 // 0: 无任务；1：开始任务；2：更新进度；3：结束任务
        }
      }
    },
    provide() {
      return {
        parentData: this.parentData,
      }
    },
    methods: {
      // 控制错误弹窗的显示隐藏(action 动作参数：0，隐藏；1，显示)
      handleErrorAreaDisplay: function (action) {
        switch (action) {
          case 0:
            this.classErrorArea = "hide";
            break;
          case 1:
            this.classErrorArea = "error-area";
            break;
        }
      },
      // 控制开端引导的显示隐藏(action 动作参数：0，隐藏；1，显示)
      handleOpenGuideDisplay: function (action) {
        switch (action) {
          case 0:
            this.classOpenGuide = "hide";
            break;
          case 1:
            this.classOpenGuide = "open-guide";
            break;
        }
      },
      // 控制内容区域的显示隐藏(action 动作参数：0，隐藏；1，显示)
      handleContentAreaDisplay: function (action) {
        switch (action) {
          case 0:
            this.classContentArea = "hide";
            break;
          case 1:
            this.classContentArea = "content-area";
            break;
        }
      },
      // 处理一键启动、重启、停止点击事件
      handleOnekeyLaunchEvent: function () {
        if(this.dataStatusBtnText == "一键启动") {
          ipcRenderer.send("oneKeyLaunch");
          this.launchBreathingLight = setInterval(() => {
            if(this.iconStatus == require("../../assets/images/icon/status-normal@2x.png")) {
              this.iconStatus = require("../../assets/images/icon/status-light@2x.png");
            }else {
              this.iconStatus = require("../../assets/images/icon/status-normal@2x.png")
            }
          }, 500);
        }else if(this.dataStatusBtnText == "重新启动") {
          let data = {
            wdaPid: this.dataWdapid,
          }
          ipcRenderer.send("oneKeyReboot", JSON.stringify(data));
          this.launchBreathingLight = setInterval(() => {
            if(this.iconStatus == require("../../assets/images/icon/status-normal@2x.png")) {
              this.iconStatus = require("../../assets/images/icon/status-light@2x.png");
            }else {
              this.iconStatus = require("../../assets/images/icon/status-normal@2x.png");
            }
          }, 500);
        }else {
          ipcRenderer.send("oneKeyClose", JSON.stringify({
            wdaPid: this.dataWdapid,
          }));
          this.launchBreathingLight = setInterval(() => {
            if(this.iconStatus == require("../../assets/images/icon/status-normal@2x.png")) {
              this.iconStatus = require("../../assets/images/icon/status-light@2x.png");
            }else {
              this.iconStatus = require("../../assets/images/icon/status-normal@2x.png");
            }
          }, 500);
          this.dataMirror = data.normalMirror;
        }
      },
      // 处理手机列表菜单点击事件
      handleIphoneListEvent: function () {
        if(this.dataStatusTipText != "已启动") {
          this.dataErrorContent = "请先一键启动！";
          this.handleErrorAreaDisplay(1);
        }else {
          if(this.classNavItemIphoneList == "nav-item-grey") {
            this.classNavItemIphoneList = "nav-item-green";
            this.classIphoneListArea = "iPhone-list-area";
          }else {
            this.classNavItemIphoneList = "nav-item-grey";
            this.classIphoneListArea = "hide";
          }
        }
      },
      // 处理加载镜像
      handleLoadMirror: function () {
        let ipAddress = this.getConnectedIPhoneIP();
        console.log(tag, "ipAddress: ", ipAddress);

        // 获取wda状态
        try {
          status(ipAddress).then(res => {

            let value = res.data.value;
            if(value.state == "success" && value.ready == true) {

              // 获取wda锁定状态
              locked(ipAddress).then(res => {

                let value = res.data.value;
                if(value == false) {

                  let data = {
                    capabilities: {},
                    desiredCapabilities: {}
                  }

                  // 获取session
                  session(data, ipAddress).then(res => {

                    let value = res.data.value;
                    this.dataSessionId = value.sessionId;

                    // 获取设备信息
                    deviceInfo(this.dataSessionId, ipAddress).then(res => {

                      this.dataDeviceInfo = res.data.value;

                      // 获取窗口信息
                      windowSize(this.dataSessionId, ipAddress).then(res => {

                        this.dataScreenInfo.originWidth = res.data.value.width;;
                        this.dataScreenInfo.originHeight = res.data.value.height;

                        this.dataScreenInfo.xScale = this.dataScreenInfo.originWidth / this.dataScreenInfo.actualWidth;
                        this.dataScreenInfo.yScale = this.dataScreenInfo.originHeight / this.dataScreenInfo.actualHeight;

                        console.log(tag, "dataScreenInfo: ", this.dataScreenInfo);

                        clearInterval(this.loadMirror);
                        this.lanuchLoadMirror();
                      }).catch(reason => {
                        console.log(tag, "reason: ", reason);

                        this.dataErrorContent = reason;
                        this.handleErrorAreaDisplay(1);
                      })
                    }).catch(reason => {
                      console.log(tag, "reason: ", reason);

                      this.dataErrorContent = reason;
                      this.handleErrorAreaDisplay(1);
                    })
                  }).catch(reason => {
                    console.log(tag, "reason: ", reason);

                    this.dataErrorContent = reason;
                    this.handleErrorAreaDisplay(1);
                  })
                }else {
                  this.dataErrorContent = "获取wda锁定状态失败！";
                  this.handleErrorAreaDisplay(1);
                }
              }).catch(reason => {
                console.log(tag, "reason: ", reason);

                this.dataErrorContent = reason;
                this.handleErrorAreaDisplay(1);
              })
            }else {
              this.dataErrorContent = "获取WDA状态失败！";
              this.handleErrorAreaDisplay(1);
            }
          }).catch(reason => {
            console.log(tag, "reason: ", reason);

            this.dataErrorContent = reason;
            this.handleErrorAreaDisplay(1);
          })
        }catch (e) {
          console.log(tag, "e: ", e);

          this.dataErrorContent = e.toString();
          this.handleErrorAreaDisplay(1);
        }
      },
      // 处理加载虚拟dom事件
      handleLoadPageTreeSourcesEvent: function () {
        if(this.classMirrorVdomSwitch == "icon-bg-grey") {
          this.classMirrorVdomSwitch = "icon-bg-green";
          this.classMirrorVdom = "virtual-div";
          this.dataPageTree = [];
          this.dataPageTreeSources = [];
          this.initElementData({
            frame: "",
            isAccessible: "",
            isEnabled: "",
            isVisible: "",
            key: "",
            label: "",
            name: "",
            rawIdentifier: "",
            rect: "",
            title: "",
            type: "",
            value: "",
          });
          source("json", this.getConnectedIPhoneIP()).then(res => {
            let result = res.data.value;
            console.log(tag, "result: ", result);

            // 生成页面节点树
            let args = result;
            this.initPageTree(args, "0", "0");
            this.dataPageTree.push(args);

            // 生成虚拟dom
            let width = result.rect.width;
            let height = result.rect.height;
            console.log(tag, `虚拟dom原始尺寸：width: ${width}; height: ${height}`);

            width = this.dataScreenInfo.xScale < 1 ? width / this.dataScreenInfo.xScale : width * this.dataScreenInfo.xScale;
            height = this.dataScreenInfo.yScale < 1 ? height / this.dataScreenInfo.yScale : height * this.dataScreenInfo.yScale;

            console.log(tag, `虚拟dom实际尺寸：xScale: ${this.dataScreenInfo.xScale}; hScale: ${this.dataScreenInfo.yScale}; width: ${width}; height: ${height}`);

            this.genVirtDom(result, 0, 0, width, height, 0);
          });
        }else {
          this.dataPageTree = [];
          this.dataPageTreeSources = [];
          this.initElementData({
            frame: "",
            isAccessible: "",
            isEnabled: "",
            isVisible: "",
            key: "",
            label: "",
            name: "",
            rawIdentifier: "",
            rect: "",
            title: "",
            type: "",
            value: "",
          });
          this.classMirrorVdomSwitch = "icon-bg-grey";
          this.classMirrorVdom = "hide";
        }
      },
      // 处理镜像点击开关事件
      handleMirrorClickSwitchEvent: function () {
        if(this.dataMirrorSwipeEventSwitch) {
          this.dataErrorContent = "请先关闭滑动事件开关！";
          this.handleErrorAreaDisplay(1);
          return;
        }

        if(this.dataMirrorEventSwitch) {
          this.dataMirrorEventSwitch = false;
          this.classMirrorClickSwitch = "icon-bg-grey";
        }else {
          this.dataMirrorEventSwitch = true;
          this.classMirrorClickSwitch = "icon-bg-green";
        }
      },
      // 处理镜像操作点击事件
      handleMirrorClickEvent: function (){
        if(!this.dataMirrorEventSwitch) {
          return;
        }

        let event = event || window.event;
        let clickX = this.dataScreenInfo.xScale < 1 ? event.offsetX * this.dataScreenInfo.xScale : event.offsetX / this.dataScreenInfo.xScale;
        let clickY = this.dataScreenInfo.yScale < 1 ? event.offsetY * this.dataScreenInfo.yScale : event.offsetY / this.dataScreenInfo.yScale;
        console.log(tag, "OnClick", "clickX: " + clickX, "clickY: " + clickY);

        let body = {
          x: clickX,
          y: clickY,
          duration: 0.01
        }
        touchAndHold(this.dataSessionId, body, this.getConnectedIPhoneIP()).then(res => {});
      },
      // 处理镜像滑动开关事件
      handleMirrorSwipeSwitchEvent: function () {
        if(this.dataMirrorEventSwitch) {
          this.dataErrorContent = "请先关闭点击事件开关！";
          this.handleErrorAreaDisplay(1);
          return;
        }

        if(this.dataMirrorSwipeEventSwitch) {
          this.dataMirrorSwipeEventSwitch = false;
          this.classMirrorSwipeSwitch = "icon-bg-grey";
        }else {
          this.dataMirrorSwipeEventSwitch = true;
          this.classMirrorSwipeSwitch = "icon-bg-green";
        }
      },
      // 处理镜像物理按键事件
      handleMirrorPhysicsBtnEvent: function (key) {
        let button = {
          "name": key,
        }

        pressBtn(this.dataSessionId, button, this.getConnectedIPhoneIP())
            .then(res =>{})
            .catch(reason => {
              console.log(tag, "reason: ", reason);

              this.dataErrorContent = reason;
              this.handleErrorAreaDisplay(1);
            })
            .finally(() => {})
      },
      // 处理开/关坐标事件
      handleSwitchLocationBtnEvent: function () {
        this.dataLocationEventSwitch = this.dataLocationEventSwitch ? false : true;
      },
      // 处理开/关镜像事件
      handleSwitchMirrorBtnEvent: function () {
        console.log("点击了")
        if(this.dataMirrorStatus) {
          console.log("true")
          clearInterval(this.loadMirror);
          this.dataMirrorStatus = false;
          this.dataMirror = data.normalMirror;
        }else {
          console.log("false")
          this.lanuchLoadMirror();
          this.dataMirrorStatus = true;
        }
      },
      // 启动加载镜像
      lanuchLoadMirror: function () {
        this.loadMirror = setInterval(() => {
          screenShot(this.getConnectedIPhoneIP())
              .then(res => {
                let {value} = res.data;
                if(value != "") {
                  this.dataMirror = value;
                  this.dataMirrorStatus = true;
                }else {
                  this.dataMirrorStatus = false;
                }
              })
              .catch(err => {
                this.dataMirrorStatus = false;
              })
              .finally(() => {
              });
        }, 2000);
      },
      // 处理镜像鼠标按下事件
      handleOnMouseDown: function (){
        if(!this.dataMirrorSwipeEventSwitch) {
          return;
        }

        this.dataDragInfo.fromX = 0;
        this.dataDragInfo.fromY = 0;
        this.dataDragInfo.toX = 0;
        this.dataDragInfo.toY = 0;

        let event = event || window.event;
        let clickX = this.dataScreenInfo.xScale < 1 ? event.offsetX * this.dataScreenInfo.xScale : event.offsetX / this.dataScreenInfo.xScale;
        let clickY = this.dataScreenInfo.yScale < 1 ? event.offsetY * this.dataScreenInfo.yScale : event.offsetY / this.dataScreenInfo.yScale;
        console.log(tag, "OnMouseDown", "clickX: " + clickX, "clickY: " + clickY);

        this.dataDragInfo.fromX = clickX;
        this.dataDragInfo.fromY = clickY;
      },
      // 处理进项鼠标抬起事件
      handleOnMouseUp: function (){
        if(!this.dataMirrorSwipeEventSwitch) {
          return;
        }

        let event = event || window.event;
        let clickX = this.dataScreenInfo.xScale < 1 ? event.offsetX * this.dataScreenInfo.xScale : event.offsetX / this.dataScreenInfo.xScale;
        let clickY = this.dataScreenInfo.yScale < 1 ? event.offsetY * this.dataScreenInfo.yScale : event.offsetY / this.dataScreenInfo.yScale;
        console.log(tag, "OnMouseUp", "clickX: " + clickX, "clickY: " + clickY);

        this.dataDragInfo.toX = clickX;
        this.dataDragInfo.toY = clickY;

        dragfromtoforduration(this.dataSessionId, this.dataDragInfo, this.getConnectedIPhoneIP());
      },
      // 处理鼠标悬浮事件
      handleOnMouseMove: function () {
        if(!this.dataLocationEventSwitch) {
          return;
        }

        let x = this.dataScreenInfo.xScale < 1 ? event.offsetX * this.dataScreenInfo.xScale : event.offsetX / this.dataScreenInfo.xScale;
        let y = this.dataScreenInfo.yScale < 1 ? event.offsetY * this.dataScreenInfo.yScale : event.offsetY / this.dataScreenInfo.yScale;
        console.log(tag, "OnMouseOver", "x: " + x, "y: " + y);

        this.dataLocationText = `X: ${x}, Y: ${y}`;
      },
      // 处理虚拟dom元素点击事件
      handleVirtElementClick: function(item) {
        this.initElementData(item);
      },
      // 处理关闭客户端事件
      handleCloseClient: function() {
        ipcRenderer.send("closeClient");
      },
      // 处理拒绝执行
      handleDenyexec: function () {
        this.classTaskInfo = "hide";
        whetherExec({
          id: this.dataTaskInfo.id,
          result: 0
        });
      },
      // 处理同意执行
      handleAgreeexec: function () {
        this.classTaskInfo = "hide";
        whetherExec({
          id: this.dataTaskInfo.id,
          result: 1
        });

        this.dataTaskInfo.targetDeviceIp = this.getConnectedIPhoneIP();
        this.dataTaskInfo.pathRepos = process.platform === 'win32' ? `${pathData.userData}\\task\\` : `${pathData.userData}/task/`;
        this.dataTaskInfo.sessionId = this.dataSessionId;
        this.dataTaskInfo.bundleId = "com.cmi.jegotrip";

        ipcRenderer.send("lanuchTask", JSON.stringify(this.dataTaskInfo));
      },
      // 处理打开/关闭偏好设置页面
      handleShowSetting: function () {
        if(!this.dataSettingShow) {
          ipcRenderer.send("index.vue", "receiveSettingData");
          this.dataSettingShow = true;
        }else {
          this.dataSettingShow = false;
        }
      },
      // 处理打开/关闭任务管理
      handleTaskManagerEvent: function () {
        this.dataTaskManagerShow = this.dataTaskManagerShow ? false : true;
      },
      // 获取当前连接手机的IP
      getConnectedIPhoneIP: function () {
        let ipAddress = "";

        for(let i = 0; i < this.dataIphones.value.length; i++) {
          let item = this.dataIphones.value[i];
          if(item.status == "已连接") {
            ipAddress = item.ip;
          }
        }

        console.log(tag, "ipAddress: " + ipAddress);
        return ipAddress;
      },
      // 初始化页面节点树
      initPageTree: function(data, parentIndex, index) {
        data.key = `${parentIndex}-${index}`;
        data.title = data.type;
        if(data.hasOwnProperty("children")) {
          let childLength = data.children.length;
          if(childLength > 0) {
            for (let i = 0; i < childLength; i++) {
              this.initPageTree(data.children[i], data.key, i);
            }
          }
        }
      },
      // 生成虚拟DOM
      genVirtDom: function(data, parentIndex, index, width, height, level) {
        // 生成虚拟dom
        data.key = `${parentIndex}-${index}`;
        data.title = data.type;

        // 生成节点数据
        let item = {};
        item.key = `${parentIndex}-${index}`;
        item.title = data.type;
        item.isEnabled = data.isEnabled;
        item.isVisible = data.isVisible;
        item.frame = data.frame;
        item.rect = data.rect;
        item.value = data.value;
        item.label = data.label;
        item.type = data.type;
        item.name = data.name;
        item.rawIdentifier = data.rawIdentifier;
        item.level = level;
        item.style =
            `
            z-index: ${level};
            left: ${this.dataScreenInfo.xScale < 1 ? item.rect.x / this.dataScreenInfo.xScale : item.rect.x * this.dataScreenInfo.xScale}px;
            top: ${this.dataScreenInfo.yScale < 1 ? item.rect.y / this.dataScreenInfo.yScale : item.rect.y * this.dataScreenInfo.yScale}px;
            width: ${this.dataScreenInfo.xScale < 1 ? item.rect.width / this.dataScreenInfo.xScale : item.rect.width * this.dataScreenInfo.xScale}px;
            height: ${this.dataScreenInfo.yScale < 1 ? item.rect.height / this.dataScreenInfo.yScale : item.rect.height * this.dataScreenInfo.yScale}px;
            `;
        // console.log(tag, "this: ", this);
        this.dataPageTreeSources.push(item);

        // 判断是否存在子元素，递归生成虚拟dom
        if(data.hasOwnProperty("children")) {
          level++;
          let childLength = data.children.length;
          if(childLength > 0) {
            for (let i = 0; i < childLength; i++) {
              this.genVirtDom(data.children[i], data.key, i, width, height, level);
            }
          }
        }
      },
      // 初始化元素属性表
      initElementData: function (data) {
        this.dataElementData.key = data.key;
        this.dataElementData.frame = data.frame;
        this.dataElementData.isAccessible = data.isAccessible;
        this.dataElementData.isEnabled = data.isEnabled;
        this.dataElementData.isVisible = data.isVisible;
        this.dataElementData.label = data.label;
        this.dataElementData.name = data.name;
        this.dataElementData.rawIdentifier = data.rawIdentifier;
        this.dataElementData.rect = data.rect;
        this.dataElementData.title = data.title;
        this.dataElementData.type = data.type;
        this.dataElementData.value = data.value;
      },
      onExpand(expandedKeys) {
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      onChange(e) {
        const value = e.target.value;
        const expandedKeys = dataList
            .map(item => {
              if (item.title.indexOf(value) > -1) {
                return getParentKey(item.key, this.dataPageTree);
              }
              return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        Object.assign(this, {
          expandedKeys,
          searchValue: value,
          autoExpandParent: true,
        });
      },
      // 接收子组件传递的消息
      receiveChildEvent: function (data) {
        console.log(tag, "===== receiveChildEvent() =====");

        if(data.channel == "setting.vue") {
          if(data.event == "close") {
            this.dataSettingShow = false;
          }else if(data.event == "exception") {
            this.dataErrorContent = "发生异常错误，请联系开发者..."
            this.handleErrorAreaDisplay(1);
          }
        }else if(data.channel == "taskManager.vue") {
          if(data.event == "close") {
            this.dataTaskManagerShow = false;
          }else if(data.event == "exception") {
            this.dataErrorContent = "发生异常错误，请联系开发者..."
            this.handleErrorAreaDisplay(1);
          }
        }
      }
    },
    computed: {

    }
  }
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
  }

  /* 右侧面板 */
  .right-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 150px;
    height: 100%;
    position: absolute;
    right: 0;
    background: rgba(32,33,41,0.50);
  }
  .logo-area {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 20px;
  }
  .logo-img {
    width: 40px;
    height: 40px;
  }
  .login-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70px;
  }
  .status-area {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
  }
  .status-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .nav-area {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }
  .nav-item-grey {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 50px;
    background: linear-gradient(90deg,#202129, rgba(32,33,41,0.50));
    cursor:pointer;
  }
  .nav-item-green {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 50px;
    background: linear-gradient(90deg,#26c498, rgba(32,33,41,0.50));
    cursor:pointer;
  }
  .nav-item-taskmanager {
    margin-top: 1px;
    position: relative;
  }
  .nav-item-taskmanager-doing-icon {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 15px;
    right: 10px;
  }
  .ctr-area {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 110px;
    height: 120px;
    background: #202129;
    border-radius: 10px;
    position: absolute;
    bottom: 80px;
  }
  .status-img {
    position: absolute;
    top: -30px;
  }
  .btn-bg {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 90px;
    height: 30px;
    background: #ffffff;
    border-radius: 15px;
  }
  .close-clint-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 110px;
    height: 40px;
    background: #fe762f;
    position: absolute;
    bottom: 20px;
    cursor: pointer;
  }

  /* 开端引导 */
  .open-guide {
    position: absolute;
    left: 100px;
    top:50px;
  }

  /* 错误提示 */
  .error-area {
    width: 480px;
    min-height: 80px;
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 2px 2px 5px 0px #ffffff;
    position: absolute;
    top: 20px;
    left: calc(50% - 240px);
    z-index: 999;
    overflow: scroll;
  }
  .error-title {
    position: absolute;
    left: 20px;
    top: 10px;
  }
  .error-content {
    position: absolute;
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
    overflow-wrap: break-word;
  }
  .error-close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  /* 任务清单 */
  .taskinfo-area {
    width: 480px;
    height: 571px;
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 2px 2px 5px 0px #ffffff;
    position: absolute;
    top: calc(50% - 285px);
    left: calc(50% - 240px);
    z-index: 999;
  }
  .taskinfo-title {
    position: absolute;
    left: 20px;
    top: 10px;
  }
  .taskinfo-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 380px;
    padding-bottom: 10px;
    margin-left: 40px;
    border-bottom: 1px solid rgba(32,33,41,0.30);;
  }
  .denyexec {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 90px;
    height: 30px;
    background: rgba(32,33,41,0.50);
    border-radius: 15px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    color: #000000;
    position: absolute;
    bottom: 20px;
    right: 120px;
    cursor: pointer;
  }
  .agreeexec{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 90px;
    height: 30px;
    background: #fe762f;
    border-radius: 15px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
    position: absolute;
    bottom: 20px;
    right: 20px;
    cursor: pointer;
  }

  /* 内容区域 */
  .content-area {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100%;
  }

  /* 镜像区域 */
  .mirror-area {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }

  /* 虚拟dom */
  .virtual-div {
    position: absolute;
  }
  .virtual-div:hover {
    background: rgba(247,181,0,0.30);
  }
  .virtual-div:focus {
    background: rgba(247,181,0,0.60);
  }

  /* 操作区域 */
  .operation-area {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 20px;
    margin-left: 10px;
    margin-bottom: 10px;
    margin-right: 160px;
    width: 100%;
    height: 100%;
  }

  /* 控制面板 */
  .ctr-pannel-area {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
  }
  .ctr-label {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .ctr-operation-area {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 81px;
    background: rgba(32,33,41,0.50);
    border-radius: 5px;
    margin-top: 10px;
    margin-right: 10px;
  }
  .ctr-operation-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
  }
  .location-text {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  /* 数据区域 */
  .data-area {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100%;
  }

  /* 页面节点树 */
  .page-tree-area {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 0;
    height: 100%;
    margin-top: 20px;
    flex-grow: 1;
  }
  .page-tree-content {
    width: 100%;
    height: 610px;
    background: rgba(32,33,41,0.50);
    border-radius: 5px;
    margin-top: 10px;
    margin-right: 5px;
    overflow-x: scroll;
    overflow-y: scroll;
    position: relative;
  }

  /* 元素属性表 */
  .element-table-area {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 0;
    height: 100%;
    margin-top: 20px;
    margin-left: 5px;
    flex-grow: 1;
  }
  .element-table-content {
    width: 100%;
    height: 610px;
    background: rgba(32,33,41,0.50);
    border-radius: 5px;
    margin-top: 10px;
    margin-right: 5px;
    overflow-x: scroll;
    overflow-y: scroll;
    padding-left: 10px;
    padding-right: 10px;
  }
  .element-table-title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 40px;
    background: #202129;
    margin-top: 20px;
  }
  .left-text {
    width: 130px;
    flex-shrink: 0;
  }
  .right-text {
    word-wrap: break-word;
    width: 246px;
  }
  .element-table-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .divider {
    width: 100%;
    height: 1px;
    border: 1px solid #202129;
  }

  /* 手机列表 */
  .iPhone-list-area {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 400px;
    height: 100%;
    position: absolute;
    right: 150px;
    background: #000000;
    padding-top: 20px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .iPhone-list-btn-return {
    position: absolute;
    top: 20px;
    right: 10px;
  }
  .iPhone-list-title-area {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 40px;
    background: #202129;
  }
  .iPhone-list-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #202129;;
  }

  /* 通用样式 */
  .hide {
    display: none;
  }
  .btn-pointer {
    cursor:pointer;
  }
  .text-overwidth-show {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .roate {
    -webkit-animation: round_animate 2.5s linear infinite;
    animation: round_animate 2.5s linear infinite;
  }
  @keyframes round_animate {
    to {
      transform: rotate(1turn);
    }
  }
</style>