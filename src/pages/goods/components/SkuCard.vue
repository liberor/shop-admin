<template>
    <div class=" w-full mb-3">
        <el-card v-for="(sku, index) in GoodsSkuStore.goods_skus_card" :key="index" shadow="never"
            style="margin-bottom: 20px;">
            <template #header>
                <div class="flex items-center justify-between p-2 bg-gray-50">
                    <el-input placeholder="规格名称" style="width: 200px;" v-model="sku.name"
                        @change="handleSkuChange(sku)">
                        <template #append>
                            <el-icon @click="openDialog(sku)" class="cursor-pointer">
                                <MoreFilled />
                            </el-icon>
                        </template>
                    </el-input>
                    <div>
                        <el-button style="padding: 8px 4px;margin-left: 2px;" :disabled="index == 0"
                            @click="handleSkuSort(index, -1)"><el-icon>
                                <Top></Top>
                            </el-icon></el-button>
                        <el-button style="padding: 8px 4px;margin-left: 2px;" @click="handleSkuSort(index, 1)"
                            :disabled="index == GoodsSkuStore.goods_skus_card.length - 1"><el-icon>
                                <Bottom></Bottom>
                            </el-icon></el-button>
                        <el-button style="padding: 8px 4px;margin-left: 2px;" @click="handleSkuDelete(sku)"><el-icon>
                                <Delete></Delete>
                            </el-icon></el-button>
                    </div>
                </div>
            </template>
            <div>
                <el-tag v-for="sku_value in sku.goods_skus_card_value" :key="sku_value.id" closable
                    :disable-transitions="false" @close="handleClose(sku_value)" style="margin-right: 10px;">
                    <input v-model="sku_value.value" @change="handleSkuValueChange(sku_value)" class="rounded"
                        style="padding: 3px;outline: none;width: 90px;" />
                </el-tag>
                <el-input v-if="sku.inputVisible" :ref="el => inputRefs[index] = el" v-model="inputValue" class="w-20"
                    size="small" @keyup.enter="handleInputConfirm(sku)" @blur="handleInputConfirm(sku)" />
                <el-button v-else class="button-new-tag" size="small" @click="showInput(sku, index)">
                    + 添加规格值
                </el-button>
            </div>
        </el-card>
        <el-dialog v-model="centerDialogVisible" title="选择规格" style="width: 80vw;height: 80vh;" align-center>
            <el-row>
                <el-col :span="6" style="min-width: 180px;max-width: 250px;" class="image-aside">
                    <div class="top" :style="{ height: 60 + 'vh', overflowY: 'auto' }">
                        <div class="aside-list-item" v-for="item in tableData" :key="item.id"
                            :class="{ active: active?.id == item.id }"
                            @click="if (active != item) { checkList = [] }; active = item">
                            <span class="truncate">{{ item.name }}</span>
                        </div>
                    </div>
                    <div class="bottom">
                        <el-pagination background layout="prev, next" :total="total" v-model:current-page="current_page"
                            :page-size="10" @current-change="getData" />
                    </div>
                </el-col>
                <el-col style="flex:1;" class="image-main">
                    <div class="top px-5" :style="{ height: 60 + 'vh', overflowY: 'auto', overflowX: 'hidden' }">
                        <el-checkbox-group v-model="checkList">
                            <el-checkbox size="large" v-for="(value, index) in valueArr" :key="index" :label="value"
                                :value="value" style="width: 5vw;height: 3vh;" />
                        </el-checkbox-group>
                    </div>
                </el-col>
            </el-row>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import {updateGoodsSkusCard, deleteGoodsSkusCard,
    sortGoodsSkusCard, updateGoodsSkusCardValue, deleteGoodsSkusCardValue, createGoodsSkusCardValue
} from '@/api/goods';
import { getSkusList } from '@/api/skus';
import useGoodsSkuStore from '@/store/useGoodsSkuStore.js';
const GoodsSkuStore = useGoodsSkuStore()
import { computed, nextTick, ref, watch } from 'vue'
const inputValue = ref('')
const inputRefs = ref({})
const handleClose = (sku_value) => {
    deleteGoodsSkusCardValue(sku_value.id).then(res => {
        for (let o of GoodsSkuStore.goods_skus_card) {
            if (o.id == sku_value.goods_skus_card_id) {
                let index;
                o.goods_skus_card_value.forEach((item, idx) => {
                    if (item.id == sku_value.id) {
                        index = idx
                    }
                })
                o.goods_skus_card_value.splice(index, 1)
                break;
            }
        }
    })
}
const showInput = (sku, index) => {
    sku.inputVisible = true
    nextTick(() => {
        inputRefs.value[index]?.focus()
    })
}
const handleInputConfirm = (sku) => {
    if (inputValue.value) {
        createGoodsSkusCardValue({
            "goods_skus_card_id": sku.id,
            "name": sku.name,
            "order": 50,
            "value": inputValue.value
        }).then(res => {
            sku.goods_skus_card_value.push(res)
        })
    }
    sku.inputVisible = false
    inputValue.value = ''
}

