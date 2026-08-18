<template>
    <div class=" bg-white p-4 rounded">
        <el-form :model="form" label-width="160px">
            <el-tabs v-model="activeName">
                <el-tab-pane label="支付设置" name="first">
                    <el-table :data="tableData" border stripe>
                        <el-table-column label="支付方式">
                            <template #default="{ row }">
                                <div class="flex items-center">
                                    <el-image :src="row.src" fit="fill" :lazy="true" style="width: 40px;height: 40px;"
                                        class="rounded mr-3"></el-image>
                                    <div>
                                        <h6>{{ row.name }}</h6>
                                        <small class="text-gray-500">{{ row.desc }}</small>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="250">
                            <template #default="{ row }">
                                <el-button type="primary" text size="default" @click="open(row.key)">配置</el-button>

                            </template>
                        </el-table-column>
                    </el-table>

                </el-tab-pane>
                <el-tab-pane label="购物设置" name="second">
                    <el-form-item label="未支付订单" style="width: 36%;">
                        <el-input type="number" v-model="form.close_order_minute" >
                            <template #append>分钟后自动关闭</template>
                        </el-input>
                        <small>订单下单未付款,n 分钟后自动关闭,设置 0 不自动关闭</small>
                    </el-form-item>
                    <el-form-item label="已发货订单" style="width: 36%;">
                        <el-input type="number" v-model="form.auto_received_day" >
                            <template #append>天后自动确认收货</template>
                        </el-input>
                        <small>如果在期间未确认收货，系统自动完成收货，设置 0 不自动收货</small>
                    </el-form-item>
                    <el-form-item label="已完成订单" style="width: 36%;">
                        <el-input type="number" v-model="form.after_sale_day" >
                            <template #append>天内允许申请售后</template>
                        </el-input>
                        <small>订单完成后，用户在 n 天内可以发起售后申请，设置 0 不允许申请售后</small>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="default" @click="submit">保存</el-button>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <FormDrawer ref="formDrawerRef" title="配置" @submit="submit">
            <el-form v-if="drawer_type == 'alipay'" :model="form" label-width="200" label-position="right" style="width: 80%;">
                <el-form-item label="app_id">
                    <el-input v-model="form.alipay.app_id" placeholder="app_id"></el-input>
                </el-form-item>
                <el-form-item label="ali_public_key">
                    <el-input type="textarea" :rows="5" resize="none" v-model="form.alipay.ali_public_key"
                        placeholder="ali_public_key"></el-input>
                </el-form-item>
                <el-form-item label="private_key">
                    <el-input type="textarea" :rows="5" resize="none" v-model="form.alipay.private_key"
                        placeholder="private_key"></el-input>
                </el-form-item>
            </el-form>
            <el-form v-else :model="form" label-width="200" label-position="right" style="width: 80%;">
                <el-form-item label="公众号app_id">
                    <el-input v-model="form.wxpay.app_id" placeholder="app_id"></el-input>
                </el-form-item>
                <el-form-item label="小程序app_id">
                    <el-input v-model="form.wxpay.miniapp_id" placeholder="miniapp_id"></el-input>
                </el-form-item>
                <el-form-item label="小程序secret">
                    <el-input v-model="form.wxpay.secret" placeholder="secret"></el-input>
                </el-form-item>
                <el-form-item label="appid">
                    <el-input v-model="form.wxpay.appid" placeholder="appid"></el-input>
                </el-form-item>
                <el-form-item label="商户号">
                    <el-input v-model="form.wxpay.mch_id" placeholder="mch_id"></el-input>
                </el-form-item>
                <el-form-item label="API 密钥">
                    <el-input v-model="form.wxpay.key" placeholder="密钥"></el-input>
                </el-form-item>
                <el-form-item label="cert_client">
                    <el-upload
                        :action="uploadAction" :limit="1"
                        :headers="{token:cookies.get(admin-token)}"
                        accept=".pem"
                        :on-success="uploadSuccess">
                        <el-button type="primary">点击上传 </el-button>
                        <template #tip>
                            <p class="text-red-500">{{ form.wxpay.cert_client ? form.wxpay.cert_client : "未配置" }}</p>
                            <div class="el-upload__tip">
                                如apiclient_cert.pem
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="cert_key">
                    <el-upload
                        :action="uploadAction" :limit="1"
                        :headers="{token:cookies.get(admin-token)}"
                        accept=".pem"
                        :on-success="uploadKeySuccess">
                        <el-button type="primary">点击上传 </el-button>
                        <template #tip>
                            <p class="text-red-500">{{ form.wxpay.cert_key ? form.wxpay.cert_key : "未配置" }}</p>
                            <div class="el-upload__tip">
                                如apiclient_key.pem
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<script lang="ts" setup>
import { getSysconfig, setSysconfig,uploadAction } from '@/api/sysconfig';
import FormDrawer from "@/components/FormDrawer.vue"
import { useCookies } from '@vueuse/integrations/useCookies';
import { ElMessage } from 'element-plus';
import {ref } from 'vue';
let activeName = ref('first')
const cookies = useCookies()
const tableData = [{
    name: '支付宝支付',
    desc: '该系统支持即时到账接口',
    src: '/alipay.png',
    key: 'alipay',
},
{
    name: '微信支付',
    desc: '该系统支持微信网页支付和扫码支付',
    src: '/wechat.jpeg',
    key: 'wxpay',
}]
const form = ref({
    "close_order_minute": 30,
    "auto_received_day": 7,
    "after_sale_day": 23,
    "alipay": {
        "app_id": "****已配置****",
        "ali_public_key": "****已配置****",
        "private_key": "****已配置****"
    },
    "wxpay": {
        "app_id": "****已配置****",
        "miniapp_id": "****已配置****",
        "secret": "****已配置****",
        "appid": "****已配置****",
        "mch_id": "****已配置****",
        "key": "****已配置****",
        "cert_client": "****已配置****.pem",
        "cert_key": "****已配置****.pem"
    },
})
const getData = () => {
    getSysconfig().then(res => {
        Object.keys(form.value).forEach(k => form.value[k] = res[k])
    })
}
getData()
const formDrawerRef = ref()
let drawer_type = ref('alipay')
const open = (key) => {
    drawer_type.value = key
    formDrawerRef.value.open()
}
const uploadSuccess=(res)=>{
    form.value.wxpay.cert_client = res.data
}
const uploadKeySuccess=(res)=>{
    form.value.wxpay.cert_key = res.data
}
const submit=()=>{
    setSysconfig(form.value).then(res=>{
        getData()
        ElMessage({
            type:'success',
            message:'保存成功'
        })
    })
}
</script>

<style scoped></style>