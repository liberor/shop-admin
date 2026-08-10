<template>
    <el-drawer v-model="showDrawer" direction="rtl" :size="size" :close-on-click-modal="closeOnClickModal"
        :title="title" :destroy-on-close="destroyOnClose">
        <div class="form-drawer">
            <div class="body">
                <slot></slot>
            </div>
            <div class="actions" v-if="needButtons">
                <el-button type="primary" @click="submit" :loading="loading">{{ confirmText }}</el-button>
                <el-button type="default" @click="close">cancel</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
const showDrawer = ref(false)
const open = () => { showDrawer.value = true }
const close = () => { showDrawer.value = false }
const emit = defineEmits(["submit", "cancel"])
const submit = () => emit("submit")
watch(showDrawer, (val) => {
    if (val == false) {
        emit("cancel")
    }
})
const props = defineProps({
    title: {
        type: String,
        default: "title"
    },
    size: {
        type: String,
        default: "45%"
    },
    destroyOnClose: {
        type: Boolean,
        default: false
    },
    closeOnClickModal: {
        type: Boolean,
        default: false
    },
    confirmText: {
        type: String,
        default: "submit"
    },
    loading: {
        type: Boolean,
        default: false
    },
    needButtons: {
        type: Boolean,
        default: true
    }
})
defineExpose({ open, close })
</script>

<style scoped>
.form-drawer {
    @apply flex flex-col justify-between;
    height: 100%;
    width: 100%;
}

.form-drawer .body {
    flex: 1;
    overflow: auto;
}

.form-drawer .actions {
    @apply flex items-center;
    height: 50px;
}

.body::-webkit-scrollbar {
    width: 4px;
    height: 3px;
}

.body::-webkit-scrollbar-track {
    /* background: transparent;  */
    border-radius: 3px;
}

.body::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.body::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
    cursor: pointer;
}
</style>