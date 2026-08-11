<!-- 后端返回数据为空数组,该组件没有完成编写  -->
<template>
    <div style="user-select: none;">
        <el-card>
            <div class="p-3 flex justify-between items-center">
                <el-button type="primary" @click="handleAdd">新增</el-button>
                <el-tooltip effect="dark" content="刷新" placement="bottom">
                    <el-icon :size="20" class="cursor-pointer" @click="getData">
                        <Refresh></Refresh>
                    </el-icon>
                </el-tooltip>
            </div>
            <template v-if="loading">
                <el-skeleton loading animated style="width: 100%;padding-top: 25px;padding-right: 200px;">
                    <template #template>
                        <div v-for="i in 9" :key="i" class="flex justify-between items-center py-3">
                            <el-skeleton-item variant="text" style="height: 30px;width: 10%;"></el-skeleton-item>
                            <el-skeleton-item variant="text" style="height: 30px;width: 20%;"></el-skeleton-item>
                            <el-skeleton-item variant="text" style="height: 30px;width: 10%;"></el-skeleton-item>
                        </div>
                    </template>
                </el-skeleton>
            </template>
            <el-table v-else :data="tableData" stripe style="width: 100%">
                <el-table-column prop="name" label="角色名称" />
                <el-table-column prop="desc" label="角色描述" />
                <el-table-column label="状态" width="200">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-switch :loading="row.loading" :modelValue="row.status" :active-value="1"
                                :inactive-value="0" @change="handleChangeStatus($event, row)"
                                :disabled="row.super == 1">
                            </el-switch>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="250">
                    <template #default="scope">
                        <el-button type="primary" text
                            @click="handleUpdate(scope.row.name, scope.row.desc, scope.row.status, scope.row.id)">修改</el-button>
                        <el-popconfirm title="是否删除该角色" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleDeleteRole(scope.row.id)">
                            <template #reference>
                                <el-button type="danger" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-center items-center p-3">
                <el-pagination background v-model:current-page="current_page" layout="prev, pager, next" :total="total"
                    :page-size="10" />
            </div>
        </el-card>
        <FormDrawer ref="formDrawerRef" @submit="onSubmit" @cancel="clearForm" :title="drawer_title"
            :destroyOnClose="true" :loading="loading_drawer">
            <el-form ref="FormRef" :model="form" :rules="rules">
                <el-form-item label="角色名称" prop="name" class="form-item">
                    <el-input type="text" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc" class="form-item">
                    <el-input type="textarea" v-model="form.desc" :rows="20" />
                </el-form-item>
                <el-form-item prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<script lang="js" setup>
import { getSkusList, createSkus, updateSkus, deleteSkus, updateSkusStatus } from '@/api/skus';
import { reactive, ref, watch, nextTick } from 'vue';
import FormDrawer from '@/components/FormDrawer.vue';
import { ElMessage } from 'element-plus';
let current_page = ref(1)
let total = ref(0)
let loading = ref(false)
const tableData = ref([])
const getData = () => {
    loading.value = true
    getSkusList(current_page.value).then(res => {
        total.value = res.totalCount
        tableData.value = res.list
        console.log(res);
        
    }).finally(() => {
        loading.value = false
    })
}
getData()
watch(current_page, () => {
    getData()
})
const form = reactive({
    name: '',
    desc: '',
    status: 1
})
const rules = {
    name: [{
        required: true,
        message: "enter name",
        trigger: "blur"
    },
    ],
    desc: [{
        required: true,
        message: "enter description",
        trigger: "blur"
    },
    ]
}
const formDrawerRef = ref()
const FormRef = ref()
let drawer_title = ref("新增角色")
let loading_drawer = ref(false)
let update_id = ref(0)
const handleAdd = () => {
    Object.assign(form, {
        name: '',
        desc: '',
        status: 1
    })
    drawer_title.value = "新增角色"
    formDrawerRef.value.open()
}
const onSubmit = () => {
    FormRef.value.validate(valid => {
        if (!valid) return
        switch (drawer_title.value) {
            case "新增角色":
                loading_drawer.value = true
                createSkus(form).then(res => {
                    getData()
                    ElMessage({
                        message: '新增成功',
                        type: 'success',
                    })
                    formDrawerRef.value.close()
                }).finally(() => {
                    loading_drawer.value = false
                })
                break;
            case "修改角色":
                loading_drawer.value = true
                updateSkus(update_id.value, form).then(res => {
                    getData()
                    ElMessage({
                        message: '修改成功',
                        type: 'success',
                    })
                    formDrawerRef.value.close()
                }).finally(() => {
                    loading_drawer.value = false
                })
                break;
        }
    })
}
const handleUpdate = (name, desc, status, id) => {
    drawer_title.value = "修改角色"
    form.name = name
    form.desc = desc
    form.status = status
    update_id.value = id
    formDrawerRef.value.open()
}
const handleDeleteRole = (id) => {
    loading.value = true
    deleteSkus(id).then(res => {
        getData()
        ElMessage({
            message: '删除成功',
            type: 'success',
        })
    }).finally(() => {
        loading.value = false
    })
}
const clearForm = () => {
    Object.assign(form, { title: "", content: "" })
}
const handleChangeStatus = (status, row) => {
    updateSkusStatus(row.id, status).then(res => {
        getData()
        ElMessage({
            message: '修改状态成功',
            type: 'success',
        })
    })
}

</script>

<style scoped>
:deep(.el-tree-node__content) {}
</style>