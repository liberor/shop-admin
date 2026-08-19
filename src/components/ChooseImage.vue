<!-- 只能选一张图片时不传multi,v-model绑定url字符串 -->
<!-- 能选多张图片时传 :multi = 'true',v-model绑定url字符串的数组 -->

<template>
    <div v-if="multi == false">
        <div class="flex items-center">
            <div v-if="modelValue" class="flex items-center justify-center relative">
                <el-image :src="modelValue" fit="cover" style="height: 100px;width: 100px;"
                    class="rounded border"></el-image>
                <el-icon @click="handleClose(modelValue)" class=" absolute top-[5px] right-[5px] z-10 cursor-pointer bg-white rounded-full"><circleClose></circleClose></el-icon>
            </div>
            <div class="btn ml-3" @click="open">
                <el-icon :size="25" class=" text-gray-500">
                    <Plus></Plus>
                </el-icon>
            </div>
        </div>
        <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh" destroy-on-close>
            <div>
                <el-container class="bg-white rounded" :style="{ height: '70vh' }">
                    <el-header class="image-header">
                        <el-button size="default" type="primary" @click="handleAdd">新增图片分类</el-button>
                        <el-button size="default" type="warning" @click="handleUpload">上传图片</el-button>
                    </el-header>
                    <el-main>
                        <ImagePanel ref="imagePanelRef" :needCheckbox="true" @choose="handleChoose" :initialChoosedImages = "modelValue"></ImagePanel>
                    </el-main>
                </el-container>
                <FormDrawer ref="formDrawerUploadRef" title="上传图片" :destroyOnClose="true" :loading="loading_drawer"
                    :needButtons="false">
                    <el-upload drag :action="ImageUploadAction" :headers="{ token }" multiple name="img"
                        :data="{ image_class_id: imagePanelRef.active }" :on-success="uploadSuccess"
                        :on-error="uploadError">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            Drop file here or <em>click to upload</em>
                        </div>
                        <template #tip>
                            <div class="el-upload__tip">
                                jpg/png files with a size less than 500kb
                            </div>
                        </template>
                    </el-upload>
                </FormDrawer>
            </div>
            <template #footer>
                <span>
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="submit(multi)">OK</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
    <div v-else>
        <div class="flex items-center">
            <div v-if="modelValue.length > 0" class="flex items-center justify-center">
                <div v-for="url in modelValue" :key="url" class="flex items-center justify-center relative">
                    <el-image :src="url" fit="cover" style="height: 100px;width: 100px;"
                        class="rounded border"></el-image>
                    <el-icon @click="handleClose(url)" class=" absolute top-[5px] right-[5px] z-10 cursor-pointer bg-white rounded-full"><circleClose></circleClose></el-icon>
                </div>
            </div>
            <div class="btn ml-3" @click="open">
                <el-icon :size="25" class=" text-gray-500">
                    <Plus></Plus>
                </el-icon>
            </div>
        </div>
        <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh" destroy-on-close>
            <div>
                <el-container class="bg-white rounded" :style="{ height: '70vh' }">
                    <el-header class="image-header">
                        <el-button size="default" type="primary" @click="handleAdd">新增图片分类</el-button>
                        <el-button size="default" type="warning" @click="handleUpload">上传图片</el-button>
                    </el-header>
                    <el-main>
                        <ImagePanel ref="imagePanelRef" :needCheckbox="true" @choose="handleChoose" :multi="multi"
                        :initialChoosedImages = "modelValue"></ImagePanel>
                    </el-main>
                </el-container>
                <FormDrawer ref="formDrawerUploadRef" title="上传图片" :destroyOnClose="true" :loading="loading_drawer"
                    :needButtons="false">
                    <el-upload drag :action="ImageUploadAction" :headers="{ token }" multiple name="img"
                        :data="{ image_class_id: imagePanelRef.active }" :on-success="uploadSuccess"
                        :on-error="uploadError">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            Drop file here or <em>click to upload</em>
                        </div>
                        <template #tip>
                            <div class="el-upload__tip">
                                jpg/png files with a size less than 500kb
                            </div>
                        </template>
                    </el-upload>
                </FormDrawer>
            </div>
            <template #footer>
                <span>
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="submit(multi)">OK</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useCookies } from '@vueuse/integrations/useCookies';
import ImagePanel from '@/components/ImagePanel.vue';
import FormDrawer from '@/components/FormDrawer.vue';
import { ImageUploadAction } from "@/api/image"
import { ElNotification } from 'element-plus';
const props = defineProps({
    modelValue:{
        default: ''
    },
    multi:{
        type:Boolean,
        default:false
    },
})
const emit = defineEmits(['update:modelValue'])
const dialogVisible = ref(false)
const open = () => {
    dialogVisible.value = true
}
const close = () => {
    dialogVisible.value = false
}
const submit = (multi) => {
    if(!multi){
        if (urls.length > 0) {
            emit('update:modelValue', urls[0])
        } else {
            emit('update:modelValue', '')
        }
    }else{
        emit('update:modelValue', urls)
    }
    close()
}

const cookie = useCookies()
const token = cookie.get('admin-token')
let h = (window.innerHeight || document.body.clientHeight) - 64 - 44 - 40
const imagePanelRef = ref()
function handleAdd() {
    imagePanelRef.value.drawerTitle = "新增"
    imagePanelRef.value.form.name = ""
    imagePanelRef.value.form.order = 50
    imagePanelRef.value.formDrawerRef.open()
}
const formDrawerUploadRef = ref()
let loading_drawer = ref(false)
function handleUpload() {
    formDrawerUploadRef.value.open()
}
const uploadSuccess = () => {
    imagePanelRef.value.getData_main(imagePanelRef.value.active, imagePanelRef.value.current_page_main)
    let msg = "上传成功"
    ElNotification({
        message: msg,
        type: 'success',
        duration: 3000,
        offset: 100,
    }
    )
}
const uploadError = (error) => {
    let msg = JSON.parse(error.message).msg || "上传失败"
    ElNotification({
        message: msg,
        type: 'error',
        duration: 3000,
        offset: 100,
    }
    )
}
let urls = []
const handleChoose = (checkedImages) => {
    urls = checkedImages.map(o => o.url)
}
const handleClose = (url:String) => {
    urls = urls.filter( item => item != url )
    submit(props.multi)
}
</script>

<style scoped>
.btn {
    @apply flex items-center rounded border justify-center cursor-pointer hover:(bg-gray-100);
    width: 100px;
    height: 100px;
}

.image-header {
    @apply flex items-center;
    border-bottom: 1px solid #eee;
}

.image-aside {
    border-right: 1px solid #eee;
}

.top::-webkit-scrollbar {
    width: 4px;
    height: 3px;
}

.top::-webkit-scrollbar-track {
    /* background: transparent;  */
    border-radius: 3px;
}

.top::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.top::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
    cursor: pointer;
}

.bottom {
    height: 50px;
}

:deep(.el-main) {
    padding: 0;
}
</style>