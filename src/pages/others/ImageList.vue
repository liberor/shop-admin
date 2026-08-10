<template>
    <div>
        <el-container class="bg-white rounded" :style="{ height: h + 'px' }">
            <el-header class="image-header">
                <el-button size="default" type="primary" @click="handleAdd">新增图片分类</el-button>
                <el-button size="default" type="warning" @click="handleUpload">上传图片</el-button>
            </el-header>
            <el-main>
                <ImagePanel ref="imagePanelRef"></ImagePanel>
            </el-main>
        </el-container>
        <FormDrawer ref="formDrawerUploadRef" title="上传图片" :destroyOnClose="true" :loading="loading_drawer"
            :needButtons="false">
            <el-upload drag :action="ImageUploadAction" :headers="{ token }" multiple name="img"
                :data="{ image_class_id: imagePanelRef.active }" :on-success="uploadSuccess" :on-error="uploadError">
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies';
import ImagePanel from '@/components/ImagePanel.vue';
import FormDrawer from '@/components/FormDrawer.vue';
import { ImageUploadAction } from "@/api/image"
import { ElNotification } from 'element-plus';
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
</script>

<style scoped>
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