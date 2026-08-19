<template>
    <div>
        <el-tabs v-model="searchForm.tab" @tab-change="handleSearch">
            <el-tab-pane v-for="item in tabbars" :key="item.key" :label="item.name" :name="item.key"></el-tab-pane>
        </el-tabs>
        <el-card>
            <el-form :model="searchForm" class="flex" label-width="10" label-position="right">
                <el-form-item prop="no" style="width: 300px;" @keyup.enter.stop="handleSearch">
                    <el-input type="text" v-model="searchForm.no" placeholder="订单编号"></el-input>
                </el-form-item>
                <el-form-item prop="name" style="width: 300px;" @keyup.enter.stop="handleSearch">
                    <el-input type="text" v-model="searchForm.name" placeholder="收货人"></el-input>
                </el-form-item>
                <el-form-item prop="phone" style="width: 300px;" @keyup.enter.stop="handleSearch">
                    <el-input type="text" v-model="searchForm.phone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="starttime">
                    <el-date-picker
                        v-model="searchForm.starttime"
                        type="date"
                        placeholder="开始日期"
                        format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD"
                    />
                </el-form-item>
                <el-form-item prop="endtime">
                    <el-date-picker
                        v-model="searchForm.endtime"
                        type="date"
                        placeholder="结束日期"
                        format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD"
                    />
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
                    <el-popconfirm
                        title="是否删除选中订单"
                        confirmButtonText="删除"
                        cancelButtonText="取消"
                        @confirm="handleDeleteOrders(selected_ids)">
                        <template #reference>
                            <el-button type="danger" :disabled="selected_ids.length == 0">批量删除</el-button>
                        </template>
                    </el-popconfirm>
                </div>

                <div class=" flex items-center justify-between w-[60px]">
                    <el-tooltip effect="dark" content="刷新" placement="left">
                        <el-icon :size="20" class="cursor-pointer"
                            @click="getData(current_page, searchForm)">
                            <Refresh></Refresh>
                        </el-icon>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="导出" placement="bottom">
                        <el-icon :size="20" class="cursor-pointer"
                            @click="handleOpenDownloadDrawer">
                            <Download />
                        </el-icon>
                    </el-tooltip>
                </div>
            </div>
            <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="60"></el-table-column>
                <el-table-column label="商品" width="350">
                    <template #default="{ row }">
                        <div>
                            <div class="flex items-center justify-between">
                                <div>
                                    <div>订单号:</div>
                                    <small>{{ row.no }}</small>
                                </div>
                                <div>
                                    <div>下单时间:</div>
                                    <small>{{ row.create_time }}</small>
                                </div>
                            </div>
                            <div v-for="order_item in row.order_items" :key="order_item.goods_id" class="flex items-center mb-3">
                                <el-image style="width: 50px;height: 50px;" :src="order_item.goods_item?.cover" fit="fill" :lazy="true">
                                    <template #error>
                                        <div class="image-viewer-slot image-slot">
                                            <el-icon class="bg-gray-300" style="width: 50px;height: 50px;"><component :is="Picture"></component></el-icon>
                                        </div>
                                    </template>
                                </el-image>
                                <span class="ml-2 text-blue-500">{{ order_item.goods_item ? order_item.goods_item.title : '商品已被删除'}}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="实际付款" width="200" prop="total_price" align="center">
                </el-table-column>
                <el-table-column label="买家" width="200" align="center">
                    <template #default="{ row }">
                        <div class="flex flex-col justify-center items-center">
                            <div>{{ row.user.username }}</div>
                            <div>(用户ID: {{ row.user.id }})</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="交易状态" width="350">
                    <template #default="{ row }">
                        <div class="flex ">
                            <div class="mr-2">
                                <div>付款状态:</div>
                                <div>发货状态:</div>
                                <div>收货状态:</div>
                            </div>
                            <div class="flex flex-col">
                                <el-tag v-if="row.payment_method == null" type="info">未支付</el-tag>
                                <el-tag v-if="row.payment_method == 'alipay'" type="primary">支付宝支付</el-tag>
                                <el-tag v-if="row.payment_method == 'wechat'" type="success">微信支付</el-tag>

                                <el-tag :type="row.ship_status == 'pending' ? 'info':'success'">{{ row.ship_status == 'pending' ? '未发货':'已发货' }}</el-tag>
                                
                                <el-tag :type="row.ship_status == 'received' ? 'success':'info'">{{ row.ship_status == 'received' ? '已收货':'未收货' }}</el-tag>
                                
                            </div>
                        </div>
                    </template>
                </el-table-column>
                
                <el-table-column label="操作" align="center">
                    <template #default="{row}">
                        <div style="user-select: none;" class="operation-table-column">
                            <el-button type="primary" text>订单详情</el-button>
                            <el-button v-if="row.payment_method != null && row.ship_status == 'pending' && row.refund_status != 'applied'" type="primary" text>订单发货</el-button>
                            <el-button v-if="row.refund_status == 'applied'" type="primary" text>同意退款</el-button>
                            <el-button v-if="row.refund_status == 'applied'" type="primary" text>拒绝退款</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-center items-center p-3">
                <el-pagination background v-model:current-page="current_page" layout="prev, pager, next" :total="total"
                    :page-size="10" />
            </div>
            <FormDrawer ref="formDrawerRef" title="订单详情" >
                
            </FormDrawer>
            <FormDrawer ref="DownloadformDrawerRef" title="导出订单" :needButtons="false">
                <el-form :model="Downloadform" label-width="160px" label-position="right" style="width: 80%;">
                    <el-form-item label="订单类型" prop="tab">
                        <el-select v-model="Downloadform.tab" filterable>
                            <el-option v-for="item in tabbars"
                                :key="item.key"
                                :label="item.name"
                                :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间范围">
                        <el-date-picker
                            v-model="Downloadform.starttime_and_endtime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            value-format="YYYY-MM-DD"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onDownloadSubmit" :loading="DownloadformLoading">导出</el-button>
                        <el-button v-if="DownloadformLoading == false">取消</el-button>
                    </el-form-item>
                </el-form>
            </FormDrawer>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { getCategoryList } from '@/api/category';
