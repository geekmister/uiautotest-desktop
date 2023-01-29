import { createApp } from 'vue';

import App from './App.vue';
import router from './router/router';

// 引入Antd相关组件和样式
import {
    Layout, LayoutSider, Menu, SubMenu, MenuItem, LayoutHeader, Breadcrumb, Form, FormItem, Button, SelectOption,
    BreadcrumbItem, LayoutContent, LayoutFooter, Space, Input, Table, Tag, Tabs, TabPane, InputPassword, Select,
    RangePicker, DatePicker, Progress, Drawer, Textarea, Checkbox, CheckboxGroup, Divider, Avatar, Modal, Card,
    notification, RadioGroup, Radio, RadioButton
} from 'ant-design-vue/lib';
import 'ant-design-vue/lib/layout/style/css';
import 'ant-design-vue/lib/menu/style/css';
import 'ant-design-vue/lib/breadcrumb/style/css';
import 'ant-design-vue/lib/space/style/css';
import 'ant-design-vue/lib/input/style/css';
import 'ant-design-vue/lib/table/style/css';
import 'ant-design-vue/lib/tag/style/css';
import "ant-design-vue/lib/tabs/style/css";
import "ant-design-vue/lib/form/style/css";
import "ant-design-vue/lib/button/style/css";
import "ant-design-vue/lib/select/style/css";
import "ant-design-vue/lib/date-picker/style/css";
import "ant-design-vue/lib/progress/style/css";
import "ant-design-vue/lib/drawer/style/css";
import "ant-design-vue/lib/checkbox/style/css";
import "ant-design-vue/lib/divider/style/css";
import "ant-design-vue/lib/avatar/style/css";
import "ant-design-vue/lib/modal/style/css";
import "ant-design-vue/lib/card/style/css";
import "ant-design-vue/lib/notification/style/css";
import "ant-design-vue/lib/radio/style/css";

createApp(App)
    .use(router)
    .use(Layout)
    .use(LayoutSider)
    .use(Menu)
    .use(SubMenu)
    .use(MenuItem)
    .use(LayoutHeader)
    .use(Breadcrumb)
    .use(BreadcrumbItem)
    .use(LayoutContent)
    .use(LayoutFooter)
    .use(Space)
    .use(Input)
    .use(Table)
    .use(Tag)
    .use(Tabs)
    .use(TabPane)
    .use(Form)
    .use(FormItem)
    .use(InputPassword)
    .use(Button)
    .use(Select)
    .use(SelectOption)
    .use(RangePicker)
    .use(DatePicker)
    .use(Progress)
    .use(Drawer)
    .use(Textarea)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Divider)
    .use(Avatar)
    .use(Modal)
    .use(Card)
    .use(notification)
    .use(RadioGroup)
    .use(Radio)
    .use(RadioButton)
    .mount('#app');
