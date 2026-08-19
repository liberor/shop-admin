<template>
    <el-row>
        <el-col :span="6" style="min-width: 180px;max-width: 250px;" class="image-aside">
            <div class="top" :style="{ height: (h - 60 - 50) + 'px' , overflowY: 'auto' }">
                <template v-if="loading_aside">
                    <div v-for="i in limit" :key="i">
                        <el-skeleton style="width: 100%" animated loading>
                            <template #template>
                                <div class="aside-list-item" style="height: 49px;">
                                    <el-skeleton-item variant="text" style="width: 20%" />
                                    <el-skeleton-item variant="text" style="width: 30%" />
                                </div>
                            </template>
                        </el-skeleton>
                    </div>
                </template>
                <div v-else class="aside-list-item" v-for="item in list" :key="item.id"
                    :class="{ active: active == item.id }" @click="active = item.id">
                    <span class="truncate">{{ item.name }}</span>
                    <div>
                        <el-button text type="primary" size="small" class=" px-1" @click="handleEdit(item)">
                            <el-icon :size="12">
                                <Edit />
                            </el-icon>
                        </el-button>
                        <el-popconfirm title="是否删除该分类" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleDelete(item.id)">
                            <template #reference>
                                <el-button text type="primary" size="small" class=" px-1">
                                    <el-icon :size="12">
                                        <Close />
                                    </el-icon>
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <el-pagination background layout="prev, next" :total="total" v-model:current-page="current_page"
                    :page-size="limit" @current-change="getData" />
            </div>
        </el-col>
        <el-col style="flex:1;" class="image-main">
            <div class="top" :style="{ height: (h - 60 - 50) + 'px', overflowY: 'auto' ,overflowX: 'hidden'}">
                <template v-if="loading_main">
                    <el-skeleton loading animated style="width: 100%;">
                        <template #template>
                            <el-row :gutter="15" style="padding: 20px;">
                                <el-col :span="6" :offset="0" v-for="i in limit_main" :key="i" class="mb-3"
                                    style="min-width: 150px;">
                                    <el-card :body-style="{ padding: '0px' }" class="relative">
                                        <el-skeleton-item style="height: 150px;width: 100%;"
                                            variant="image"></el-skeleton-item>
                                        <div class="image-title">加载中...</div>
                                        <div class="flex justify-center items-center p-4">
                                            <el-skeleton-item variant="text"
                                                style="width: 15%;margin-right: 10px;"></el-skeleton-item>
                                            <el-skeleton-item variant="text" style="width: 15%;"></el-skeleton-item>
                                        </div>
                                    </el-card>
                                </el-col>
                            </el-row>
                        </template>
                    </el-skeleton>
                </template>
                <el-row v-else :gutter="15" style="padding: 20px;">
                    <div v-if="list_main.length == 0" class=" p-5 text-xl" style="text-align: center;width: 100%;">没有找到图片</div>
                    <el-col :span="6" :offset="0" v-for="item in list_main" :key="item.id" class="mb-3"
                        style="min-width: 150px;">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }" class="relative" :class="{'border-blue-500':item.checked}">
                            <el-image :src="item.url" fit="cover" style="height: 150px;width: 100%;"
                                :preview-src-list="[item.url]" show-progress :initial-index="0"></el-image>
                            <div class="image-title">{{ item.name }}</div>
                            <div class="flex justify-center items-center p-2">
                                <span style="margin-right: 6px;" v-if="needCheckbox"><el-checkbox v-model="item.checked" @change="handleChoose(item)"></el-checkbox></span>
                                <el-button type="primary" size='small' @click="handleRename(item.id)">重命名</el-button>
                                <el-popconfirm title="是否删除该图片" confirm-button-text="确认" cancel-button-text="取消"
                                    @confirm="handleDeleteImage([item.id])">
                                    <template #reference>
                                        <el-button type="danger" size='small'>删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <div class="bottom">
                <el-pagination background layout="prev,pager, next" :total="total_main"
                    v-model:current-page="current_page_main" :page-size="limit_main"
                    @current-change="getData_main(active, current_page_main)" v-if="list_main.length > 0"/>
            </div>
        </el-col>
    </el-row>
    <FormDrawer ref="formDrawerRef" @submit="onSubmit" :title="drawerTitle" :destroyOnClose="true"
        :loading="loading_drawer">
        <el-form ref="FormRef" :model="form" :rules="rules">
            <el-form-item label="分类名" prop="name" class="form-item">
                <el-input type="text" v-model="form.name" placeholder="分类名"></el-input>
            </el-form-item>
            <el-form-item label="排序值" prop="order" class="form-item">
                <el-input-number v-model="form.order" :min="0" :max="1000" />
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>

