<template>
    <div style="user-select: none;">
        <el-card>
            <div class="p-3 flex justify-between items-center">
                <div>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                    <el-popconfirm title="是否删除该规格" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDeleteSeveral()">
                        <template #reference>
                            <el-button type="danger" :disabled="delete_ids.length == 0">批量删除</el-button>
                        </template>
                    </el-popconfirm>
                </div>
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
            <el-table v-else ref="tableRef" :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange($event)">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="规格名称" width="300" />
                <el-table-column prop="default" label="规格值" />
                <el-table-column prop="order" label="排序" width="200" />
                <el-table-column label="状态" align="center" width="200">
                    <template #default="{ row }">
                        <div class="flex items-center justify-center">
                            <el-switch :loading="row.loading" :modelValue="row.status" :active-value="1"
                                :inactive-value="0" @change="handleChangeStatus($event, row)">
                            </el-switch>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="250">
                    <template #default="scope">
                        <el-button type="primary" text @click="handleUpdate(scope.row)">修改</el-button>
                        <el-popconfirm title="是否删除该规格" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleDelete(scope.row.id)">
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
            <el-form ref="FormRef" :model="form" :rules="rules" label-width="150" label-position="right">
                <el-form-item label="规格名称" prop="name" class="form-item" style="width: 50%;">
                    <el-input type="text" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order" class="form-item">
                    <el-input-number v-model="form.order" :min="0" :max="1000" />
                </el-form-item>
                <el-form-item label="状态" prop="status" class="form-item">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item label="规格值" prop="default" class="form-item">
                    <TagInput v-model="form.default"></TagInput>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<script lang="js" setup>
import { getSkusList, createSkus, updateSkus, deleteSkus, updateSkusStatus } from '@/api/skus';
import { reactive, ref, watch, nextTick } from 'vue';
import FormDrawer from '@/components/FormDrawer.vue';
import TagInput from '@/components/TagInput.vue';
import { ElMessage } from 'element-plus';
import { ro } from 'element-plus/es/locales.mjs';
let current_page = ref(1)
let total = ref(0)
let loading = ref(false)
const tableData = ref([])
let delete_ids = ref([])
const getData = () => {
    loading.value = true
    delete_ids.value = []
    getSkusList(current_page.value).then(res => {
        total.value = res.totalCount
        tableData.value = res.list

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
    status: 1,
    default: '',
    order: 50
})

const rules = {
    name: [{
        required: true,
        message: "规格名称不能为空",
        trigger: "blur"
    },
    ],
    default: [{
        required: true,
        message: "规格值不能为空",
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
        status: 1,
        default: '',
        order: 50
    })
    drawer_title.value = "新增"
    formDrawerRef.value.open()
}
const onSubmit = () => {
    FormRef.value.validate(valid => {
        if (!valid) return
        switch (drawer_title.value) {
            case "新增":
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
            case "修改":
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
const handleUpdate = (row) => {
    drawer_title.value = "修改"
    update_id.value = row.id
    Object.keys(form).forEach(k => form[k] = row[k])
    formDrawerRef.value.open()
}
const handleDelete = (id) => {
    loading.value = true
    deleteSkus([id]).then(res => {
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

const handleSelectionChange = (rows)=>{
    delete_ids.value = rows.map(o=>o.id)
}
const handleDeleteSeveral = ()=>{
    loading.value = true
    deleteSkus(delete_ids.value).then(res => {
        getData()
        ElMessage({
            message: '删除成功',
            type: 'success',
        })
    }).finally(() => {
        loading.value = false
    })
}
</script>

<style scoped></style>