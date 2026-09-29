<template>
    <el-table v-if="GoodsSkuStore.goods_skus.length == 0" style="width: 100%">
        <el-table-column label="商品规格" width="200" align="center"/>
        <el-table-column v-for="header in tableHeaders" :key="header" :label="header"  align="center"/>
    </el-table>
    <el-table v-else :data="GoodsSkuStore.goods_skus" style="width: 100%" stripe>
        <el-table-column label="商品规格" :width="60 * GoodsSkuStore.goods_skus.length" align="center">
            <el-table-column v-for="(sku,index) in Object.values(GoodsSkuStore.goods_skus[0].skus)" :key="sku.id" :prop='`skus[${index}].value`' :label="sku.name" width="60" align="center"/>
        </el-table-column>
        <el-table-column v-for="header in tableHeaders" :key="header" :prop="tableHeadersToKeys[header]" :label="header" align="center">
            <template #default="{row}">
                <el-input type="number" v-model="row[tableHeadersToKeys[header]]" @change="handleSkuTableChange"></el-input>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
import { updateGoodsSkus} from '@/api/goods';
import useGoodsSkuStore from '@/store/useGoodsSkuStore.js';
import { onMounted } from 'vue';
const GoodsSkuStore = useGoodsSkuStore()
const tableHeaders = ['销售价','市场价','成本价','库存','体积','重量','编码']
const tableHeadersToKeys = {'销售价':"pprice",'市场价':"oprice",'成本价':"cprice",'库存':"stock",'体积':"volume",'重量':"weight",'编码':"code"}
const handleSkuTableChange = ()=>{
    updateGoodsSkus(GoodsSkuStore.goods_id,{
        "sku_type": 1,
        "goodsSkus":GoodsSkuStore.goods_skus
    })
    GoodsSkuStore.update_pre_ids_to_skus()
}
onMounted(()=>{
    
})
</script>

<style scoped></style>