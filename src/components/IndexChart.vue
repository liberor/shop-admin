<template>
    <el-card shadow="never">
        <template #header>
            <div class=" flex justify-between">
                <div class=" text-[16px]">订单统计</div>
                <div>
                    <el-check-tag v-for="(item, index) in options" :key="index" :checked="current == item.value"
                        @click="handleChoose(item.value)" class="mr-2">{{ item.text }}</el-check-tag>
                </div>
            </div>

        </template>
        <div id="chart" style="height: 450px;width: 100%;"></div>
    </el-card>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import { ref, onMounted, onBeforeUnmount } from "vue"
import { getStatistics3 } from '@/api/index.js';
let current = ref("week")
const options = [{
    text: "近1小时",
    value: "hour"
},
{
    text: "近1周",
    value: "week"
},
{
    text: "近1个月",
    value: "month"
}]
function handleChoose(val) {
    current.value = val
    getData(val)
}
let myChart;
onMounted(() => {
    let chartDom = document.getElementById('chart');
    if (chartDom) {
        myChart = echarts.init(chartDom);
        getData(current.value)
        window.addEventListener("resize", () => {
            myChart.resize()
        })
    }
})
function getData(type) {
    myChart.showLoading()
    getStatistics3(type).then(res => {
        let option = {
            xAxis: {
                type: 'category',
                data: []
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [],
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                }
            ]
        }
        myChart.hideLoading()
        option.xAxis.data = res.x
        option.series[0].data = res.y
        option && myChart.setOption(option);
    })
}
onBeforeUnmount(() => {
    if (myChart) echarts.dispose(myChart)
})
</script>

<style scoped></style>