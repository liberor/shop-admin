<template>
    <div>
        <el-tabs v-model="searchForm.tab" @tab-change="handleSearch">
            <el-tab-pane v-for="item in tabbars" :key="item.key" :label="item.name" :name="item.key"></el-tab-pane>
        </el-tabs>
        <el-card>
            <el-form :model="searchForm" class="flex" label-position="right">
                <el-form-item prop="title" style="width: 300px;" @keyup.enter.stop="handleSearch">
                    <el-input type="text" v-model="searchForm.title" placeholder="商品名称"></el-input>
                </el-form-item>
                <el-form-item prop="category_id" label="商品分类" style="width: 300px;margin-left: 49px;">
                    <el-select v-model="searchForm.category_id" placeholder="选择商品分类" clearable filterable>
                        <el-option v-for="item in category_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-button type="default" style="padding: 8px;margin-left: 5px;" @click="handleSearch">
                    <el-icon :size="20">
                        <Search></Search>
                    </el-icon>
                </el-button>
                <el-button type="default" style="padding: 8px;margin-left: 5px;" @click="handleReset">
                    <el-icon :size="20">
                        <Delete></Delete>
                    </el-icon>
                </el-button>
            </el-form>
            <div class="p-3 flex justify-between items-center">
                <div>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                    <el-popconfirm
                        title="是否删除选中商品"
                        confirmButtonText="删除"
                        cancelButtonText="取消"
                        @confirm="handleDeleteGoods(selected_ids)">
                        <template #reference>
                            <el-button type="danger" :disabled="selected_ids.length == 0">批量删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button v-if="searchForm.tab == 'all' || searchForm.tab == 'off'" :disabled="selected_ids.length == 0" @click="handleChangeStatus(1)">批量上架</el-button>
                    <el-button v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'" :disabled="selected_ids.length == 0" @click="handleChangeStatus(0)">批量下架</el-button>
                </div>

                <el-tooltip effect="dark" content="刷新" placement="bottom">
                    <el-icon :size="20" class="cursor-pointer"
                        @click="getData(current_page, { limit: 10, keyword: searchForm.keyword })">
                        <Refresh></Refresh>
                    </el-icon>
                </el-tooltip>
            </div>
            <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" v-if="searchForm.tab != 'delete'" width="60"></el-table-column>
                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                        <div class="flex">
                            <el-image class="mr-3 rounded" :src="row.cover" fit="cover" :lazy="true" style="width: 50px;height: 50px;"></el-image>
                            <div class="flex-1">
                                <p>{{ row.title }}</p>
                                <div>
                                    <span class="text-rose-500">${{ row.min_price }}</span>
                                    <el-divider direction="vertical"></el-divider>
                                    <span class="text-gray-500 text-xs">${{ row.min_oprice }}</span>
                                </div>
                                <p class="text-gray-400 text-xs mb-1">分类:{{ row.category ? row.category.name : "未分类" }}</p>
                                <p class="text-gray-400 text-xs">创建时间:{{ row.create_time }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="实际销量" width="200" prop="sale_count" align="center">
                </el-table-column>
                <el-table-column label="商品状态" width="150" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" size="default">{{ row.status ? "上架" : "仓库" }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column v-if="searchForm.tab != 'delete'" label="审核状态" width="220" align="center">
                    <template #default="{ row }">
                        <div class="check-status-table-column flex flex-col items-center" v-if="row.ischeck == 0">
                            <el-button type="success" plain size="small">审核通过</el-button>
                            <el-button type="danger" plain class="mt-2" size="small">审核拒绝</el-button>
                        </div>
                        <span v-else :class="{' text-green-400':row.ischeck == 1,' text-rose-400':row.ischeck == 2}">{{ row.ischeck == 1? '已通过':'已拒绝' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="总库存" width="150" prop="stock" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <div v-if="searchForm.tab != 'delete'" style="user-select: none;" class="operation-table-column">
                            <el-button type="primary" text @click="handleUpdate(scope.row)">修改</el-button>
                            <el-button type="primary" text>规格</el-button>
                            <el-button type="primary" text @click="openBannerDrawer(scope.row.id)">设置轮播图</el-button>
                            <el-button type="primary" text>详情</el-button>
                            <el-popconfirm title="是否删除商品" confirm-button-text="确认" cancel-button-text="取消"
                                @confirm="handleDeleteGoods([scope.row.id])">
                                <template #reference>
                                    <el-button type="danger" text>删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <span v-else style="user-select: none;">暂无操作</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-center items-center p-3">
                <el-pagination background v-model:current-page="current_page" layout="prev, pager, next" :total="total"
                    :page-size="10" />
            </div>
            <FormDrawer ref="formDrawerRef" @submit="onSubmit" :title="drawer_title">
                <el-form ref="FormRef" :model="form" label-width="200" label-position="right" class="text-xl">
                    <el-form-item label="商品名称" prop="title" style="width: 75%;">
                        <el-input type="text" v-model="form.title" placeholder="不能超过60个字符"></el-input>
                    </el-form-item>
                    <el-form-item label="封面" prop="cover" style="width: 75%;">
                        <ChooseImage v-model="form.cover"></ChooseImage>
                    </el-form-item>
                    <el-form-item label="分类" prop="category_id" style="width: 50%;">
                        <el-select v-model="form.category_id" placeholder="选择分类">
                            <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述" prop="desc" style="width: 75%;">
                        <el-input type="textarea" v-model="form.desc" placeholder="选填" :rows="10" :cols="30"></el-input>
                    </el-form-item>
                    <el-form-item label="单位" prop="unit" style="width: 36%;">
                        <el-input type="text" v-model="form.unit"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="总库存" prop="stock" style="width: 49%;">
                        <el-input type="number"  v-model="form.stock">
                            <template #append>
                                <span>{{ form.unit }}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存预警" prop="min_stock" style="width: 49%;">
                        <el-input type="number"  v-model="form.min_stock">
                            <template #append>
                                <span>{{ form.unit }}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低售价" prop="min_price" style="width: 49%;">
                        <el-input type="number"  v-model="form.min_price">
                            <template #append>
                                <span>元</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="最低原价" prop="min_oprice" style="width: 49%;">
                        <el-input type="number"  v-model="form.min_oprice">
                            <template #append>
                                <span>元</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="库存显示" prop="stock_display">
                        <el-radio-group v-model="form.stock_display">
                            <el-radio :label="0" :value="0">隐藏</el-radio>
                            <el-radio :label="1" :value="1">显示</el-radio>
                        </el-radio-group>
                        
                    </el-form-item>
                    <el-form-item label="是否上架" prop="status" >
                        <el-radio-group v-model="form.status">
                            <el-radio :label="0" :value="0">放入仓库</el-radio>
                            <el-radio :label="1" :value="1">立即上架</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </FormDrawer>

            <FormDrawer ref="BannerDrawerRef" @submit="BannerOnSubmit" title="设置轮播图" size="50%" destroyOnClose>
                <el-form ref="BannerFormRef" :model="Bannerform" label-width="120" label-position="right">
                    <el-form-item label="轮播图" prop="title" style="width: 75%;">
                        <ChooseImage v-model="Bannerform.banners" :multi="true"></ChooseImage>
                    </el-form-item>
                </el-form>
            </FormDrawer>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { getCategoryList } from '@/api/category';
import { getGoodsList, updateGoodsStatus, createGoods, updateGoods, deleteGoods,readGoods,setGoodsBanner } from '@/api/goods';
import { ref, watch } from "vue"
import { ElMessage } from 'element-plus';
import FormDrawer from "@/components/FormDrawer.vue"
import ChooseImage from '@/components/ChooseImage.vue';
const tabbars = [{
    key:'all',
    name:'全部'
},{
    key:'checking',
    name:'审核中'
},
{
    key:'saling',
    name:'出售中'
},
{
    key:'off',
    name:'已下架'
},
{
    key:'min_stock',
    name:'库存预警'
},
{
    key:'delete',
    name:'回收站'
}]
const category_list = ref([])
getCategoryList().then(res=> category_list.value = res)
let tableData = ref([])
let current_page = ref(1)
let total = ref(0)
let roles = ref([])
function getData(page = 1, data = {}) {
    tableData.value = []
    getGoodsList(page, data).then(res => {
        tableData.value = res.list
        tableData.value.forEach(item => { item.loading = false })
        total.value = res.totalCount
        roles.value = res.roles
    })
}
watch(current_page, () => {
    getData(current_page.value, searchForm.value)
})
let searchForm = ref({
    title: '',
    tab:'all',
    category_id:null
})
getData()
const handleSearch = () => {
    getData(current_page.value, searchForm.value)
}
const handleReset = () => {
    searchForm.value.title = ""
    getData()
}
let selected_ids = ref([])
const handleSelectionChange = ($event:Array<any>) => {
    selected_ids.value = $event.map(obj => obj.id)
}

const handleChangeStatus = (status) => {
    updateGoodsStatus(selected_ids.value,status).then(res => {
        ElMessage({
            type: 'success',
            message: status ? "上架成功" : "下架成功"
        })
        getData(current_page.value, searchForm.value)
    })
}
let form = ref({
    "title":'',	 		
	"category_id":null,
	"cover":null,
	"desc":"", 
	"unit":"件",
	"stock":100,
	"min_stock":10,
	"status":1,
	"stock_display":1,
	"min_price":0,
	"min_oprice":0
})
// const rules = {
//     username : [{
//         required : true,

//     }],
//     password : [{
//         required : true
//     }],
//     role_id : [{
//         required : true
//     }],
//     status : [{
//         required : true
//     }],
//     avatar : [{
//         required : false
//     }],
// }
const FormRef = ref()
const formDrawerRef = ref()
let drawer_title = ref("新增管理员")
let update_id = 0
const handleAdd = () => {
    drawer_title.value = "新增商品"
    form.value = {
        "title":'',	 		
        "category_id":null,
        "cover":null,
        "desc":"", 
        "unit":"件",
        "stock":100,
        "min_stock":10,
        "status":1,
        "stock_display":1,
        "min_price":0,
        "min_oprice":0
    }
    formDrawerRef.value.open()
}
const handleUpdate = (row) => {
    update_id = row.id
    drawer_title.value = "修改商品"
    Object.keys(form.value).forEach(k=>form.value[k] = row[k])
    formDrawerRef.value.open()
}
const handleDeleteGoods = (ids)=>{
    deleteGoods(ids).then(res => {
        ElMessage({
            type: 'success',
            message: "删除商品成功"
        })
        getData(current_page.value, searchForm.value)
    })
}
const onSubmit = () => {
    FormRef.value.validate(valid => {
        if (!valid) return
        switch (drawer_title.value) {
            case "新增商品":
                createGoods(form.value).then(res => {
                    getData()
                    ElMessage({
                        message: '新增成功',
                        type: 'success',
                    })
                    formDrawerRef.value.close()
                })
                break;
            case "修改商品":
                updateGoods([update_id], form.value).then(res => {
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

const Bannerform = ref({
    banners:[]
})
const BannerDrawerRef = ref()
let banner_id ;
const openBannerDrawer = (id)=>{
    banner_id = id
    readGoods(id).then(res=>{
        Bannerform.value.banners = res.goodsBanner.map(o=>o.url)
        BannerDrawerRef.value.open()
    })
}
const BannerOnSubmit = ()=>{
    setGoodsBanner(banner_id,Bannerform.value).then(res=>{
        ElMessage({
            type: 'success',
            message: "设置轮播图成功"
        })
        BannerDrawerRef.value.close()
        getData(current_page.value, searchForm.value)
    })
}
</script>

<style scoped>
:deep(.check-status-table-column .el-button+.el-button) {
    margin-left: 0 !important;
}
:deep(.operation-table-column .el-button) {
    @apply px-1 !important;
}
</style>
