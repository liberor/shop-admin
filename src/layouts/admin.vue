<template>
    <el-container>
        <el-header>
            <FHeader></FHeader>
        </el-header>
        <el-container>
            <el-aside :style="{width:LoginStore.asideWidth,transition:'all 0.2s'}">
                <FMenu></FMenu>
            </el-aside>
            <el-main>
                <FTagList></FTagList>
                <router-view v-slot="{Component}">
                    <transition name="fade" mode="out-in">
                        <keep-alive :max="6">
                            <component :is="Component"></component>
                        </keep-alive>
                    </transition>
                </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import FHeader from './FHeader.vue';
import FMenu from './FMenu.vue';
import FTagList from './FTagList.vue';
import useLoginStore from '@/store/useLoginStore.js';
const LoginStore = useLoginStore()
</script>

<style scoped>
.fade-enter-from,.fade-leave-to {
    opacity: 0;
}
.fade-enter-to,.fade-leave-from {
    opacity: 1;
}
.fade-enter-active,.fade-leave-active {
    transition: all 0.3s;
}
</style>