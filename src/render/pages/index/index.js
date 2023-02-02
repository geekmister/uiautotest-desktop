import { createApp } from 'vue';

import "../../assets/css/base.css";

import App from './index.vue';

import Tree from 'ant-design-vue/lib/tree';
import InputSearch from 'ant-design-vue/lib/input';
import 'ant-design-vue/lib/tree/style/css';
import 'ant-design-vue/lib/input/style/css';

const app = createApp(App);

app.use(Tree);
app.use(InputSearch);

app.mount('#index');
