<template>
    <div class="f-header">
        <span class="logo">
            <el-icon class="mr-1">
                <ElemeFilled />
            </el-icon>
            shop-admin
        </span>
        <el-tooltip effect="dark" :content="LoginStore.asideWidth == '250px' ? 'fold' : 'expand'" placement="left">
            <el-icon class="icon-btn" @click="LoginStore.toggleAsideWidth">
                <Fold v-if="LoginStore.asideWidth == '250px'" />
                <Expand v-else />
            </el-icon>
        </el-tooltip>
        <el-tooltip effect="dark" content="refresh" placement="right">
            <el-icon class="icon-btn" @click="handleRefresh">
                <Refresh />
            </el-icon>
        </el-tooltip>
        <div class="ml-auto flex items-center">
            <el-tooltip effect="dark" :content="isFullscreen ? 'exit full screen' : 'full screen'" placement="bottom">
                <el-icon class="icon-btn" @click="toggle">
                    <FullScreen v-if="!isFullscreen" />
                    <Aim v-else />
                </el-icon>
            </el-tooltip>
            <el-dropdown class="dropdown" @command="handleCommand">
                <span class=" flex items-center text-light-50" style="outline: none;box-shadow: none;">
                    <el-avatar class=" mr-2" :size="25" :src="LoginStore.user.avatar" style="--el-avatar-bg-color: #409eff; --el-avatar-text-color: #fff;" >{{ LoginStore.user.username?.charAt(0) ?? 'A' }}</el-avatar>
                    {{ LoginStore.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="reset password">reset password</el-dropdown-item>
                        <el-dropdown-item command="log out">log out</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <!-- <el-drawer v-if="drawer2" v-model="drawer2" direction="rtl" size="45%" :close-on-click-modal="false" class=" px-8 py-5"
        @keyup.enter="onSubmit">
        <template #header>
            <div class="font-bold text-2xl">reset password</div>
        </template>
        <template #default>
            <el-form ref="FormRef" :model="form" :rules="rules">
                <el-form-item prop="oldpassword" class="form-item">
                    <el-input v-model="form.oldpassword" placeholder="old password"></el-input>
                </el-form-item>
                <el-form-item prop="password" class="form-item">
                    <el-input type="password" show-password v-model="form.password" placeholder="new password" />
                </el-form-item>
                <el-form-item prop="repassword" class="form-item">
                    <el-input type="password" show-password v-model="form.repassword"
                        placeholder="confirm new password" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" :loading="loading">submit</el-button>
                </el-form-item>
            </el-form>
        </template>
    </el-drawer> -->
    <FormDrawer ref="formDrawerRef" @submit="onSubmit" @cancel="clearFormData" title="reset password" 
    :destroyOnClose="true" :loading="loading">
        <el-form ref="FormRef" :model="form" :rules="rules">
            <el-form-item prop="oldpassword" class="form-item">
                <el-input type="text" v-model="form.oldpassword" placeholder="old password"></el-input>
            </el-form-item>
            <el-form-item prop="password" class="form-item">
                <el-input type="password" show-password v-model="form.password" placeholder="new password" />
            </el-form-item>
            <el-form-item prop="repassword" class="form-item">
                <el-input type="password" show-password v-model="form.repassword" placeholder="confirm new password" />
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>

<script lang="ts" setup>
import useLoginStore from '@/store/useLoginStore'
import { useCookies } from '@vueuse/integrations/useCookies'
import { ElMessage, ElMessageBox } from 'element-plus'
import { logout, updatepassword } from '@/api/manager'
import { useRouter } from 'vue-router'
import { useFullscreen } from '@vueuse/core'
import { ref, reactive, watch } from 'vue'
import { getInfo } from '@/api/manager'
import FormDrawer from '@/components/FormDrawer.vue'
import nprogress from 'nprogress'

const { isFullscreen, toggle } = useFullscreen()
const formDrawerRef = ref()
const FormRef = ref()
let loading = ref(false)
const LoginStore = useLoginStore()
const cookie = useCookies()
const router = useRouter()
const form = reactive({
    oldpassword: '',
    password: '',
    repassword: ''
})
const rules = {
    oldpassword: [{
        required: true,
        message: "enter old password",
        trigger: "blur"
    },
    ],
    password: [{
        required: true,
        message: "enter new password",
        trigger: "blur"
    },
    ],
    repassword: [{
        required: true,
        message: "confirm new password",
        trigger: "blur"
    },
    ]
}
function clearFormData(){
    Object.assign(form,{
    oldpassword: '',
    password: '',
    repassword: ''
})
}
function handleRefresh() {
    location.reload()
    // nprogress.start()
    // getInfo().then(info => {
    //     LoginStore.set_user_info(info)
    // }).finally(()=>{
    //     nprogress.done()
    // })
}
function handleCommand(c) {
    switch (c) {
        case "reset password":
            formDrawerRef.value.open()
            break;
        case "log out":
            handleLogout()
            break;
    }
}
function handleLogout() {
    ElMessageBox.confirm(
        'You will log out. Continue?',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(() => {
            logout().finally(() => {
                cookie.remove("admin-token")
                LoginStore.set_user_info({})
                localStorage.removeItem("tabList")
                router.push({ path: "/login" })
                ElMessage({
                    type: 'success',
                    message: 'log out completed',
                })
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'log out canceled',
            })
        })
}
function onSubmit() {
    FormRef.value.validate((vaild) => {
        if (vaild == false) {
            return false
        }
        loading.value = true
        updatepassword(form).then((res) => {
            ElMessage({
                type: 'success',
                message: 'reset succeed,please log in with new password',
                duration: 6000
            })
            cookie.remove("admin-token")
            LoginStore.set_user_info({})
            router.push({ path: "/login" })
        }).finally(() => {
            loading.value = false
        })
    })
}
</script>

<style scoped>
.f-header {
    @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
    height: 64px;
    user-select: none;
    z-index: 200;
}

.logo {
    width: 250px;
    @apply flex text-xl justify-center items-center font-thin;
}

.icon-btn {
    @apply flex justify-center items-center;
    width: 42px;
    height: 64px;
    cursor: pointer;
}

.icon-btn:hover {
    @apply bg-indigo-500;
}

.dropdown {
    @apply mx-5 cursor-pointer;
    height: 64px;
    outline: none;
}

.form-item {
    margin-bottom: 20px;
}
</style>