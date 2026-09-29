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
                    <el-button v-if="searchForm.tab != 'delete'" type="primary" @click="handleAdd">新增</el-button>
                    <el-popconfirm
                        title="是否删除选中商品"
                        confirmButtonText="删除"
                        cancelButtonText="取消"
                        @confirm="handleDeleteGoods(selected_ids)">
                        <template #reference>
                            <el-button type="danger" v-if="searchForm.tab != 'delete'" :disabled="selected_ids.length == 0">批量删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button v-if="searchForm.tab == 'all' || searchForm.tab == 'off'" :disabled="selected_ids.length == 0" @click="handleChangeStatus(1)">批量上架</el-button>
                    <el-button v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'" :disabled="selected_ids.length == 0" @click="handleChangeStatus(0)">批量下架</el-button>
                    
                    <el-button v-if="searchForm.tab == 'delete'" type="warning" :disabled="selected_ids.length == 0" @click="handleRestore">批量恢复</el-button>
                    <el-button v-if="searchForm.tab == 'delete'" type="danger" :disabled="selected_ids.length == 0" @click="handleDeleteForever">彻底删除</el-button>
                    
                </div>

                <el-tooltip effect="dark" content="刷新" placement="bottom">
                    <el-icon :size="20" class="cursor-pointer"
                        @click="getData(current_page, searchForm)">
                        <Refresh></Refresh>
                    </el-icon>
                </el-tooltip>
            </div>
            <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="60"></el-table-column>
                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                        <div class="flex">
                            <el-image class="mr-3 rounded" :src="row.cover" fit="cover" :lazy="true" style="width: 90px;height: 90px;"></el-image>
                            <div class="flex-1 flex flex-col justify-between">
                                <p>{{ row.title }}</p>
                                <div>
                                    <span class="text-rose-500">${{ row.min_price }}</span>
                                    <el-divider direction="vertical"></el-divider>
                                    <span class="text-gray-500 text-[14px]">${{ row.min_oprice }}</span>
                                </div>
                                <p class="text-gray-400 text-[14px] mb-1">分类:{{ row.category ? row.category.name : "未分类" }}</p>
                                <p class="text-gray-400 text-xs">创建时间:{{ row.create_time }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="实际销量" width="120" prop="sale_count"  align="center">
                </el-table-column>
                <el-table-column label="商品状态" width="150" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" size="large" class="text-sm">{{ row.status ? "上架" : "仓库" }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column v-if="searchForm.tab != 'delete'" label="审核状态" width="220" align="center">
                    <template #default="{ row }">
                        <div class="check-status-table-column flex flex-col items-center" v-if="row.ischeck == 0">
                            <el-button type="success" plain  @click="handleCheckGoods(row.id,1)">审核通过</el-button>
                            <el-button type="danger" plain class="mt-2" @click="handleCheckGoods(row.id,2)">审核拒绝</el-button>
                        </div>
                        <span v-else :class="{' text-green-400':row.ischeck == 1,' text-rose-400':row.ischeck == 2,'text-[16px]':true}">{{ row.ischeck == 1? '已通过':'已拒绝' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="总库存" width="130" prop="stock" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <div v-if="searchForm.tab != 'delete'" style="user-select: none;" class="operation-table-column">
                            <el-button type="primary" text @click="handleUpdate(scope.row)">修改</el-button>
                            <el-button :type="scope.row.sku_value == null ? 'danger':'primary'" text @click="openSkusDrawer(scope.row)">商品规格</el-button>
                            <el-button :type="scope.row.goods_banner.length == 0 ? 'danger':'primary'" text @click="openBannerDrawer(scope.row.id)">设置轮播图</el-button>
                            <el-button :type="!scope.row.content ? 'danger':'primary'" text @click="openContentDrawer(scope.row)">商品详情</el-button>
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
            <FormDrawer ref="formDrawerRef" @submit="onSubmit" :title="drawer_title" >
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

            <FormDrawer ref="ContentDrawerRef" @submit="ContentOnSubmit" title="设置商品详情" size="40%" destroyOnClose>
                <el-form ref="ContentFormRef" :model="Contentform">
                    <el-form-item prop="title">
                        <Editor v-model="Contentform.content"></Editor>
                    </el-form-item>
                </el-form>
            </FormDrawer>

            <FormDrawer ref="SkusDrawerRef" @submit="SkusOnSubmit" title="设置规格" size="60%" destroyOnClose>
                <el-form ref="SkusFormRef" :model="Skusform" label-width="150" label-position="right">
                    <el-form-item label="规格类型" prop="sku_type">
                        <el-radio-group v-model="Skusform.sku_type">
                            <el-radio label="单规格" :value="0"></el-radio>
                            <el-radio label="多规格" :value="1"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <template v-if="Skusform.sku_type == 0">
                        <el-form-item label="市场价格" style="width: 36%;">
                            <el-input v-model="Skusform.sku_value.oprice">
                                <template #append>元</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="销售价格" style="width: 36%;">
                            <el-input v-model="Skusform.sku_value.pprice">
                                <template #append>元</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="成本价格" style="width: 36%;">
                            <el-input v-model="Skusform.sku_value.cprice">
                                <template #append>元</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" style="width: 36%;">
                            <el-input v-model="Skusform.sku_value.weight">
                                <template #append>公斤</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="商品体积" style="width: 36%;">
                            <el-input v-model="Skusform.sku_value.volume">
                                <template #append>立方米</template>
                            </el-input>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <el-form-item class="flex-wrap" label="规格选项" style="width: 80%;">
                            <SkuCard></SkuCard>
                            <el-button type="success" @click="addSkuCard">添加规格</el-button>
                        </el-form-item>
                        <el-form-item label="规格设置" style="width: 90%;">
                            <SkuTable></SkuTable>
                        </el-form-item>
                    </template>
                </el-form>
            </FormDrawer>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { getCategoryList } from '@/api/category';
import { getGoodsList, updateGoodsStatus, createGoods, updateGoods, deleteGoods,readGoods,
    setGoodsBanner,updateGoodsSkus,restoreGoods,destroyGoods,checkGoods,createGoodsSkusCard,updateGoodsSkusCard,
    deleteGoodsSkusCard,sortGoodsSkusCard,updateGoodsSkusCardValue,deleteGoodsSkusCardValue,
    createGoodsSkusCardValue } from '@/api/goods';
import { ref, watch } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import FormDrawer from "@/components/FormDrawer.vue"
import ChooseImage from '@/components/ChooseImage.vue';
import Editor from '@/components/Editor.vue';
import SkuCard from './components/SkuCard.vue';
import SkuTable from './components/SkuTable.vue';
import useGoodsSkuStore from '@/store/useGoodsSkuStore.js';
const GoodsSkuStore = useGoodsSkuStore()
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

const Contentform = ref({
    content:''
})
const ContentDrawerRef = ref()
let content_id ;
const openContentDrawer=(row)=>{
    content_id = row.id
    Contentform.value.content = row.content
    ContentDrawerRef.value.open()
}
const ContentOnSubmit = ()=>{
    updateGoods(content_id,Contentform.value).then(res=>{
        ElMessage({
            type: 'success',
            message: "设置详情成功"
        })
        ContentDrawerRef.value.close()
        getData(current_page.value, searchForm.value)
    })
}


const Skusform = ref({
    "sku_type": 0,
    "sku_value": {
        "oprice": 0,
        "pprice": 0,
        "cprice": 0,
        "weight": 0,
        "volume": 0
    },
})
const SkusDrawerRef = ref()
let skus_id ;
const openSkusDrawer=(row)=>{
    console.log(row);
    
    GoodsSkuStore.goods_skus_card = row.goods_skus_card
    GoodsSkuStore.goods_skus = row.goods_skus
    GoodsSkuStore.update_pre_ids_to_skus()
    GoodsSkuStore.update_skus_basedon_cards()
    GoodsSkuStore.update_goods_skus_basedon_ids()
    GoodsSkuStore.update_pre_ids_to_skus()
    skus_id = row.id
    GoodsSkuStore.goods_id = row.id
    Skusform.value.sku_type = row.sku_type
    Skusform.value.sku_value = row.sku_value || {
        "oprice": 0,
        "pprice": 0,
        "cprice": 0,
        "weight": 0,
        "volume": 0
    }
    SkusDrawerRef.value.open()
}
const SkusOnSubmit = ()=>{
    updateGoodsSkus(skus_id,Skusform.value.sku_type == 0 ? Skusform.value : {sku_type:1,"goodsSkus":GoodsSkuStore.goods_skus}).then(res=>{
        ElMessage({
            type: 'success',
            message: "设置规格成功",
        })
        SkusDrawerRef.value.close()
        getData(current_page.value, searchForm.value)
    })
}

const handleRestore = ()=>{
    restoreGoods(selected_ids.value).then(res=>{
        ElMessage({
            type:'success',
            message:"选中商品已恢复"
        })
        getData(current_page.value, searchForm.value)
    })
}
const handleDeleteForever = ()=>{
    ElMessageBox.confirm("是否彻底删除选中商品?",{
        type:'warning',
        confirmButtonText:"确定",
        cancelButtonText:"取消"
    }).then(()=>{
        destroyGoods(selected_ids.value).then(res=>{
            ElMessage({
                type:'success',
                message:"选中商品已彻底删除"
            })
            getData(current_page.value, searchForm.value)
        })
    }).catch(()=>{
        ElMessage({
            type:'info',
            message:"已取消操作"
        })
    })
}

const handleCheckGoods = (id,ischeck)=>{
    checkGoods(id,ischeck).then(res=>{
        ElMessage({
            type:'success',
            message:ischeck?"商品已通过审核":"商品未通过审核"
        })
        getData(current_page.value, searchForm.value)
    })
}

//添加规格选项
const addSkuCard = ()=>{
    createGoodsSkusCard({
        goods_id: skus_id,
        name: "规格选项",
        order: 50,
        type: 0,
    }).then(res=>{
        res.goods_skus_card_value = []
        GoodsSkuStore.create_sku(res)
    })
}

//修改规格选项
// const updateSkuCard = ()=>{
//     updateGoodsSkusCard(  ,{
//         goods_id: ,
//         name: "规格选项",
//         order: ,
//         type: ,
//     }).then(res=>{

//     })
// }

//删除规格选项
// const deleteSkuCard = ()=>{
//     deleteGoodsSkusCard(  ).then(res=>{

//     })
// }
//排序规格选项
// const sortSkuCard = ()=>{
//     sortGoodsSkusCard({}).then(res=>{

//     })
// }
//添加值
// createGoodsSkusCardValue
//修改值
// updateGoodsSkusCardValue
//删除值
// deleteGoodsSkusCardValue
</script>

<style scoped>
:deep(.check-status-table-column .el-button+.el-button) {
    margin-left: 0 !important;
}
:deep(.operation-table-column .el-button) {
    @apply px-1 text-[16px] !important;
}
</style>