const handleSkuChange = (sku) => {
    updateGoodsSkusCard(sku.id, sku)
}
const handleSkuDelete = (sku) => {
    deleteGoodsSkusCard(sku.id).then(res => {
        GoodsSkuStore.delete_sku(sku.id)
    })
}
const handleSkuSort = (index, type) => {
    let swapIndex = index + type;
    let temp = GoodsSkuStore.goods_skus_card[swapIndex];
    GoodsSkuStore.goods_skus_card[swapIndex] = GoodsSkuStore.goods_skus_card[index]
    GoodsSkuStore.goods_skus_card[index] = temp;
    const sortdata = GoodsSkuStore.goods_skus_card.map((o, idx) => { return { 'id': o.id, 'order': idx + 1 } })
    sortGoodsSkusCard({ sortdata })
}
const handleSkuValueChange = (sku_value) => {
    updateGoodsSkusCardValue(sku_value.id, {
        "goods_skus_card_id": sku_value.goods_skus_card_id,
        "name": sku_value.name,
        "order": sku_value.order,
        "value": sku_value.value
    })
}

const centerDialogVisible = ref(false)
const current_sku = ref(null)
const openDialog = (sku) => {
    centerDialogVisible.value = true
    current_sku.value = sku
}
const tableData = ref([])
let current_page = ref(1)
let total = ref(0)
let active = ref(null)
const checkList = ref([])
const valueArr = computed(() => {
    if (active.value == null) return [];
    return active.value.default.split(',')
})
const getData = () => {
    getSkusList(current_page.value).then(res => {
        total.value = res.totalCount
        tableData.value = res.list
        active.value = total.value > 0 ? tableData.value[0] : null
    })
}
getData()
const handleSubmit = () => {
    current_sku.value.name = active.value.name
    updateGoodsSkusCard(current_sku.value.id, current_sku.value)
    for (let value of checkList.value) {
        if (value) {
            createGoodsSkusCardValue({
                "goods_skus_card_id": current_sku.value.id,
                "name": current_sku.value.name,
                "order": 50,
                "value": value
            }).then(res => {
                current_sku.value.goods_skus_card_value.push(res)
            })
        }
    }
    centerDialogVisible.value = false
}

watch(() => GoodsSkuStore.goods_skus_card, ( ) => {
    GoodsSkuStore.update_skus_basedon_cards()
    GoodsSkuStore.update_goods_skus_basedon_ids()
    GoodsSkuStore.update_pre_ids_to_skus()
}, { deep: true })
</script>

<style scoped>
:deep(.el-card__header) {
    @apply p-0;
}

.image-aside {
    border-right: 1px solid #eee;
}

.top::-webkit-scrollbar {
    width: 4px;
    height: 3px;
}

.top::-webkit-scrollbar-track {
    /* background: transparent;  */
    border-radius: 3px;
}

.top::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.top::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
    cursor: pointer;
}

.bottom {
    height: 50px;
    @apply flex justify-center items-center;
}

.aside-list-item {
    @apply flex justify-between items-center cursor-pointer p-3 text-sm text-gray-600;
    border-bottom: 1px solid #f4f4f4;
}

.aside-list-item:hover,
.active {
    @apply bg-blue-50;
}

:deep(.el-checkbox.el-checkbox--large .el-checkbox__label) {
    font-size: 18px;
}
</style>