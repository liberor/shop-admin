<template>
    <div class="f-menu" :style="{width:LoginStore.asideWidth}">
        <el-menu unique-opened :default-active="route.path" class="border-0 
        el-menu-vertical" @select="handleSelect" :collapse="LoginStore.asideWidth != '250px'"
            :collapse-transition="false">
            <template v-for="(item, index) in LoginStore.user.menus" :key="index">
                <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item v-for="(menuItem, Itemindex) in item.child" :key="Itemindex"
                        :index="menuItem.frontpath">
                        <el-icon>
                            <component :is="menuItem.icon"></component>
                        </el-icon>
                        <span>{{ menuItem.name }}</span>
                    </el-menu-item>
                </el-sub-menu>

                <el-menu-item v-else :index="item.frontpath">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script lang="ts" setup>
import useLoginStore from "@/store/useLoginStore"
import { useRouter,useRoute } from "vue-router";
const LoginStore = useLoginStore()
const router = useRouter()
const route = useRoute()

function handleSelect(frontpath) {
    router.push(frontpath)
}
</script>

<style>
.f-menu {
    @apply shadow-md fixed left-0 bottom-0 bg-light-50;
    top: 64px;
    overflow-y: auto;
    overflow-x: hidden;
    user-select: none;
    transition: all 0.2s;
}

.f-menu::-webkit-scrollbar {
    width: 4px;
    height: 3px;
}

.f-menu::-webkit-scrollbar-track {
    /* background: transparent;  */
    border-radius: 3px;
}

.f-menu::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.f-menu::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
    cursor: pointer;
}

.el-menu-vertical:not(.el-menu--collapse) {
    width: 250px;
}
</style>