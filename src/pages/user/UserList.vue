<template>
    <el-card>
        <el-form :model="searchForm" class="flex">
            <el-form-item prop="keyword" style="width: 300px;margin-right: 10px;" @keyup.enter.stop="handleSearch">
                <el-input type="text" v-model="searchForm.keyword" placeholder="关键词"></el-input>
            </el-form-item>
            <el-form-item prop="user_level_id" style="width: 200px;">
                <el-select v-model="searchForm.user_level_id" placeholder="会员等级"  filterable>
                    <el-option v-for="item in user_levels"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-button type="default" style="padding: 8px;margin-left: 5px;" @click="handleSearch">
                <el-icon :size="20"><Search></Search></el-icon>
            </el-button>
            <el-button type="default" style="padding: 8px;margin-left: 5px;" @click="handleReset">
                <el-icon :size="20"><Delete></Delete></el-icon>
            </el-button>
        </el-form>
        <div class="p-3 flex justify-between items-center">
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-tooltip effect="dark" content="刷新" placement="bottom">
                <el-icon :size="20" class="cursor-pointer" @click="getData(current_page,{limit:10,keyword:searchForm.keyword})">
                    <Refresh></Refresh>
                </el-icon>
            </el-tooltip>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column label="用户" width="300">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-avatar :size="40" :src="row.avatar">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                        </el-avatar>
                        <div class="ml-3">
                            <h6>{{ row.username }}</h6>
                            <small>ID:{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="会员等级" width="300" align="center">
                <template #default="{ row }">
                    <div class="flex items-center justify-center">
                        {{ row.user_level ? row.user_level.name : "-"}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="登录注册" width="400" align="center">
                <template #default="{ row }">
                    <div v-if="row.last_login_time">
                        最后登录:{{ row.last_login_time}}
                    </div>
                    <div >
                        注册时间:{{ row.create_time}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="200" align="center">
                <template #default="{ row }">
                    <div class="flex items-center justify-center">
                        <el-switch :loading="row.loading" 
                        :modelValue="row.status" :active-value="1" :inactive-value="0" 
                        @change="handleChangeStatus($event,row)"
                        :disabled="row.super == 1">
                        </el-switch>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" >
                <template #default="scope">
                    <div v-if="scope.row.super == 1" style="user-select: none;">
                        暂无操作
                    </div>
                    <div v-else>
                        <el-button type="primary" text
                        @click="handleUpdate(scope.row)">修改</el-button>
                    <el-popconfirm title="是否删除用户" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDeleteUser(scope.row.id)">
                        <template #reference>
                            <el-button type="danger" text>删除</el-button>
                        </template>
                    </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex justify-center items-center p-3">
            <el-pagination background v-model:current-page="current_page" layout="prev, pager, next" :total="total"
                :page-size="10" />
        </div>
        <FormDrawer ref="formDrawerRef" @submit="onSubmit" :title="drawer_title">
            <el-form ref="FormRef" :model="form" label-width="100" label-position="right" class="text-xl">
                <el-form-item label="用户名" prop="username" style="width: 300px;">
                    <el-input type="text" v-model="form.username" placeholder="管理员名称"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" style="width: 300px;">
                    <el-input type="text" v-model="form.password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname" style="width: 300px;">
                    <el-input type="text" v-model="form.nickname" placeholder="昵称"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar" style="width: 300px;">
                    <ChooseImage v-model="form.avatar"></ChooseImage>
                </el-form-item>
                <el-form-item label="会员等级" prop="user_level_id" style="width: 300px;">
                    <el-select v-model="form.user_level_id" placeholder="选择会员等级">
                        <el-option v-for="item in user_levels"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    
                </el-form-item>
                <el-form-item label="手机" prop="phone" style="width: 300px;">
                    <el-input type="text" v-model="form.phone" placeholder="手机"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" style="width: 300px;">
                    <el-input type="text" v-model="form.email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status" style="width: 300px;">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>

<script lang="ts" setup>
import { getUserList,updateUserStatus,createUser,updateUser,deleteUser } from '@/api/user';
import { ref, watch } from "vue"
import { ElMessage } from 'element-plus';
import FormDrawer from "@/components/FormDrawer.vue"
import ChooseImage from '@/components/ChooseImage.vue';
let tableData = ref([])
let current_page = ref(1)
let total = ref(0)
const user_levels = ref([])
function getData(page=1,data={}) {
    getUserList(page, data).then(res => {
        tableData.value = res.list
        tableData.value.forEach(item=>{item.loading = false})
        total.value = res.totalCount
        user_levels.value = res.user_level
    })
}
watch(current_page,()=>{
    getData(current_page.value,searchForm.value)
})
let searchForm = ref({
    keyword : '',
    user_level_id:null
})
getData()
const handleSearch = ()=>{
    getData(current_page.value,searchForm.value)
}
const handleReset = ()=>{
    Object.assign(searchForm.value,{
    keyword : '',
    user_level_id:null
})
    getData()
}
const handleChangeStatus = (status,row)=>{
    row.loading = true
    updateUserStatus(row.id,status).then(res=>{
        ElMessage({
            type: 'success',
            message:"状态修改成功"
        })
        getData(current_page.value,{limit:10,keyword:searchForm.value.keyword})
    }).finally(()=>{
        row.loading = false
    })
}
const handleDeleteUser = (id)=>{
    deleteUser(id).then(res=>{
        getData(current_page.value,{limit:10,keyword:searchForm.value.keyword})
        ElMessage({
            type:'success',
            message:"删除成功"
        })
    })
}
let form = ref({
    username : "",
    password : "",
    user_level_id : null,
    status : 1,
    avatar : "",
    nickname : "",
    phone : "",
    email : "",
})
// const rules = {
//     username : [{
//         require : true,
        
//     }],
//     password : [{
//         require : true
//     }],
//     role_id : [{
//         require : true
//     }],
//     status : [{
//         require : true
//     }],
//     avatar : [{
//         require : false
//     }],
// }
const FormRef = ref()
const formDrawerRef = ref()
let drawer_title = ref("新增用户")
let update_id = 0
const handleAdd = ()=>{
    drawer_title.value = "新增用户"
    form.value = {
    username : "",
    password : "",
    user_level_id : null,
    status : 1,
    avatar : "",
    nickname : "",
    phone : "",
    email : "",
}
    formDrawerRef.value.open()
}
const handleUpdate = (row)=>{
    update_id = row.id
    drawer_title.value = "修改用户"
    Object.keys(form.value).forEach(k=>form.value[k]=row[k])
    formDrawerRef.value.open()
}
const onSubmit = () => {
    FormRef.value.validate(valid => {
        if (!valid) return
        switch (drawer_title.value) {
            case "新增用户":
                createUser(form.value).then(res => {
                    getData()
                    ElMessage({
                        message: '新增成功',
                        type: 'success',
                    })
                    formDrawerRef.value.close()
                })
                break;
            case "修改用户":
                updateUser(update_id, form.value).then(res => {
                    getData()
                    ElMessage({
                        message: '修改成功',
                        type: 'success',
                    })
                    formDrawerRef.value.close()
                })
                break;
        }
    })
}
</script>

<style scoped></style>
