<template>
    <div class=" bg-white p-4 rounded">
        <el-form :model="form" label-width="160px">
            <h5 class="bg-gray-100 p-3 rounded mb-5">基础设置</h5>
            <el-form-item label="分销启用">
                <el-radio-group v-model="form.distribution_open">
                    <el-radio label="禁用" :value="0" border>
                    </el-radio>
                    <el-radio label="开启" :value="1" border>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="分销海报图">
                <ChooseImage v-model="form.spread_banners[0]"></ChooseImage>
            </el-form-item>
            <h5 class="bg-gray-100 p-3 rounded mb-5">返佣设置</h5>
            <el-form-item label="一级返佣比例" style="width: 40%;">
                <div>
                    <el-input v-model="form.store_first_rebate" type="number" placeholder="一级返佣比例">
                        <template #append>%</template>
                    </el-input>
                    <small>订单交易成功后给上级返佣的比例 0‑100, 例：5 = 反订单金额的 5%</small>
                </div>
            </el-form-item>
            <el-form-item label="二级返佣比例" style="width: 40%;">
                <div>
                    <el-input v-model="form.store_second_rebate" type="number" placeholder="二级返佣比例">
                        <template #append>%</template>
                    </el-input>
                    <small>订单交易成功后给上级返佣的比例 0‑100, 例：5 = 反订单金额的 5%</small>
                </div>
            </el-form-item>
            <el-form-item label="自购返佣">
                <div>
                    <el-radio-group v-model="form.is_self_brokerage">
                        <el-radio label="是" :value="1" border>
                        </el-radio>
                        <el-radio label="否" :value="0" border>
                        </el-radio>
                    </el-radio-group>
                    <p>是否开启自购返佣（开启：分销员自己购买商品，享受一级返佣，上级享受二级返佣；关闭：分销员自己购买商品没有返佣）</p>
                </div>
            </el-form-item>

            <h5 class="bg-gray-100 p-3 rounded mb-5">结算设置</h5>
            <el-form-item label="结算时间" style="width: 27%;">
                <div>
                    <el-input v-model="form.settlement_days" type="number" placeholder="结算时间">
                        <template #prepend>订单完成后</template>
                        <template #append>天</template>
                    </el-input>
                    <small>预估佣金结算后无法进行回收，请谨慎设置结算天数</small>
                </div>
            </el-form-item>
            <el-form-item label="佣金到账时间">
                <div>
                    <el-radio-group v-model="form.brokerage_method">
                        <el-radio label="手动转账" value="hand" border>
                        </el-radio>
                        <el-radio label="自动到微信零钱" value="wx" border>
                        </el-radio>
                    </el-radio-group>
                    <p>佣金到账方式支持线下转账和微信零钱自动转账，手动转账更安全，自动转账更方便</p>
                </div>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" size="default" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { getConfig,setConfig } from '@/api/distribution';
import ChooseImage from "@/components/ChooseImage.vue"
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
const form = ref({
    "distribution_open": 1, 
    "store_first_rebate":10, 
    "store_second_rebate":20,
    "spread_banners":[
        "http://...png",
    ],
    "is_self_brokerage":1,
    "settlement_days":7,
    "brokerage_method":"hand"
})
const getData = ()=>{
    getConfig().then(res=>{
        Object.keys(form.value).forEach(k=>form.value[k]=res[k])
    })
}
getData()
const submit=()=>{
    setConfig(form.value).then(res=>{
        getData()
        ElMessage({
            type:'success',
            message:'保存成功'
        })
    })
}
</script>

<style scoped>
small,p{
    @apply text-gray-500;
}
</style>