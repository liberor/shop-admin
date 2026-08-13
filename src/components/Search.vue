<template>
    <el-form :model="searchForm" class="flex" label-position="right">
        <el-form-item prop="title" style="width: 300px;" @keyup.enter.stop="handleSearch">
            <el-input type="text" v-model="searchForm.title" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item prop="category_id" label="商品分类" style="width: 300px;margin-left: 49px;">
            <el-select v-model="searchForm.category_id" placeholder="选择商品分类" clearable filterable>
                <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
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
</template>

<script lang="ts" setup>

</script>

<style scoped></style>