<template>
    <div class=" bg-white p-4 rounded">
        <el-form :model="form" label-width="160px">
            <el-tabs v-model="activeName" >
                <el-tab-pane label="注册与访问" name="first">
                    <el-form-item label="是否允许注册会员">
                        <el-radio-group v-model="form.open_reg">
                            <el-radio label="关闭" :value="0" border>
                            </el-radio>
                            <el-radio label="开启" :value="1" border>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="注册类型">
                        <el-radio-group v-model="form.reg_method">
                            <el-radio label="普通注册" value="username" border>
                            </el-radio>
                            <el-radio label="手机注册" value="phone" border>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="密码最小长度" style="width: 30%;">
                        <el-input v-model="form.password_min" type="number" placeholder="密码最小长度"></el-input>
                    </el-form-item>
                    <el-form-item label="强制密码复杂度">
                        <el-checkbox-group v-model="password_encrypt_arr" >
                            <el-checkbox label="数字" value="0" border>
                            </el-checkbox>
                            <el-checkbox label="小写字母" value="1" border>
                            </el-checkbox>
                            <el-checkbox label="大写字母" value="2" border>
                            </el-checkbox>
                            <el-checkbox label="符号" value="3" border>
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="上传设置" name="second">
                    <el-form-item label="默认上传方式">
                        <el-radio-group v-model="form.upload_method">
                            <el-radio label="对象存储" value="oss" border>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="Bucket" style="width: 30%;">
                        <el-input v-model="form.upload_config.Bucket" ></el-input>
                    </el-form-item>
                    <el-form-item label="ACCESS_KEY" style="width: 30%;">
                        <el-input v-model="form.upload_config.ACCESS_KEY" ></el-input>
                    </el-form-item>
                    <el-form-item label="SECRET_KEY" style="width: 30%;">
                        <el-input v-model="form.upload_config.SECRET_KEY"></el-input>
                    </el-form-item>
                    <el-form-item label="空间域名" style="width: 80%;">
                        <div class="flex">
                            <el-input v-model="form.upload_config.http"></el-input>
                            <small class="text-gray-500" style="width: 300px;">请补全http://或https://</small>
                        </div>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="Api安全" name="third">
                    <el-form-item label="是否开启Api安全">
                        <el-radio-group v-model="form.api_safe">
                            <el-radio label="关闭" :value="0" border>
                            </el-radio>
                            <el-radio label="开启" :value="1" border>
                            </el-radio>
                        </el-radio-group>
                        <small></small>
                    </el-form-item>
                    <el-form-item label="秘钥" style="width: 30%;">
                        <el-input v-model="form.api_secret"></el-input>
                        <small class="text-gray-500">秘钥设置后要求对应会员重新登录获取token</small>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
            <el-form-item >
                <el-button type="primary" size="default" @click="submit">保存</el-button>
            </el-form-item>
            
        </el-form>
        
    </div>
</template>

<script lang="ts" setup>
import { getSysconfig,setSysconfig } from '@/api/sysconfig';
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';
let activeName = ref('first')
const password_encrypt_arr = computed({
    get(){
        return form.value.password_encrypt.split(',')
    },
    set(val){
        form.value.password_encrypt = val.join(',')
    }
})
const form = ref({
    "open_reg": 1,
    "reg_method": "username",
    "password_min": 7,
    "password_encrypt": ",0,1,2",
    "upload_method": "oss",
    "upload_config": {
        "Bucket": "",
        "ACCESS_KEY": "****************",
        "SECRET_KEY": "****************",
        "http":''
    },
    "api_safe": 1,
    "api_secret": "122232133239",
})
const getData = ()=>{
    getSysconfig().then(res=>{
        Object.keys(form.value).forEach(k=>form.value[k]=res[k])
    })
}
getData()
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

<style scoped>

</style>