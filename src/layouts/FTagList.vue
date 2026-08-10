<template>
    <div class="f-tag-list" :style="{ left: LoginStore.asideWidth, transition: 'all 0.2s' }">
        <el-tabs v-model="activeTab" type="card" class="demo-tabs" @tab-remove="removeTab" @tab-change="changeTab"
            style="min-width: 100px;">
            <el-tab-pane :closable="item.path != '/'" v-for="item in Tabs" :key="item.path" :label="item.title"
                :name="item.path">

            </el-tab-pane>
        </el-tabs>

        <span class="tag-btn">
            <el-dropdown class=" cursor-pointer" :style="{ height: '100%', width: '100%' }" @command="handleCommand">
                <span class="el-dropdown-link flex items-center justify-center" style="outline: none;box-shadow: none;"
                    :style="{ height: '100%', width: '100%' }">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="clearAll">关闭所有</el-dropdown-item>
                        <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
    <div style="height: 44px;"></div>
</template>

<script lang="ts" setup>
import { useTagList } from '@/composables/useTagList';
const {Tabs,activeTab,changeTab,removeTab,handleCommand,LoginStore} = useTagList()

</script>

<style scoped>
.f-tag-list {
    @apply fixed bg-gray-100 flex justify-between items-center px-2;
    top: 64px;
    right: 0;
    height: 44px;
    z-index: 100;
    user-select: none
}

.tag-btn {
    @apply rounded-1;
    background-color: #fff;
    width: 27px;
    height: 27px;
    margin-left: 18px;
}

:deep(.el-icon) {
    margin-left: 0;
}

:deep(.el-tabs__header) {
    @apply mb-0;
    border: none !important;
}

:deep(.el-tabs__item.is-active) {
    border: none !important;
}

:deep(.el-tabs__nav) {
    border: none !important;
}

:deep(.el-tabs__item) {
    @apply rounded;
    background-color: #fff;
    border: none !important;
    height: 32px;
    line-height: 32px;
    margin: 0 2px;
}

:deep(.el-tabs__nav-prev),
:deep(.el-tabs__nav-next) {
    line-height: 32px;
    height: 32px;
}
</style>