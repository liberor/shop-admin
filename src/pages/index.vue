<template>
    <div style="user-select: none;">
        <el-row :gutter="20">
            <template v-if="panels.length == 0">
                <el-col v-for="i in 4" :key="i" :span="6">
                    <el-skeleton style="width: 100%" animated loading>
                        <template #template>
                            <el-card shadow="hover">
                                <template #header>
                                    <div class=" flex justify-between text-sm">
                                        <el-skeleton-item variant="text" style="width: 20%" />
                                        <el-skeleton-item variant="text" style="width: 10%" />
                                    </div>
                                </template>
                                <el-skeleton-item variant="h3" style="width: 30%" />
                                <el-divider></el-divider>
                                <div class=" flex justify-between text-sm text-gray-500">
                                    <el-skeleton-item variant="text" style="width: 15%" />
                                    <el-skeleton-item variant="text" style="width: 10%" />
                                </div>
                            </el-card>
                        </template>
                    </el-skeleton>
                </el-col>
            </template>

            <el-col v-for="(panel, index) in panels" :key="index" :span="6" :offset="0">
                <el-card shadow="hover">
                    <template #header>
                        <div class=" flex justify-between text-xl">
                            <span>{{ panel.title }}</span>
                            <el-tag :type="panel.unitColor || 'primary'">{{ panel.unit }}</el-tag>
                        </div>
                    </template>
                    <div class=" text-3xl font-bold text-gray-500">
                        <CountTo :value="panel.value" :tofixed="panel.title == '销售额' ? 2 : 0"></CountTo>
                    </div>
                    <el-divider></el-divider>
                    <div class=" flex justify-between text-[16px] text-gray-500">
                        <span>{{ panel.subTitle }}</span>
                        <span>{{ panel.subValue }}</span>
                    </div>
                </el-card>

            </el-col>
        </el-row>
        <IndexNavs></IndexNavs>
        <el-row :gutter="20" class="mt-5">
            <el-col :span="12">
                <IndexChart v-permission="'getStatistics3,GET'"></IndexChart>
            </el-col>
            <el-col :span="12">
                <IndexCard title="店铺及商品" tip="店铺及商品" :list="goods"></IndexCard>
                <IndexCard title="订单" tip="订单" :list="order"></IndexCard>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { getStatistics1 , getStatistics2 } from '@/api';
import { ref } from 'vue';
import CountTo from '@/components/CountTo.vue';
import IndexNavs from '@/components/IndexNavs.vue';
import IndexChart from '@/components/IndexChart.vue';
import IndexCard from '@/components/IndexCard.vue';

let panels = ref([])
getStatistics1().then(res => {
    panels.value = res.panels
})
let goods = ref([])
let order = ref([])
getStatistics2().then(res => {
    goods.value = res.goods
    order.value = res.order
})
</script>

<style></style>