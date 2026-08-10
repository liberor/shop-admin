<template>
    <div class="flex items-center">
        <el-icon v-if="modelValue" class="mr-2" :size="20"><component :is="modelValue"></component></el-icon>
        <el-select :modelValue="modelValue" placeholder="请选择图标" @change="handleChange" filterable style="width: 240px">
            <el-option v-for="item in icons" 
            :key="item" :label="item" :value="item">
                <div class="flex items-center">
                    <el-icon class="mr-3"><component :is="item"></component></el-icon>
                    <span>{{ item }}</span>
                </div>
            </el-option>
        </el-select>
    </div>
</template>

<script lang="ts" setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ref } from 'vue';


const icons = ref(Object.keys(ElementPlusIconsVue))

defineProps({
    modelValue:String
})
const emit = defineEmits(["update:modelValue"])
const handleChange = (e) =>{
    emit("update:modelValue",e)
}
</script>

<style scoped></style>