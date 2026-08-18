<template>
    <el-card>
        <el-form :model="searchForm" class="flex">
            <el-form-item prop="title" style="width: 300px;" @keyup.enter.stop="handleSearch">
                <el-input type="text" v-model="searchForm.title" placeholder="关键词"></el-input>
            </el-form-item>
            <el-button type="default" style="padding: 8px;margin-left: 5px;" @click="handleSearch">
                <el-icon :size="20"><Search></Search></el-icon>
            </el-button>
            <el-button type="default" style="padding: 8px;margin-left: 5px;" @click="handleReset">
                <el-icon :size="20"><Delete></Delete></el-icon>
            </el-button>
        </el-form>
        
        <el-table :data="tableData" stripe row-key="id" style="width: 100%">
            <el-table-column type="expand" width="30">
                <template #default="{row}">
                    <div class="flex p-3 pl-18">
                        <el-avatar :size="50" :src="row.user.avatar" fit="fill"></el-avatar>
                        <div class="flex-1 ml-4">
                            <h6 class="flex items-center">
                                {{ row.user.nickname ||  row.user.username }}
                                <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
                                <el-button v-if="!row.textareaEdit && !row.extra" size="small" class="ml-auto" @click="openTextarea(row)">回复</el-button>
                            </h6>
                            {{ row.review.data }}
                            <div class="py-2">
                                <el-image v-for="(item,index) in row.review.image" :key="index" :src="item" fit="cover" 
                                    :lazy="true" style="width: 100px;height: 100px;" class="rounded"></el-image>
                                
                            </div>
                            <template v-if="!row.textareaEdit">
                                <div class="mt-3 bg-gray-100 p-3 rounded" v-for="(item,index) in row.extra" :key="index">
                                    <h6 class="flex items-center">
                                        <span class="font-bold">客服</span>
                                        <el-button size="small" type="info" class="ml-auto" @click="updateComment(row,item.data)">修改</el-button>
                                    </h6>
                                    <p>
                                        {{ item.data }}
                                    </p>
                                </div>
                            </template>
                            <div v-else>
                                <el-input v-model="row.textarea" placeholder="请输入回复" type="textarea" :rows="6" resize="none" ></el-input>
                                <div class="p-2">
                                    <el-button type="primary" size="small" @click="review(row)">回复</el-button>
                                    <el-button size="small" class="ml-2" @click="row.textareaEdit = false">取消</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="ID" width="60" align="center" prop="id"></el-table-column>
            <el-table-column label="商品" width="270">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-image :src=" row.goods_item ? row.goods_item.cover :'' "  fit="fill" :lazy="true" style="width: 50px;height: 50px;" class="rounded"></el-image>
                        
                        <div class="ml-3">
                            <h6>{{ row.goods_item ? row.goods_item.title :'商品已被删除' }}</h6>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="评价" width="360" align="center">
                <template #default="{ row }">
                    <div>
                        <p>用户:{{ row.user.nickname ||  row.user.username}}</p>
                        <p>
                            <el-rate
                                v-model="row.rating"
                                disabled
                                show-score
                                text-color="#ff9900"
                            />
                        </p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="评价时间" align="center" prop="review_time"></el-table-column>
            <el-table-column label="状态" width="200">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-switch :loading="row.loading" 
                        :modelValue="row.status" :active-value="1" :inactive-value="0" 
                        @change="handleChangeStatus($event,row)"
                        :disabled="row.super == 1">
                        </el-switch>
                    </div>
                </template>
            </el-table-column>
            
        </el-table>
        <div class="flex justify-center items-center p-3">
            <el-pagination background v-model:current-page="current_page" layout="prev, pager, next" :total="total"
                :page-size="10" />
        </div>
    </el-card>
</template>

<script lang="ts" setup>
import { getGoodsCommentList,updateGoodsCommentStatus,reviewGoodsComment } from '@/api/goods_comment';
import { ref, watch } from "vue"
import { ElMessage } from 'element-plus';
let tableData = ref([])
let current_page = ref(1)
let total = ref(0)
let roles = ref([])
function getData(page=1,data={limit: 10, keyword: ''}) {
    getGoodsCommentList(page, data).then(res => {
        tableData.value = res.list.map(o => {
            o.textareaEdit = false
            o.textarea = ''
            return o
        })
        tableData.value.forEach(item=>{item.loading = false})
        total.value = res.totalCount
        roles.value = res.roles
    })
}
watch(current_page,()=>{
    getData(current_page.value,{limit:10,keyword:searchForm.value.keyword})
})
let searchForm = ref({
    title : ''
})
getData()
const handleSearch = ()=>{
    getData(current_page.value,{limit:10,keyword:searchForm.value.keyword})
}
const handleReset = ()=>{
    searchForm.value.keyword = ""
    getData()
}
const handleChangeStatus = (status,row)=>{
    row.loading = true
    updateGoodsCommentStatus(row.id,status).then(res=>{
        ElMessage({
            type: 'success',
            message:"状态修改成功"
        })
        getData(current_page.value,{limit:10,keyword:searchForm.value.keyword})
    }).finally(()=>{
        row.loading = false
    })
}
const handleDeleteManager = (id)=>{
    deleteManager(id).then(res=>{
        getData(current_page.value,{limit:10,keyword:searchForm.value.keyword})
        ElMessage({
            type:'success',
            message:"删除管理员成功"
        })
    })
}
const openTextarea = (row)=>{
    row.textareaEdit = true
}
const updateComment = (row,comment)=>{
    row.textarea = comment
    row.textareaEdit = true
}
const review=(row)=>{
    if(row.textarea.trim() == '') {
        ElMessage({
            type:'error',
            message:'回复不能为空'
        })
        return
    }
    reviewGoodsComment(row.id,row.textarea).then(res=>{
        getData()
        row.textareaEdit = false
        ElMessage({
            type:'success',
            message:'回复成功'
        })
    })
}
</script>

<style scoped></style>
