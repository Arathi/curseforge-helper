<script setup lang="ts">
import { computed, ref, onMounted, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '../stores/settings';
import Aria2Client, { Aria2Event, Aria2StateUpdateDetail } from '@/utils/Aria2Client';

const settings = useSettingsStore();
const { 
  testWindow: testWindowSettings,
  aria2: aria2Settings,
} = storeToRefs(settings);

const top = computed(() => `${testWindowSettings.value.top}px`);
const left = computed(() => `${testWindowSettings.value.left}px`);
const width = computed(() => `${testWindowSettings.value.width}`);
const height = computed(() => `${testWindowSettings.value.height}`);

const aria2 = new Aria2Client();
aria2.onOpen((event) => {
  readyStateUpdate(event as Aria2Event<Aria2StateUpdateDetail>);
});
aria2.onClose((event) => {
  readyStateUpdate(event as Aria2Event<Aria2StateUpdateDetail>);
});

function readyStateUpdate(event: Aria2Event<Aria2StateUpdateDetail>) {
  let evt = event as Aria2Event<Aria2StateUpdateDetail>;
  console.info("WebSocket连接状态改变：", evt.detail.readyState);
  readyState.value = evt.detail.readyState;
}

const readyState = ref<number>(WebSocket.CLOSED);
const disableBtnConnect = ref(false);

const connectBtnType = computed(() => {
  if (readyState.value != WebSocket.OPEN) {
    return "primary";
  }
  return "danger";
});

const connectBtnText = computed(() => {
  let text = "连接";
  let disable = false;
  switch (readyState.value) {
    case WebSocket.OPEN:
      text = "关闭";
      break;
    case WebSocket.CONNECTING:
      text = "连接中";
      disable = true;
      break;
    case WebSocket.CLOSING:
      text = "关闭中";
      disable = true;
      break;
  }

  return text;
});

onMounted(() => {
  settings.loadAll();
});

function hide() {
  testWindowSettings.value.show = false;
}

function connect() {
  if (readyState.value == WebSocket.CLOSED) {
    readyState.value = WebSocket.CONNECTING;
    aria2.connect(
      aria2Settings.value.url,
      aria2Settings.value.token,
    );
  }
  else if (readyState.value == WebSocket.OPEN) {
    readyState.value = WebSocket.CLOSING;
    aria2.disconnect();
  }
}

function getVersion() {
  aria2.getVersion();
}

function updateAria2Settings() {
  settings.updateAria2(aria2Settings.value);
}
</script>

<template>
  <div class="testWindow" v-if="settings.testWindow.show">
    <el-row align="middle">
      <el-col :span="12">
        测试窗口
      </el-col>
      <el-col :span="12">
        <el-row justify="end">
          <el-button @click="hide">X</el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-divider content-position="left">窗口设置</el-divider>
    <el-row align="middle">
      <el-col :span="6">测试窗口位置：</el-col>
      <el-col :span="18">
        <el-input-number v-model="testWindowSettings.left" />
        <el-input-number v-model="testWindowSettings.top" />
      </el-col>
    </el-row>
    <el-row align="middle">
      <el-col :span="6">测试窗口大小：</el-col>
      <el-col :span="18">
        <el-input class="input-box" v-model="testWindowSettings.width" />
        <span style="margin-left: 10px; margin-right: 10px;"> x </span>
        <el-input class="input-box" v-model="testWindowSettings.height" />
      </el-col>
    </el-row>

    <el-divider content-position="left">Aria2客户端测试</el-divider>

    <el-row align="middle">
      <el-col :span="6">接口地址：</el-col>
      <el-col :span="18">
        <el-input v-model="aria2Settings.url" />
      </el-col>
    </el-row>

    <el-row align="middle">
      <el-col :span="6">Token：</el-col>
      <el-col :span="18">
        <el-input v-model="aria2Settings.token" />
      </el-col>
    </el-row>

    <el-row align="middle">
      <el-col>
        <el-row justify="end">
          <el-button @click="getVersion">获取版本</el-button>
          <el-button @click="updateAria2Settings">保存连接信息</el-button>
          <el-button @click="connect" :type="connectBtnType" :disable="disableBtnConnect">{{ connectBtnText }}</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
div.testWindow {
  position: fixed;
  top: v-bind(top);
  left: v-bind(left);
  width: v-bind(width);
  height: v-bind(height);
  border-color: aqua;
  border-width: 1px;
  background-color: #FFFFFF;
  padding: 10px;
  z-index: 999;
}

.el-row {
  margin-bottom: 8px;
}

.input-box {
  width: 100px;
}
</style>