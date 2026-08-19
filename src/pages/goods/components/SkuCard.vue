<template>
    <div class=" w-full mb-3">
        <el-card shadow="never">
            <template #header>
                <div class="flex items-center justify-between p-2 bg-gray-50">
                    <el-input placeholder="规格名称" style="width: 200px;">
                        <template #append>
                            <el-icon><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                    <div>
                        <el-button style="padding: 8px 4px;margin-left: 2px;"><el-icon><Top></Top></el-icon></el-button>
                        <el-button style="padding: 8px 4px;margin-left: 2px;"><el-icon><Bottom></Bottom></el-icon></el-button>
                        <el-button style="padding: 8px 4px;margin-left: 2px;"><el-icon><Delete></Delete></el-icon></el-button>
                    </div>
                </div>
            </template>
            <div>
                sss
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
:deep(.el-card__header) {
    @apply p-0;
}
</style>