import { createRouter, createWebHashHistory } from "vue-router";
import Login from "@/pages/login.vue";
import NotFound from "@/pages/404.vue"
import { useCookies } from "@vueuse/integrations/useCookies";
import { getInfo } from "@/api/manager";
import useLoginStore from "@/store/useLoginStore";
import nprogress from "nprogress";
import Admin from "../layouts/admin.vue";

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
        component: () => import("@/pages/index.vue"),
        meta: {
            title: "主控台"
        },
    },
    {
        path: "/goods/list",
        name: "/goods/list",
        component: ()=>import("@/pages/goods/GoodsList.vue"),
        meta: {
            title: "商品管理"
        },
    },
    {
        path: "/category/list",
        name: "/category/list",
        component: ()=>import("@/pages/goods/CategoryList.vue"),
        meta: {
            title: "分类管理"
        },
    },
    {
        path: "/skus/list",
        name: "/skus/list",
        component: ()=>import("@/pages/goods/SkuList.vue"),
        meta: {
            title: "规格管理"
        },
    },
    {
        path: "/coupon/list",
        name: "/coupon/list",
        component: ()=>import("@/pages/goods/CouponList.vue"),
        meta: {
            title: "优惠券管理"
        },
    },
    {
        path: "/user/list",
        name: "/user/list",
        component: ()=>import("@/pages/user/UserList.vue"),
        meta: {
            title: "用户管理"
        },
    },
    {
        path: "/level/list",
        name: "/level/list",
        component: ()=>import("@/pages/user/LevelList.vue"),
        meta: {
            title: "会员等级"
        },
    },
    {
        path: "/order/list",
        name: "/order/list",
        component: ()=>import("@/pages/order/OrderList.vue"),
        meta: {
            title: "订单管理"
        },
    },
    {
        path: "/comment/list",
        name: "/comment/list",
        component: ()=>import("@/pages/order/CommentList.vue"),
        meta: {
            title: "评论管理"
        },
    },
    {
        path: "/manager/list",
        name: "/manager/list",
        component: ()=>import("@/pages/manager/ManagerList.vue"),
        meta: {
            title: "管理员管理"
        },
    },
    {
        path: "/access/list",
        name: "/access/list",
        component: ()=>import("@/pages/manager/AccessList.vue"),
        meta: {
            title: "权限管理"
        },
    },
    {
        path: "/role/list",
        name: "/role/list",
        component: ()=>import("@/pages/manager/RoleList.vue"),
        meta: {
            title: "角色管理"
        },
    },
    {
        path: "/setting/base",
        name: "/setting/base",
        component: ()=>import("@/pages/settings/SettingBase.vue"),
        meta: {
            title: "基础管理"
        },
    },
    {
        path: "/setting/buy",
        name: "/setting/buy",
        component: ()=>import("@/pages/settings/SettingBuy.vue"),
        meta: {
            title: "交易管理"
        },
    },
    {
        path: "/setting/ship",
        name: "/setting/ship",
        component: ()=>import("@/pages/settings/SettingShip.vue"),
        meta: {
            title: "物流管理"
        },
    },
    {
        path: "/distribution/index",
        name: "/distribution/index",
        component: ()=>import("@/pages/distribution/DistributionIndex.vue"),
        meta: {
            title: "分销员管理"
        },
    },
    {
        path: "/distribution/setting",
        name: "/distribution/setting",
        component: ()=>import("@/pages/distribution/DistributionSetting.vue"),
        meta: {
            title: "分销设置"
        },
    },
    {
        path: "/image/list",
        name: "/image/list",
        component: ()=>import("@/pages/others/ImageList.vue"),
        meta: {
            title: "图库管理"
        },
    },
    {
        path: "/notice/list",
        name: "/notice/list",
        component: ()=>import("@/pages/others/NoticeList.vue"),
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
            if (item && !router.hasRoute(item.name)) {
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