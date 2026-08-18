<template>
    <div class=" bg-white p-4 rounded">
        <el-form :model="form" label-width="160px">
            <el-form-item label="物流查询key" style="width: 36%;">
                <el-input v-model="form.ship"></el-input>
                <small>用于查询物流信息,接口申请（仅供参考）</small>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { getSysconfig, setSysconfig, uploadAction } from '@/api/sysconfig';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
const form = ref({
    ship:""
})
const getData = () => {
    getSysconfig().then(res => {
        Object.keys(form.value).forEach(k => form.value[k] = res[k])
    })
}
getData()
const submit = () => {
    setSysconfig(form.value).then(res => {
        getData()
        ElMessage({
            type: 'success',
            message: '保存成功'
        })
    })
}
</script>

<style scoped></style>