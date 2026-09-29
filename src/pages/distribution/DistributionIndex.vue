<template>
    <div>
        <el-row :gutter="20" class="mb-5">
            <el-col v-for="(item, index) in list" :key="index" :span="6" :offset="0">
                <el-card shadow="never">
                    <div class="flex items-center">
                        <el-icon :size="24" :class="item.color" class="rounded-full" style="width: 50px;height: 50px;">
                            <User v-if="index == 0"></User>
                            <ShoppingCart v-if="index == 1"></ShoppingCart>
                            <PriceTag v-if="index == 2"></PriceTag>
                            <Timer v-if="index == 3"></Timer>
                        </el-icon>
                        <div class="ml-5">
                            <h2 class="text-lg font-bold">{{ item.value }}</h2>
                            <small class="text-xs text-gray-400">{{ item.label }}</small>
                        </div>
                    </div>
                </el-card>

            </el-col>
        </el-row>

        <el-card>
            <el-form :model="searchForm" class="flex">
                <el-form-item prop="type" style="width: 270px;margin-right: 10px;">
                    <el-radio-group v-model="searchForm.type" @change="handleSearch">
                        <el-radio-button label="全部" value="all"/>
                        <el-radio-button label="今天" value="today"/>
                        <el-radio-button label="昨天" value="yesterday"/>
                        <el-radio-button label="最近7天" value="last7days"/>
                    </el-radio-group>
                </el-form-item>
                <el-form-item  prop="starttime" style="width: 240px;">
                    <el-date-picker
                        v-model="searchForm.starttime"
                        type="date"
                        placeholder="开始日期"
                        format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD"
                        @change="handleSearch"
                    />
                </el-form-item>
                <el-form-item  prop="endtime" style="width: 240px;">
                    <el-date-picker
                        v-model="searchForm.endtime"
                        type="date"
                        placeholder="结束日期"
                        format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD"
                        @change="handleSearch"
                    />
                </el-form-item>
                <el-form-item prop="keyword" style="width: 300px;margin-right: 10px;" @keyup.enter.stop="handleSearch">
                    <el-input type="text" v-model="searchForm.keyword" placeholder="关键词"></el-input>
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
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column label="ID" width="70" prop="id" align="center"></el-table-column>
                <el-table-column label="头像" width="100" align="center">
                    <template #default="{ row }">
                        <el-avatar :size="40" :src="row.avatar">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                        </el-avatar>
                    </template>
                </el-table-column>
                <el-table-column label="用户信息" width="150" >
                    <template #default="{ row }">
                        <div class="text-xs">
                            <p>用户:{{ row.username ? row.username:'未知'}}</p>
                            <p>昵称:{{ row.nickname ? row.nickname:'未知'}}</p>
                            <p>姓名:{{ row.user_info.name? row.user_info.name :'未知'}}</p>
                            <p>电话:{{ row.phone ? row.phone:'未知'}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="推广用户数量" width="150" prop="share_num" align="center"></el-table-column>
                <el-table-column label="订单数量" width="150" prop="share_order_num" align="center"></el-table-column>
                <el-table-column label="订单金额" width="150" prop="order_price" align="center"></el-table-column>
                <el-table-column label="账户佣金" width="150" prop="commission" align="center"></el-table-column>
                <el-table-column label="已提现金额" width="150" prop="cash_out_price" align="center"></el-table-column>
                <el-table-column label="提现次数" width="150" prop="cash_out_time" align="center"></el-table-column>
                <el-table-column label="未提现金额" width="150" prop="no_cash_out_price" align="center"></el-table-column>
                <el-table-column label="操作" align="center" fixed="right">
                    <template #default="scope">
                        <el-button type="primary" text @click="openDrawer(scope.row.id)">推广人</el-button>
                        <el-button type="primary" text @click="openDrawerOrder(scope.row.id)">推广订单</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-center items-center p-3">
                <el-pagination background v-model:current-page="current_page" layout="prev, pager, next" :total="total"
                    :page-size="10" />
            </div>
            
        </el-card>
        <FormDrawer ref="formDrawerRef" :title="drawer_title" :needButtons="false" size="60%">
            <el-form :model="form" label-width="100" label-position="right" class="text-xl mb-5">
                <el-form-item label="时间选择" prop="type" >
                    <el-radio-group v-model="form.type">
                        <el-radio-button label="全部" value="all"/>
                        <el-radio-button label="今天" value="today"/>
                        <el-radio-button label="昨天" value="yesterday"/>
                        <el-radio-button label="最近7天" value="last7days"/>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="开始日期" prop="starttime">
                    <el-date-picker
                        v-model="form.starttime"
                        type="date"
                        placeholder="开始日期"
                        format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD"
                    />
                </el-form-item>
                <el-form-item label="结束日期" prop="endtime">
                    <el-date-picker
                        v-model="form.endtime"
                        type="date"
                        placeholder="结束日期"
                        format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD"
                    />
                </el-form-item>
                <el-form-item label="用户类型" prop="level" >
                    <el-radio-group v-model="form.level" @change="handleDrawerSearch">
                        <el-radio-button label="全部" :value="0"/>
                        <el-radio-button label="一级推广" :value="1"/>
                        <el-radio-button label="二级推广" :value="2"/>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="default" @click="handleDrawerSearch">搜索</el-button>
                    <el-button type="primary" size="default" @click="handleDrawerReset">重置</el-button>
                </el-form-item>
            </el-form>
            <el-table v-if="drawer_title == '推广人列表'" :data="drawerTableData" stripe row-key="id" style="width: 100%">
                <el-table-column prop="id" label="UID" width="90"  align="center"></el-table-column>
                <el-table-column label="头像" width="200" align="center">
                    <template #default="{ row }">
                        <div class="flex items-center justify-center">
                            <el-avatar :size="40" :src="row.avatar">
                                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                            </el-avatar>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户信息" align="center"></el-table-column>
                <el-table-column prop="share_num" label="推广数" align="center"></el-table-column>
                <el-table-column prop="share_order_num" label="推广订单数"  align="center"></el-table-column>
                <el-table-column prop="create_time" label="绑定时间"  align="center"></el-table-column>
            </el-table>
            <el-table v-else :data="drawerTableData" stripe row-key="id" style="width: 100%">
                <el-table-column label="订单号" align="center">
                    <template #default="{row}">
                        <div>{{row.order ? row.order.no : '空' }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="用户名|昵称|手机" align="center">
                    <template #default="{row}">
                        <div>{{row.user ? row.user.username +'|' +row.user.nickname +'|' +row.user.phone : '空'}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="时间"  align="center"></el-table-column>
                <el-table-column prop="commission" label="返佣金额"  align="center"></el-table-column>
            </el-table>
            <div class="flex justify-center items-center p-3">
                <el-pagination background v-model:current-page="drawer_current_page" layout="prev, pager, next" :total="drawer_total"
                    :page-size="10" />
            </div>
        </FormDrawer>
    </div>
</template>

<script lang="ts" setup>
import { getAgentStatistics,getAgentList,getAgentOrderList } from '@/api/distribution'
import { ref, watch } from "vue"
import FormDrawer from "@/components/FormDrawer.vue"
import { ElMessage } from 'element-plus';
const list = ref([])
getAgentStatistics().then(res => {
    list.value = res.panels
})

let tableData = ref([])
let current_page = ref(1)
let total = ref(0)
const user_levels = ref([])
function getData(page=1,data={}) {
    getAgentList(page, data).then(res => {
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
    type:'all',
    starttime:null,
    endtime:null,
})
getData()
const handleSearch = ()=>{
    getData(current_page.value,searchForm.value)
}
const handleReset = ()=>{
    Object.assign(searchForm.value,{
    keyword : '',
    type:'all',
    starttime:null,
    endtime:null,
    })
    getData()
}

const formDrawerRef = ref()
let drawer_title = ref('推广人列表')
let drawer_current_page = ref(1)
let drawer_total = ref(0)
const form = ref({
    type:'all',
    starttime:null,
    endtime:null,
    level:0,
    user_id:null
})
const drawerTableData = ref([])
const openDrawer = (id)=>{
    form.value.user_id = id
    Object.assign(form.value,{
        type:'all',
        starttime:null,
        endtime:null,
        level:0,
    })
    drawer_title.value = '推广人列表'
    handleDrawerSearch()
    drawer_current_page.value = 1
    formDrawerRef.value.open()
}
const handleDrawerSearch = ()=>{
    drawerTableData.value = []
    drawer_total.value = 0
    if(drawer_title.value == "推广人列表"){
        getAgentList(drawer_current_page.value,form.value).then(res=>{
            drawerTableData.value = res.list
            drawer_total.value = res.totalCount
        })
    }else if(drawer_title.value == "推广订单列表"){
        getAgentOrderList(drawer_current_page.value,form.value).then(res=>{
            drawerTableData.value = res.list
            drawer_total.value = res.totalCount
        })
    }
    
}
const handleDrawerReset=()=>{
    Object.assign(form.value,{
        type:'all',
        starttime:null,
        endtime:null,
        level:0,
    })
    handleDrawerSearch()
}
watch(drawer_current_page,()=>{
    handleDrawerSearch()
})
const openDrawerOrder = (id)=>{
    form.value.user_id = id
    Object.assign(form.value,{
        type:'all',
        starttime:null,
        endtime:null,
        level:0,
    })
    drawer_current_page.value = 1
    drawer_title.value = '推广订单列表'
    handleDrawerSearch()
    formDrawerRef.value.open()
}
</script>

<style scoped></style>