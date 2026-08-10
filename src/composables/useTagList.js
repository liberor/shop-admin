import { ref } from 'vue'
import useLoginStore from "@/store/useLoginStore.js"
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { router } from '@/router'

export function useTagList() {
    const LoginStore = useLoginStore()
    const route = useRoute()
    const activeTab = ref(route.path)
    const Tabs = ref([
        {
            title: '主控台',
            path: "/"
        },
    ]);

    function initTabList() {
        if (localStorage.getItem("tabList")) {
            Tabs.value = JSON.parse(localStorage.getItem("tabList"))
        }
    };
    initTabList()

    function changeTab(t) {
        router.push(t)
    }
    function addTab(tab) {
        if (Tabs.value.findIndex(o => o.path == tab.path) == -1) {
            Tabs.value.push(tab)
        }
        localStorage.setItem("tabList", JSON.stringify(Tabs.value))
    }

    onBeforeRouteUpdate((to, from) => {
        addTab({
            title: to.meta.title,
            path: to.path
        })
        activeTab.value = to.path
    })


    const removeTab = (targetName) => {
        if (targetName == activeTab.value) {
            const idx = Tabs.value.findIndex(t => t.path == targetName)
            activeTab.value = Tabs.value[idx - 1].path
            changeTab(activeTab.value)
        }
        Tabs.value = Tabs.value.filter((t) => t.path != targetName)
        localStorage.setItem("tabList", JSON.stringify(Tabs.value))
    }
    function handleCommand(c) {
        switch (c) {
            case "clearAll":
                Tabs.value = [
                    {
                        title: '主控台',
                        path: "/"
                    },
                ]
                activeTab.value = "/"
                changeTab("/")
                break;
            case "clearOther":
                Tabs.value = Tabs.value.filter((t) => t.path == activeTab.value || t.path == '/')
                break;
        }
        localStorage.setItem("tabList", JSON.stringify(Tabs.value))
    }
    return {Tabs,activeTab,changeTab,removeTab,handleCommand,LoginStore}
}