import { getOrderList,deleteOrder,excelExport } from '@/api/order';
import { computed, ref, watch } from "vue"
import { ElMessage } from 'element-plus';
import FormDrawer from "@/components/FormDrawer.vue"
import { Picture } from '@element-plus/icons-vue';
import { start } from 'nprogress';
const tabbars = [{
    key:'all',
    name:'全部'
},{
    key:'nopay',
    name:'待支付'
},
{
    key:'noship',
    name:'待发货'
},
{
    key:'shiped',
    name:'待收货'
},
{
    key:'received',
    name:'已收货'
},
{
    key:'finish',
    name:'已完成'
},
{
    key:'closed',
    name:'已关闭'
},
{
    key:'refunding',
    name:'退款中'
},
]
const category_list = ref([])
getCategoryList().then(res=> category_list.value = res)
let tableData = ref([])
let current_page = ref(1)
let total = ref(0)
let roles = ref([])
function getData(page = 1, data = {}) {
    tableData.value = []
    getOrderList(page, data).then(res => {
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
    tab:'all',
    no:'',
    starttime:'',
    endtime:'',
    name:'',
    phone:'',

})
getData()
const handleSearch = () => {
    getData(current_page.value, searchForm.value)
}
const handleReset = () => {
    searchForm.value = {
        tab:'all',
        no:'',
        starttime:'',
        endtime:'',
        name:'',
        phone:'',
    }
    getData()
}
let selected_ids = ref([])
const handleSelectionChange = ($event:Array<any>) => {
    selected_ids.value = $event.map(obj => obj.id)
}

const formDrawerRef = ref()
const handleDeleteOrders = (ids)=>{
    deleteOrder(ids).then(res => {
        ElMessage({
            type: 'success',
            message: "删除订单成功"
        })
        getData(current_page.value, searchForm.value)
    })
}


const Downloadform = ref({
    tab:'all',
    starttime_and_endtime:[],
})
let starttime = computed(()=>Downloadform.value.starttime_and_endtime[0])
let endtime = computed(()=>Downloadform.value.starttime_and_endtime[1])
const DownloadformDrawerRef = ref()
const handleOpenDownloadDrawer = ()=>{
    DownloadformDrawerRef.value.open()
}
let DownloadformLoading = ref(false)
const onDownloadSubmit=()=>{
    DownloadformLoading.value = true
    excelExport({
        tab:Downloadform.value.tab,
        starttime:starttime.value,
        endtime:endtime.value
    }).then(res=>{
        const url = URL.createObjectURL(res)
        const a = document.createElement('a')
        a.href = url
        a.download = '订单导出.xlsx'
        a.click()
        URL.revokeObjectURL(url)
    }).finally(()=>{
        DownloadformLoading.value = false
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
