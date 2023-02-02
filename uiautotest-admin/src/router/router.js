import Index from "../views/Index";
import ProductIndex from "../views/product/Index";
import ProductList from "../views/product/List";
import ProductDetails from "../views/product/Details";
import IterationIndex from "../views/iteration/Index";
import IterationList from "../views/iteration/List";
import IterationDetials from "../views/iteration/Details";
import CasesIndex from "../views/cases/Index";
import CasesAdd from "../views/cases/Add";
import CasesStatistics from "../views/cases/Statistics";
import DeviceIndex from "../views/device/Index";
import DeviceDetails from "../views/device/Details";
import TaskIndex from "../views/task/Index";
import TaskAdd from "../views/task/Add";
import TaskEdit from "../views/task/Edit";
import TaskDetails from "../views/task/Details";
import TaskList from "../views/task/List";
import TaskReport from "../views/task/Report";
import TaskStatistics from "../views/task/Statistics";
import AdmIndex from "../views/adm/Index";
import UserAdm from "../views/adm/UserAdm";
import JurisdictionAdm from "../views/adm/JurisdictionAdm";
import DeviceAdm from "../views/adm/DeviceAdm";
import ProductAdm from "../views/adm/ProductAdm";
import IterationAdm from "../views/adm/IterationAdm";
import EnvAdm from "../views/adm/EnvAdm";
import GroupAdm from "../views/adm/GroupAdm";
import Login from "../views/Login";
import Resigter from "../views/Resigter";

import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {path: "/", redirect: "/index/product/list"},
    {
        path: "/index", component: Index, redirect: "/index/product/list",
        children: [
            {
                path: "/index/product", component: ProductIndex, redirect: "/index/product/list",
                children: [
                    {path: "list", component: ProductList},
                    {path: "details/:id", component: ProductDetails, props: true}
                ]
            },
            {
                path: "/index/iteration", component: IterationIndex, redirect: "/index/iteration/list",
                children: [
                    {path: "list", component: IterationList},
                    {path: "details/:id", component: IterationDetials, props: true}
                ]
            },
            {
                path: "/index/cases", component: CasesIndex, redirect: "/index/cases/list",
                children: [
                    {path: "list", name: "casesList", component: () => import('@/views/cases/List.vue')},
                    {path: "add", component: CasesAdd},
                    {path: "edit/:id", name: "casesEdit", component: () => import('@/views/cases/Edit.vue'), props: true},
                    {path: "details/:id", name: "casesDetails", component: () => import('@/views/cases/Details.vue'), props: true},
                    {path: "statistics", component: CasesStatistics}
                ]
            },
            {
                path: "/index/device", component: DeviceIndex, redirect: "/index/device/list",
                children: [
                    {path: "list", name: "deviceList", component: () => import('@/views/device/List.vue')},
                    {path: "details/:udid", component: DeviceDetails, props: true}
                ]
            },
            {
                path: "/index/task", component: TaskIndex, redirect: "/index/task/list",
                children: [
                    {path: "list", name: "taskList", component: () => import('@/views/task/List.vue')},
                    {path: "add", component: TaskAdd},
                    {path: "statistics", component: TaskStatistics},
                    {path: "details/:id", component: TaskDetails, props: true},
                    {path: "edit/:id", component: TaskEdit, props: true},
                    {path: "report/:id", component: TaskReport, props: true},
                    {path: "log/:id", name: "taskLog", component: () => import('@/views/task/Log.vue'), props: true}
                ]
            },
            {
                path: "/index/adm", component: AdmIndex, redirect: "/index/adm/user",
                children: [
                    {path: "user", component: UserAdm},
                    {path: "jurisdiction", component: JurisdictionAdm},
                    {path: "device", component: DeviceAdm},
                    {path: "product", component: ProductAdm},
                    {path: "iteration", component: IterationAdm},
                    {path: "env", component: EnvAdm},
                    {path: "group", component: GroupAdm}
                ]
            }
        ]
    },
    {path: "/login", component: Login},
    {path: "/resigter", component: Resigter}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router;