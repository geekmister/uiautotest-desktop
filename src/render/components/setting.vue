<template>
  <div class="setting-container">
    <!-- 标题区 -->
    <span class="font-size-16 font-weight-600 font-color-white mtop-9">偏好设置</span>
    <div class="icon-bg-grey setting-btn-return btn-pointer"
         type="primary"
         v-on:click="informToFatherComponent()">
      <img :src="iconReturn" class="icon-size-25 curser-pointer" />
    </div>

    <!-- 是否确认执行 -->
    <div class="setting-item">
      <span class="font-size-14 font-color-white font-weight-400">是否确认执行</span>
      <img :src="dataSetting.autoExec ? iconOn : iconOff"
           class="setting-item-img-onoff mleft-10 curser-pointer"
           @click="handleAutoExecEvent"/>
    </div>

    <!-- 镜像刷新帧率 -->
    <div class="setting-item">
      <span class="font-size-14 font-color-white font-weight-400">镜像刷新帧率</span>
      <div style="position: relative">
        <input
            class="setting-item-input font-size-12 font-color-white font-weight-400"
            :value="dataSetting.frameRate"
            ref="getValue"/>
        <span class="font-size-12 font-color-white font-weight-400 setting-item-framerate-ms">ms</span>
      </div>
      <div class="setting-item-btn font-size-14 font-color-black font-weight-400 curser-pointer"
           v-on:click="handleFrameRateSaveEvent">保存</div>
    </div>
    <p class="setting-item-framerate-tip font-size-10 font-color-white font-color-white">
      - 设置的帧率毫米数越小对CPU的占用越高 <br/>
      - 建议不同的场景设置合适的镜像刷新帧率 <br/>
      - 最小设置为200ms，不限制上限刷新帧率
    </p>
  </div>
</template>

<script>
  import {
    ref,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    onBeforeUnmount,
    onUnmounted,
    onErrorCaptured,
    onRenderTracked,
    onActivated,
    onDeactivated,
    getCurrentInstance,
  } from "vue";

  const fs = window.require('fs');
  const ipcRendder = window.require('electron').ipcRenderer;

  export default {
    name: "settingComponent",
    setup(props, context) {},
    data() {
      return {
        iconReturn: require("../assets/images/icon/return@2x.png"),
        iconOn: require("../assets/images/icon/on@2x.png"),
        iconOff: require("../assets/images/icon/off@2x.png"),
        dataSetting: ref({
          autoExec: false,
          frameRate: 500
        }),
        dataSettingFile: ""
      }
    },
    inject: ["parentData"],
    watch: {
      parentData: {
        handler (value) {
          this.dataSettingFile = value.settingFile;
          console.log("dataSettingFile: ", this.dataSettingFile);
          this.readFile(this.dataSettingFile);
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      // 发送事件
      sendEvent: function (event) {
        console.log("===== sendEvent() =====");
        console.log("event: ", event);

        this.$emit("receiveChildEvent", {
          "channel": "setting.vue",
          "event": event
        });
      },
      // 读取setting.json文件
      readFile: function (file) {
        try {
          if(this.dataSettingFile != "") {
            this.dataSetting = JSON.parse(fs.readFileSync(file, 'utf-8'));
            console.log("dataSetting: ", this.dataSetting);
          }
        }catch (e) {
          console.log("e: ", e);
        }
      },
      // 写入settting.json文件
      writeFile: function (file, data) {
        console.log("===== writeFile() =====");

        fs.writeFile(file, data, 'utf8', function (err) {
          if(err) {
            console.log("setting.json文件写入失败，发生了异常，需要找开发者修复!");
            this.sendEvent("exception");
          }else {
            console.log("setting.json文件写入成功!");
          }
        });
      },
      // 通知父组件
      informToFatherComponent: function () {
        console.log("===== informToFatherComponent() =====");
        this.sendEvent("close");
      },
      // 处理自动执行开关事件
      handleAutoExecEvent: function () {
        console.log("autoExec: ", this.dataSetting.autoExec)
        this.dataSetting.autoExec = this.dataSetting.autoExec ? false : true;
        this.writeFile(this.dataSettingFile, JSON.stringify(this.dataSetting));
      },
      // 处理镜像刷新帧率保存事件
      handleFrameRateSaveEvent: function () {
        let value = this.$refs.getValue.value;
        console.log("value: ", value);
        this.dataSetting.frameRate = value;
        this.writeFile(this.dataSettingFile, JSON.stringify(this.dataSetting));
      }
    }
  }
</script>

<style scoped>
  @import url('../assets/css/base.css');

  .setting-container {
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
    z-index: 99;
  }

  .setting-btn-return {
    position: absolute;
    top: 20px;
    right: 10px;
  }
  .setting-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 30px;
    margin-top: 20px;
    padding-left: 10px;
  }
  .setting-item-img-onoff {
    width: 40px;
    height: 20px;
  }
  .setting-item-input {
    width: 130px;
    height: 30px;
    margin-left: 10px;
    background: #202129;
    border: none;
  }
  .setting-item-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 30px;
    background: #ffffff;
    border-radius: 15px;
    margin-left: 10px;
  }
  .setting-item-framerate-ms {
    position: absolute;
    right: 10px;
    top: 7px;
  }
  .setting-item-framerate-tip {
    margin-left: 104px;
    margin-top: 5px;
  }
</style>