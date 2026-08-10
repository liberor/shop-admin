<template>
    <el-card shadow="never" :body-style="{ padding: '20px' }" class="mb-4">
        <template #header>
            <div class=" flex justify-between text-sm">
                <span>{{ title }}</span>
                <el-tag type="danger">{{ tip }}</el-tag>
            </div>
        </template>
        <el-row :gutter="20">
            <el-col :span="6" :offset="0" v-for="(item,index) in list" :key="index">
                <el-card shadow="hover" class=" flex justify-center items-center border-0 bg-light-400">
                    <div style="text-align: center;">
                        <div class="mb-2 text-xl">{{item.value}}</div>
                        <div class="text-xs text-gray-500">{{ item.label }}</div>
                    </div>
                </el-card>
                
            </el-col>
        </el-row>
        
    </el-card>

</template>

<script lang="ts" setup>
defineProps({
    title:String,
    tip:String,
    list:Array
})
</script>

<style scoped></style>