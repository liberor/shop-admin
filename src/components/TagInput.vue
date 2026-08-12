<template>
    <div class="flex gap-2">
        <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
            {{ tag }}
        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag" size="small" @click="showInput">
            + 添加值
        </el-button>
    </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { computed, nextTick, ref, watch } from 'vue'
const props = defineProps(['modelValue'])

const emit = defineEmits(['update:modelValue'])
const inputValue = ref('')
const dynamicTags = computed(() => {
    return props.modelValue.length ? props.modelValue.split(',') : []
})

const inputVisible = ref(false)
const InputRef = ref()
const handleClose = (tag) => {
    let ret = dynamicTags.value
    ret.splice(dynamicTags.value.indexOf(tag), 1)
    emit('update:modelValue', ret.join(','))
}
const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value.input.focus()
    })
}
const handleInputConfirm = () => {
    if (inputValue.value) {
        if (dynamicTags.value.find(item => item == inputValue.value)) {
            ElMessage({
                type:"warning",
                message:'该规格已存在'
            })
        } else {
            let ret = dynamicTags.value
            ret.push(inputValue.value)
            emit('update:modelValue', ret.join(','))
        }
    }
    inputVisible.value = false
    inputValue.value = ''
}
</script>