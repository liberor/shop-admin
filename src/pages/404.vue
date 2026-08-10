<template>
    <div>
        <el-result
            class="box"
            icon="warning"
            title="404 Not Found"
            sub-title="This page is missing..."
        >
            <template #extra>
            <el-button type="primary" @click="$router.back()">Back</el-button>
            </template>
        </el-result>
    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.box {
    position: fixed;
    top: 50%;
    left:50%;
    transform: translate(-50%,-80%);
}
</style>