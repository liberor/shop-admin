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
                <el-table-column label="优惠券名称" width="350">
                    <template #default="{ row }">
                        <div class="border border-dashed py-2 px-4 rounded"
                            :class="row.statusText == '领取中' ? 'active' : 'inactive'">
                            <h5 class="font-bold text-md">{{ row.name }}</h5>
                            <small>{{ row.start_time + '~' + row.end_time }}</small>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="statusText" label="status" />
                <el-table-column label="优惠">
                    <template #default="{ row }">
                        {{ row.type == 0 ? "满减" : "折扣 " }}{{ row.type == 0 ? "$" + row.value : (+row.value).toFixed(0) +
                        " 折" }}
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="发放数量" />
                <el-table-column prop="used" label="已使用" />
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button v-if="scope.row.statusText == '未开始'" type="primary" text 
                            @click="handleUpdate(scope.row)">修改</el-button>
                        <el-popconfirm v-if="scope.row.statusText !== '领取中'" title="是否删除该优惠券" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button type="danger" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                        <el-popconfirm v-if="scope.row.statusText == '领取中'" title="是否使该优惠券失效" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleBan(scope.row.id)">
                            <template #reference>
                                <el-button type="danger">失效</el-button>
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
            <el-form ref="FormRef" :model="form" label-width="100" label-position="right">
                <el-form-item label="优惠券名称" prop="name" class="form-item">
                    <el-input type="text" v-model="form.name" style="width: 50%;"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type" class="form-item">
                    <el-radio-group v-model="form.type" @change="">
                        <el-radio :label="0" :value="0">满减</el-radio>
                        <el-radio :label="1" :value="1">折扣</el-radio>
                    </el-radio-group>

                </el-form-item>
                <el-form-item label="面值" prop="value" class="form-item" style="width: 30%;">
                    <el-input v-model="form.value">
                        <template #append> <span>{{ form.type ? "折" : "$" }}</span> </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="发行量" prop="total" class="form-item">
                    <el-input-number v-model="form.total" :min="0" :max="10000" />
                </el-form-item>
                <el-form-item label="最低使用价格" prop="min_price" class="form-item">
                    <el-input-number v-model="form.min_price" :min="0" />
                </el-form-item>
                <el-form-item label="排序" prop="order" class="form-item" style="width: 50%;">
                    <el-input-number v-model="form.order" :min="0" :max="1000" />
                </el-form-item>
                <el-form-item label="活动时间" class="form-item">
                    <el-date-picker v-model="timerange" type="datetimerange" range-separator="To"
                        start-placeholder="开始时间" end-placeholder="结束时间" 
                        value-format="YYYY-MM-DD HH:mm:ss" :editable="false"/>
                </el-form-item>
                <el-form-item label="描述" prop="desc" class="form-item">
                    <el-input type="textarea" v-model="form.desc" />
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<script lang="ts" setup>
import { getCouponList, createCoupon, updateCoupon, deleteCoupon, updateCouponStatus } from '@/api/coupon';
import { computed, reactive, ref, watch } from 'vue';
import FormDrawer from '@/components/FormDrawer.vue';
import { ElMessage } from 'element-plus';
let current_page = ref(1)
let total = ref(0)
let loading = ref(false)
const tableData = ref([])
const getData = () => {
    loading.value = true
    getCouponList(current_page.value).then(res => {
        total.value = res.totalCount
        tableData.value = res.list.map(item => {
            item.statusText = formatStatus(item)
            return item
        })
    }).finally(() => {
        loading.value = false
    })
}
getData()
watch(current_page, () => {
    getData()
})
function formatStatus(row) {
    let status = "领取中"
    let start_time = (new Date(row.start_time)).getTime()
    let now = (new Date()).getTime()
    let end_time = (new Date(row.end_time)).getTime()
    if (now > end_time) {
        status = "已结束"
    } else if (now < start_time) {
        status = "未开始"
    } else if (row.status == 0) {
        status = "已失效"
    }
    return status
}
const form = reactive({
    name: "",
    type: 0,
    value: 0,
    total: 100,
    min_price: 0,
    start_time: null,
    end_time: null,
    order: 50,
    desc: ""
})
const timerange = computed({
    get() {
        return form.start_time && form.end_time ? [form.start_time, form.end_time] : []
    },
    set(val) {
        form.start_time = val[0]
        form.end_time = val[1]
    }
})

const formDrawerRef = ref()
const FormRef = ref()
let drawer_title = ref("新增优惠券")
let loading_drawer = ref(false)
let update_id = ref(0)
const handleAdd = () => {
    clearForm()
    drawer_title.value = "新增优惠券"
    formDrawerRef.value.open()
}
const onSubmit = () => {
    FormRef.value.validate(valid => {
        if (!valid) return
        const old_start_time = form.start_time
        const old_end_time = form.end_time
        form.start_time = (new Date(form.start_time)).getTime()
        form.end_time = (new Date(form.end_time)).getTime()
        switch (drawer_title.value) {
            case "新增优惠券":
                loading_drawer.value = true
                createCoupon(form).then(res => {
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
            case "修改优惠券":
                loading_drawer.value = true
                updateCoupon(update_id.value, form).then(res => {
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
        form.start_time = old_start_time
        form.end_time = old_end_time
    })
}
const handleUpdate = (row) => {
    update_id.value = row.id
    drawer_title.value = "修改优惠券"
    Object.keys(form).forEach(k=>form[k] = row[k])
    formDrawerRef.value.open()
}
const handleDelete = (id) => {
    loading.value = true
    deleteCoupon(id).then(res => {
        getData()
        ElMessage({
            message: '删除成功',
            type: 'success',
        })
    }).finally(() => {
        loading.value = false
    })
}
const handleBan = (id)=>{
    loading.value = true
    updateCouponStatus(id).then(res => {
        getData()
        ElMessage({
            message: '已失效',
            type: 'success',
        })
    }).finally(() => {
        loading.value = false
    })
}
const clearForm = () => {
    Object.assign(form, {
        name: "",
        type: 0,
        value: 0,
        total: 100,
        min_price: 0,
        start_time: null,
        end_time: null,
        order: 50,
        desc: ""
    })
}
</script>

<style scoped>
.active {
    @apply border-rose-200 bg-rose-50 text-red-400;
}

.inactive {
    @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>