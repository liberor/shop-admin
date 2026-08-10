<template>
    <div>
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
                <el-table-column prop="title" label="公告标题" />
                <el-table-column prop="create_time" label="创建时间" />
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button type="primary" text
                            @click="handleUpdate(scope.row.title, scope.row.content,scope.row.id)">修改</el-button>
                        <el-popconfirm title="是否删除该公告" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleDeleteNotice(scope.row.id)">
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
                <el-form-item label="公告标题" prop="title" class="form-item">
                    <el-input type="text" v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content" class="form-item">
                    <el-input type="textarea" v-model="form.content" :rows="20" />
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<script lang="ts" setup>
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '@/api/notice';
import { reactive, ref, watch } from 'vue';
import FormDrawer from '@/components/FormDrawer.vue';
import { ElMessage } from 'element-plus';
let current_page = ref(1)
let total = ref(0)
let loading = ref(false)
const tableData = ref([])
const getData = () => {
    loading.value = true
    getNoticeList(current_page.value).then(res => {
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
    title: '',
    content: ''
})
const rules = {
    title: [{
        required: true,
        message: "enter notice title",
        trigger: "blur"
    },
    ],
    content: [{
        required: true,
        message: "enter notice content",
        trigger: "blur"
    },
    ]
}
const formDrawerRef = ref()
const FormRef = ref()
let drawer_title = ref("新增公告")
let loading_drawer = ref(false)
let update_id = ref(0)
const handleAdd = () => {
    drawer_title.value = "新增公告"
    formDrawerRef.value.open()
}
const onSubmit = () => {
    FormRef.value.validate(valid => {
        if (!valid) return
        switch (drawer_title.value) {
            case "新增公告":
                loading_drawer.value = true
                createNotice(form).then(res => {
                    getData()
                    ElMessage({
                        message: '创建成功',
                        type: 'success',
                    })
                    formDrawerRef.value.close()
                }).finally(() => {
                    loading_drawer.value = false
                })
                break;
            case "修改公告":
                loading_drawer.value = true
                updateNotice(update_id.value,form).then(res => {
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
const handleUpdate = (title, content,id) => {
    drawer_title.value = "修改公告"
    form.title = title
    form.content = content
    update_id.value = id
    formDrawerRef.value.open()
}
const handleDeleteNotice = (id) => {
    loading.value = true
    deleteNotice(id).then(res => {
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
</script>

<style scoped></style>