<script lang="js" setup>
import { computed, nextTick, ref, watch } from "vue"
import {
    getImageClassList, createImageClass, updateImageClass, deleteImageClass, getImageList,
    updateImage, deleteImage
} from '@/api/image';
import FormDrawer from "./FormDrawer.vue";
import { ElMessage, ElMessageBox } from "element-plus";
const props = defineProps({
    h:{
        required:false,
    },
    needCheckbox:{
        required:false,
        default:false
    },
    multi:{
        default:false
    },
    initialChoosedImages:{
        default:''
    }
})
const emit = defineEmits(['choose'])
let active = ref(0)
let list = ref([])
let loading_aside = ref(false)
let drawerTitle = ref("新增")
const formDrawerRef = ref()
const FormRef = ref()
let form = ref({
    name: '',
    order: 50
})
const rules = {
    name: [{
        required: true,
        message: "enter category name",
        trigger: "blur"
    },
    ],
    order: [{
        required: true,
        message: "enter order",
        trigger: "blur"
    },
    ],
}
let loading_drawer = ref(false)
let editId = ref(0)
function onSubmit() {
    FormRef.value.validate((valid) => {
        if (!valid) return
        loading_drawer.value = true
        switch (drawerTitle.value) {
            case "新增":
                createImageClass(form.value).then(res => {
                    loading_drawer.value = false
                    formDrawerRef.value.close()
                    getData(current_page.value)
                    ElMessage({
                        type: 'success',
                        message: 'add successfully',
                    })
                })
                break;
            case "修改":
                updateImageClass(editId.value, form.value).then(res => {
                    loading_drawer.value = false
                    formDrawerRef.value.close()
                    getData(current_page.value)
                    ElMessage({
                        type: 'success',
                        message: 'update successfully',
                    })
                })
                break;
        }
    })
}
function handleEdit(item) {
    editId.value = item.id
    drawerTitle.value = "修改"
    form.value.name = item.name
    form.value.order = item.order
    formDrawerRef.value.open()
}
function handleDelete(id) {
    loading_aside.value = true
    deleteImageClass(id).then(res => {
        getData(current_page.value)
        ElMessage({
            type: 'success',
            message: 'delete successfully',
        })
    }).finally(() => {
        loading_aside.value = false
    })

}
let current_page = ref(1)
let limit = ref(10)
let total = ref(0)

function getData(page) {
    loading_aside.value = true
    getImageClassList(page).then(res => {
        list.value = res.list
        total.value = res.totalCount
        if (res.list.length > 0 && active.value == "") active.value = res.list[0].id
    }).finally(() => {
        loading_aside.value = false
    })
}
getData(current_page.value)

let current_page_main = ref(1)
let limit_main = ref(10)
let total_main = ref(0)
let list_main = ref([])
let loading_main = ref(false)
function getData_main(id, page) {
    loading_main.value = true
    getImageList(id, page).then(res => {
        list_main.value = res.list.map(o=>{
            o.checked = false
            return o
        })
        total_main.value = res.totalCount
        if(props.multi == true){
            for(let item of list_main.value ){
                for(let url of props.initialChoosedImages){
                    if(item.url == url){
                        item.checked = true
                        break
                    }
                }
            }
        }else{
            for(let item of list_main.value ){
                if(item.url == props.initialChoosedImages){
                    item.checked = true
                    break
                }
            }
        }
    })
    .catch(err=>{
        list_main.value = []
        total_main.value = 0
    })
    .finally(() => {
        loading_main.value = false
    })
}
watch(active, () => {
    getData_main(active.value, current_page_main.value)
})

const handleRename = (id) => {
    ElMessageBox.prompt('Please input new name', '重命名', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputPattern:
            /.+/,
        inputErrorMessage: 'empty name',
    })
        .then(({ value }) => {
            loading_main.value = true
            updateImage(id, { name: value }).then(res => {
                getData_main(active.value, current_page_main.value)
                ElMessage({
                    type: 'success',
                    message: `重命名成功`,
                })
            }
            ).finally(() => {
                loading_main.value = false
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '重命名取消',
            })
        })
}
const handleDeleteImage = (ids) => {
    loading_main.value = true
    deleteImage(ids).then(res => {
        getData_main(active.value, current_page_main.value)
        ElMessage({
            type: 'success',
            message: `删除成功`,
        })
    }).finally(() => {
        loading_main.value = false
    })
}
let checkedImages = computed(()=>{return list_main.value.filter((o)=>{return o.checked})})
const handleChoose = (item)=>{
    if(item.checked && checkedImages.value.length > 1 && props.multi === false){
        item.checked = false
        return ElMessage({
            message : '最多选择1张图片',
            type : 'error'
        })
    }
    emit('choose',checkedImages.value)
}
defineExpose({ formDrawerRef, form, drawerTitle , active ,current_page_main,getData_main})
</script>

<style scoped>
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
    @apply flex justify-center items-center;
}

.aside-list-item {
    @apply flex justify-between items-center cursor-pointer p-3 text-sm text-gray-600;
    border-bottom: 1px solid #f4f4f4;
}

.aside-list-item:hover,
.active {
    @apply bg-blue-50;
}

.form-item {
    margin-bottom: 20px;
}

.image-title {
    @apply bg-gray-800 bg-opacity-30 text-sm px-2 py-1 truncate text-light-100;
    position: absolute;
    top: 122px;
    left: 0;
    right: 0;
    text-align: center;
}
</style>