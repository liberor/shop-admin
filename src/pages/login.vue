<template>
    <el-row class="login-container">
        <el-col :lg="16" :md="12" class="left">
            <div class=" px-3">
                <div>Welcome</div>
                <div>The website is used for vue3, vite, pinia, element-plus learning</div>
            </div>
        </el-col>
        <el-col :lg="8" :md="12" class="right" @keyup.enter="onSubmit">
            <h2 class="title">Welcome back</h2>
            <div>
                <span class="line"></span>
                <span>login</span>
                <span class="line"></span>
            </div>
            <el-form ref="FormRef" :model="form" class=" w-[250px]" :rules="rules">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="admin">
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" show-password v-model="form.password" placeholder="admin"
                        :prefix-icon="Lock" />
                </el-form-item>
                <el-form-item>
                    <el-button round color="#626aef" class=" w-[250px]" type="primary"
                        @click="onSubmit" :loading="loading">login</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import { ref , reactive } from 'vue'
import { login,getInfo } from '@/api/manager.js'
import { ElNotification } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import useLoginStore from '@/store/useLoginStore'
const store = useLoginStore()
const cookie = useCookies()
const router = useRouter()

const FormRef = ref()
let loading = ref(false)
const form = reactive({
    username: '',
    password: ''
})
const rules = {
    username:[{
        required : true,
        message : "enter username",
        trigger : "blur"
        },
        {
            min : 3,
            max : 15,
            message : "need 3 to 15 characters",
            trigger : "blur"
        }
    ],
    password:[{
        required : true,
        message : "enter password",
        trigger : "blur"
        },
    ]
}
function onSubmit(){
    FormRef.value.validate((vaild)=>{
        if (vaild == false){
            return false
        }
        loading.value = true
        login(form.username,form.password).then(res=>{
            ElNotification({
                title : "Success",
                message: "log in successfully",
                type: 'success',
                duration: 3000,
                offset : 100
            })
            cookie.set("admin-token",res.token)
            getInfo().then(info => {
                store.set_user_info(info)
            })
            router.push({
                path:"/"
            })
        }).finally(()=>{
            loading.value = false
        })
    })
}
</script>

<style scoped>
.login-container {
    @apply bg-indigo-500 min-h-screen;
}

.login-container .left,
.login-container .right {
    @apply flex items-center justify-center;
}

.login-container .right {
    @apply bg-light-50 flex-col;
}

.left>div>div:first-child {
    @apply font-bold text-6xl text-light-50 mb-4;
}

.left>div>div:last-child {
    @apply text-gray-200 text-1xl;
}

.right .title {
    @apply font-bold text-3xl text-gray-800;
}

.right>div {
    @apply flex justify-center items-center my-5 text-gray-300 space-x-2;
}

.right .line {
    @apply h-[1px] w-16 bg-gray-200;
}
</style>