<template>

    <div style="height: 100%;">
        <el-steps :active="1">
            <el-step title="规则集定义" description=""></el-step>
            <el-step title="规则集配置" description=""></el-step>
            <el-step title="规则集测试" description=""></el-step>
        </el-steps>

        <el-form ref="form" :model="form" label-width="35%">

            <el-form-item
                label="code"
                prop="code"
                style="margin-top: 5%"
                :rules="[
                    { required: true, message: 'code不能为空',trigger:'blur'},
                    ]">
                <el-input :disabled="edit" type="code" v-model="form.code" auto-complete="off"
                          style="width: 40%"></el-input>
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

            <el-form-item label="特殊资源">
                <el-radio-group v-model="form.resource">
                    <el-radio label="线上品牌商赞助"></el-radio>
                    <el-radio label="线下场地免费"></el-radio>
                </el-radio-group>
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
            form: { code: '', name: '', description: '' },
            edit: false
        };
    },
    activated() {
        this.$refs.form.resetFields();
        let ruleSetId = this.$route.query.id;
        this.edit = false;
        if (ruleSetId) {
            this.edit = true;
            request.get('ruleSet/getDef?id=' + ruleSetId).then(res => {
                this.form = res.data;
            });
        }
    },
    created() {

    },
    methods: {


        // 保存编辑
        toConfig() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    request.post('/ruleSet/addDef',this.form).then(res=>{
                        router.push({ path: 'register', query: { id: 'private' } });
                    })
                }
            });

        }

    }
};
</script>

<style>

</style>
