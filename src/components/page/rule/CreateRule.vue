<template>

    <div style="height: 100%;">
        <el-steps :active="1">
            <el-step title="规则定义" description=""></el-step>
            <el-step title="规则配置" description=""></el-step>
            <el-step title="规则测试" description=""></el-step>
        </el-steps>

        <el-form ref="form" :model="form" label-width="35%">

            <el-form-item
                label="code"
                prop="code"
                style="margin-top: 5%"
                :rules="[
                    { required: true, message: 'code不能为空',trigger:'blur'},
                    ]">
                <el-input type="code" v-model="form.code" auto-complete="off" style="width: 40%"></el-input>
            </el-form-item>


            <el-form-item
                label="名称"
                prop="name"
                :rules="[
                    { required: true, message: '名称不能为空',trigger:'blur'},
                    ]">
                <el-input v-model="form.name" style="width: 40%"></el-input>
            </el-form-item>

            <el-form-item label="描述" prop="description">
                <el-input type="textarea" v-model="form.description" style="width: 40%"
                          :autosize="{ minRows: 4, maxRows: 8}"></el-input>
            </el-form-item>

            <el-form-item size="large">
                <el-button type="primary" @click="toConfig">下一步</el-button>
                <el-button @click="$router.push('/rule')">取消</el-button>
            </el-form-item>
        </el-form>

    </div>


</template>

<script>

import request from '@/utils/request';

export default {
    name: 'basetable',
    data() {
        return {
            form: {}

        };
    },
    created() {
        if (localStorage.getItem('rule')){

            this.form=JSON.parse(localStorage.getItem('rule'))
        }


    },
    methods: {

        // 保存编辑
        toConfig() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    localStorage.setItem("rule",JSON.stringify(this.form))
                    this.$router.push({ path: '/ConfigRule'})
                }
            });

        }

    }
};
</script>

<style>

</style>
