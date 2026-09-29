<template>
    <el-card shadow="never">
        <div class="flex items-center justify-between py-5 px-5">
            <el-button type="primary" @click="handleCreate">新增</el-button>
            <el-icon :size="24" @click="getData" class="cursor-pointer">
                <Refresh></Refresh>
            </el-icon>
        </div>
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" node-key="id">
            <template #default="{ _, data }">
                <div class="flex items-center justify-between" style="width: 100%;">
                    <div class="flex items-center">

                        <span class="text-[16px]">{{ data.name }}</span>
                    </div>
                    <div>

                        <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0" class="mr-3"
                            @change="handleChangeStatus($event, data.id)" @click.stop=""></el-switch>

                        <el-button type="primary" text style="padding: 5px 3px;"
                            @click.stop="handleUpdate(data)">修改</el-button>
                        <el-button type="primary" text style="padding: 5px 3px;"
                            @click.stop="handleDelete(data.id)">删除</el-button>
                    </div>
                </div>
            </template>
        </el-tree>
        <FormDrawer ref="formDrawerRef" @submit="onSubmit" :title="drawerTitle" :destroyOnClose="true"
            :loading="loading_drawer">
            <el-form ref="FormRef" :model="form" :rules="rules" label-width="120px" label-position="right">

                <el-form-item label="分类名称" prop="name" class="form-item">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

            </el-form>
        </FormDrawer>
    </el-card>

</template>

<script lang="ts" setup>
import { getCategoryList, createCategory, updateCategory, updateCategoryStatus, deleteCategory } from '@/api/category';
import FormDrawer from "@/components/FormDrawer.vue"
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
let data = ref([])
const defaultProps = {
    children: 'child',
    label: 'name',
}
function getData() {
    getCategoryList().then(res => {
        data.value = res
    })

}
getData()
const handleNodeClick = (item) => {
    //console.log(item);

}
const formDrawerRef = ref()
let drawerTitle = ref("新增")
let loading_drawer = ref(false)
let form = ref({
    name: "",
})

const rules = {
    name: [{
        type: "string",
        require: true,
        message: "invalid",
        trigger: "blur"
    }]
}
const FormRef = ref()
let updateId = 0
const onSubmit = () => {
    FormRef.value.validate(valid => {
        if (!valid) return
        switch (drawerTitle.value) {
            case '新增':
                createCategory(form.value).then(res => {
                    getData()
                    ElMessage({
                        type: "success",
                        message: '创建成功'
                    })
                    formDrawerRef.value.close()
                })
                break;
            case '修改':
                updateCategory(updateId, form.value).then(res => {
                    getData()
                    ElMessage({
                        type: "success",
                        message: '修改成功'
                    })
                    formDrawerRef.value.close()
                })
                break;
        }
    })
}
const handleCreate = (parent = 0) => {
    drawerTitle.value = '新增'
    Object.assign(form.value, {
        name: "",
    })
    formDrawerRef.value.open()

}
const handleUpdate = (data) => {
    drawerTitle.value = '修改'
    updateId = data.id
    Object.keys(form.value).forEach(k => { form.value[k] = data[k] })
    formDrawerRef.value.open()
}
const handleChangeStatus = (status, id) => {
    updateCategoryStatus(id, status).then(res => {
        getData()
        ElMessage({
            type: "success",
            message: '修改状态成功'
        })
    })
}
const handleDelete = (id) => {
    deleteCategory(id).then(res => {
        getData()
        ElMessage({
            type: "success",
            message: '删除成功'
        })
    })
}
</script>

<style scoped>
:deep(.el-tree-node__content) {
    padding: 20px;
}
</style>