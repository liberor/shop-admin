<template>
    <el-card shadow="never">
        <div class="flex items-center justify-between py-5 px-5">
            <el-button type="primary" @click="handleCreate">新增</el-button>
            <el-icon :size="24" @click="getData">
                <Refresh></Refresh>
            </el-icon>
        </div>
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" node-key="id"
            :default-expanded-keys="defaultExpandedKeys">
            <template #default="{ node, data }">
                <div class="flex items-center justify-between" style="width: 100%;">
                    <div class="flex items-center">
                        <el-tag :type="data.menu ? 'primary' : 'default'" class="mr-1">{{ data.menu ? '菜单' : '权限'
                            }}</el-tag>
                        <el-icon v-if="data.icon" :size="16" class="ml-1">
                            <component :is="data.icon"></component>
                        </el-icon>
                        <span>{{ data.name }}</span>
                    </div>
                    <div>
                        <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0"
                            class="mr-3"></el-switch>

                        <el-button type="primary" text style="padding: 5px 3px;" @click.stop="handleUpdate(data)">修改</el-button>
                        <el-button type="primary" text style="padding: 5px 3px;">增加</el-button>
                        <el-button type="primary" text style="padding: 5px 3px;">删除</el-button>
                    </div>
                </div>
            </template>
        </el-tree>
        <FormDrawer ref="formDrawerRef" @submit="onSubmit" :title="drawerTitle" :destroyOnClose="true"
            :loading="loading_drawer">
            <el-form ref="FormRef" :model="form" :rules="rules" label-width="120px" label-position="right">
                <el-form-item label="上级菜单" prop="rule_id" class="form-item">
                    <el-cascader v-model="form.rule_id" :options="options" :props="{children: 'child',label: 'name',value:'id',checkStrictly:true,emitPath:false}" 
                    clearable placeholder="请选择上级菜单"/>
                </el-form-item>
                <el-form-item label="菜单/规则" prop="menu" class="form-item">
                    <el-radio-group v-model="form.menu">
                        <el-radio :value="1" border>菜单</el-radio>
                        <el-radio :value="0" border>权限</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单/权限名称" prop="name" class="form-item">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" class="form-item" v-show="form.menu == 1">
                    <IconSelect v-model="form.icon"></IconSelect>
                </el-form-item>
                <el-form-item label="前端路由" prop="frontpath" class="form-item" v-show="form.menu == 1 && form.rule_id > 0">
                    <el-input v-model="form.frontpath"></el-input>
                </el-form-item>
                <el-form-item label="后端规则" prop="condition" class="form-item" v-show="form.menu == 0">
                    <el-input v-model="form.condition"></el-input>
                </el-form-item>
                <el-form-item label="请求方式" prop="method" class="form-item" v-show="form.menu == 0">
                    <el-select v-model="form.method" placeholder="请选择请求方式" style="width: 240px">
                        <el-option
                        v-for="item in ['GET','POST','PUT','DELETE']"
                        :key="item"
                        :label="item"
                        :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="order" class="form-item">
                    <el-input-number v-model="form.order" :min="0" :max="1000"/>
                </el-form-item>
                
            </el-form>
        </FormDrawer>
    </el-card>

</template>

<script lang="ts" setup>
import { getRuleList, createRule, updateRule } from '@/api/rule';
import FormDrawer from "@/components/FormDrawer.vue"
import IconSelect from '@/components/IconSelect.vue';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
let data = ref([])
let defaultExpandedKeys = ref([])
let options = ref([])
const defaultProps = {
    children: 'child',
    label: 'name',
}
function getData() {
    getRuleList().then(res => {
        data.value = res.list
        defaultExpandedKeys.value = res.list.map(item => item.id)
        options.value = res.rules
    })
}
getData()
const handleNodeClick = (item) => {
    console.log(item);

}
const formDrawerRef = ref()
let drawerTitle = ref("新增")
let loading_drawer = ref(false)
let form = ref({
    rule_id: 0,
    menu: 0,
    name: "",
    condition: "",
    method: "GET",
    status: 1,
    order: 50,
    icon: "",
    frontpath: ""

})
const rules = {
    rule_id:[{
        type : "number"
    }],
    menu:[{
        type : "number"
    }],
    name: [{
        type : "string"
    }],
    condition: [{
        type : "string"
    }],
    method: [{
        type : "string"
    }],
    status:[{
        type : "number"
    }],
    order: [{
        type : "number"
    }],
    icon: [{
        type : "string"
    }],
    frontpath: [{
        type : "string"
    }]
}

const onSubmit = ()=>{
    createRule(form.value).then(res=>{
        getData()
        ElMessage({
            type:"success",
            message : '创建成功'
        })
    })
}
const handleCreate = ()=>{
    formDrawerRef.value.open()
}
const handleUpdate = (data)=>{
    formDrawerRef.value.open()
}
</script>

<style scoped>
:deep(.el-tree-node__content) {
    padding: 20px;
}
</style>