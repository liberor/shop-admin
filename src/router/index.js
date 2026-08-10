import { createRouter, createWebHashHistory } from "vue-router";
import Index from "@/pages/index.vue";
import Login from "@/pages/login.vue";
import NotFound from "@/pages/404.vue"
import { useCookies } from "@vueuse/integrations/useCookies";
import { getInfo } from "@/api/manager";
import useLoginStore from "@/store/useLoginStore";
import nprogress from "nprogress";
import Admin from "../layouts/admin.vue";

import GoodsList from "@/pages/goods/GoodsList.vue"
import CategoryList from "@/pages/goods/CategoryList.vue"
import SkuList from "@/pages/goods/SkuList.vue"
import CouponList from "@/pages/goods/CouponList.vue"
import UserList from "@/pages/user/UserList.vue"
import LevelList from "@/pages/user/LevelList.vue"
import OrderList from "@/pages/order/OrderList.vue"
import CommentList from "@/pages/order/CommentList.vue"
import ManagerList from "@/pages/manager/ManagerList.vue"
import RoleList from "@/pages/manager/RoleList.vue"
import AccessList from "@/pages/manager/AccessList.vue"
import SettingBase from "@/pages/settings/SettingBase.vue"
import SettingBuy from "@/pages/settings/SettingBuy.vue"
import SettingShip from "@/pages/settings/SettingShip.vue"
import DistributionIndex from "@/pages/distribution/DistributionIndex.vue"
import DistributionSetting from "@/pages/distribution/DistributionSetting.vue"
import ImageList from "@/pages/others/ImageList.vue"
import NoticeList from "@/pages/others/NoticeList.vue"

const cookie = useCookies()
const routes = [
    {
        path: "/",
        name: "admin",
        component: Admin,
        meta: {
            title: "Home"
        },
    },
    {
        path: "/login",
        component: Login,
        meta: {
            title: "Login"
        }
    },
]

const dynamicRoutes = [
    {
        path: "/",
        name: "/",
        component: Index,
        meta: {
            title: "主控台"
        },
    },
    {
        path: "/goods/list",
        name: "/goods/list",
        component: GoodsList,
        meta: {
            title: "商品管理"
        },
    },
    {
        path: "/category/list",
        name: "/category/list",
        component: CategoryList,
        meta: {
            title: "分类管理"
        },
    },
    {
        path: "/skus/list",
        name: "/skus/list",
        component: SkuList,
        meta: {
            title: "规格管理"
        },
    },
    {
        path: "/coupon/list",
        name: "/coupon/list",
        component: CouponList,
        meta: {
            title: "优惠券管理"
        },
    },
    {
        path: "/user/list",
        name: "/user/list",
        component: UserList,
        meta: {
            title: "用户管理"
        },
    },
    {
        path: "/level/list",
        name: "/level/list",
        component: LevelList,
        meta: {
            title: "会员等级"
        },
    },
    {
        path: "/order/list",
        name: "/order/list",
        component: OrderList,
        meta: {
            title: "订单管理"
        },
    },
    {
        path: "/comment/list",
        name: "/comment/list",
        component: CommentList,
        meta: {
            title: "评论管理"
        },
    },
    {
        path: "/manager/list",
        name: "/manager/list",
        component: ManagerList,
        meta: {
            title: "管理员管理"
        },
    },
    {
        path: "/access/list",
        name: "/access/list",
        component: AccessList,
        meta: {
            title: "权限管理"
        },
    },
    {
        path: "/role/list",
        name: "/role/list",
        component: RoleList,
        meta: {
            title: "角色管理"
        },
    },
    {
        path: "/setting/base",
        name: "/setting/base",
        component: SettingBase,
        meta: {
            title: "基础管理"
        },
    },
    {
        path: "/setting/buy",
        name: "/setting/buy",
        component: SettingBuy,
        meta: {
            title: "交易管理"
        },
    },
    {
        path: "/setting/ship",
        name: "/setting/ship",
        component: SettingShip,
        meta: {
            title: "物流管理"
        },
    },
    {
        path: "/distribution/index",
        name: "/distribution/index",
        component: DistributionIndex,
        meta: {
            title: "分销员管理"
        },
    },
    {
        path: "/distribution/setting",
        name: "/distribution/setting",
        component: DistributionSetting,
        meta: {
            title: "分销设置"
        },
    },
    {
        path: "/image/list",
        name: "/image/list",
        component: ImageList,
        meta: {
            title: "图库管理"
        },
    },
    {
        path: "/notice/list",
        name: "/notice/list",
        component: NoticeList,
        meta: {
            title: "公告管理"
        },
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

function addRoutes(menus) {
    let hasNewRoutes = false
    function findAndAddRoutes(arr) {
        arr.forEach((e) => {
            let item = dynamicRoutes.find(o => o.path == e.frontpath)
            if (item && !router.hasRoute(item.path)) {
                router.addRoute("admin", item)
                hasNewRoutes = true
            }
            if (e.child && e.child.length > 0) {
                findAndAddRoutes(e.child)
            }
        })
    }
    findAndAddRoutes(menus)
    if (!router.hasRoute('NotFound')) {
        router.addRoute({
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFound,
            meta: {
                title: "404 NotFound"
            }
        })
    }
    return hasNewRoutes
}

router.beforeEach((to, from) => {
    nprogress.start()
    const token = cookie.get("admin-token")
    if (!token && to.path != "/login") {
        return { path: "/login" }
    }
    else if (token && to.path == "/login") {
        return false
    }
    let hasNewRoutes = false
    const LoginStore = useLoginStore()
    if (token && Object.keys(LoginStore.user).length == 0) {
        getInfo().then(info => {
            LoginStore.set_user_info(info)
            hasNewRoutes = addRoutes(info.menus)
            if (hasNewRoutes) router.push(to.fullPath)
        })
    }
})

router.afterEach((to, from) => {
    nprogress.done()
    document.title = to.meta.title
})

export { router }