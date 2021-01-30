<template>


    <el-form ref="valueForm" :model="valueForm" :rules="valueRule">


        <el-row :gutter="10" STYLE="background-color: #F5F5F5">

            <el-col :span="6" style="width: 33%">
                <el-form-item prop="valueDataType">
                    <el-select v-model="valueForm.valueDataType" placeholder="数据类型">
                        <el-option
                            v-for="item in valueDataTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6" class="col-width">
                <el-form-item prop="code">
                    <el-input
                        placeholder="参数code"
                        v-model="valueForm.code"
                    ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6" class="col-width">
                <el-form-item prop="name">
                    <el-input placeholder="参数名称"
                              v-model="valueForm.name"
                    ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="1" style="width: 2%;margin-right: 2%">
                <i class="el-icon-plus" @click="addParam"></i>
            </el-col>

            <el-col :span="1" style="width: 2%">
                <i class="el-icon-delete" @click="delParam(valueForm)"></i>
            </el-col>


        </el-row>

    </el-form>

</template>

<script>

export default {
    props: {
        data: {
            require: true
        },
        index: {
            require: true
        },
        domains: {
            require: true
        }
    },

    data() {

        return {
            valueForm: this.data,
            paramIndex: this.index,
            loading: false,
            params: this.domains,

            valueDataTypes: [
                {
                    value: 'COLLECTION',
                    label: '集合'
                },
                {
                    value: 'BOOLEAN',
                    label: '布尔'
                },
                {
                    value: 'STRING',
                    label: '字符串'
                }, {
                    value: 'NUMBER',
                    label: '数字'
                }, {
                    value: 'JSONOBJECT',
                    label: 'JSON对象'
                }
            ],
            options: [

                {
                    value: 'STRING',
                    label: '字符串'
                },
                {
                    value: 'BOOLEAN',
                    label: '布尔'
                },
                {
                    value: 'COLLECTION',
                    label: '集合'
                },
                {
                    value: 'NUMBER',
                    label: '数字'
                },
                {
                    value: 'JSONOBJECT',
                    label: 'json对象'
                }
            ],
            values: [],

            valueRule: {
                code: [
                    { required: true, message: '不能为空', trigger: 'blur' }

                ],
                name: [
                    { required: true, message: '不能为空', trigger: 'blur' }

                ],
                valueDataType: [
                    { required: true, message: '不能为空', trigger: 'blur' }

                ]
            }
        };
    },
    watch: {

        data: function(newValue, oldValue) {
            this.valueForm = newValue;
        },
        index: function(newValue, oldValue) {
            this.paramIndex = newValue;
        },
        domains: function(newValue, oldValue) {
            this.params = newValue;
        }
    },
    methods: {
        reset() {
            this.$refs.valueForm.resetFields();
        },

        validateForm() {
            let flag = null;
            this.$refs.valueForm.validate(valid => {
                flag = valid;
                return flag;

            });
            return flag;
        },
        addParam() {
            this.params.push({
                value: '',
                key: this.paramIndex
            });
        },
        delParam(item) {

            var index = this.params.indexOf(item);

            if (index !== -1) {
                this.params.splice(index, 1);
            }
        }

    }


};
</script>

<style>
.col-width {
    width: 28%;
}

.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}

.el-input-group__prepend {
    width: 28%;
}


</style>
