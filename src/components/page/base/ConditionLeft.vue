<template>


    <el-form ref="valueForm" :model="valueForm" :rules="valueRule">
        <el-form-item prop="value">
            <el-input
                v-if="valueType!=='ELEMENT' && valueType!=='VARIABLE'"
                v-model="valueForm.value"
                :disabled="valueForm.valueType==='' || echo"
            ></el-input>

            <el-select
                style="width: 100%"
                v-else
                v-model="valueForm.value"
                filterable
                remote
                clearable
                :disabled="valueForm.valueType==='' || echo"
                reserve-keyword
                placeholder="请输入名称"
                @focus="focusValue"
                value-key="id"
                :remote-method="((queryString)=>{remoteValue(queryString,valueForm.valueType)})"
                :loading="loading">
                <el-option
                    v-for="item in values"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                >
                </el-option>
            </el-select>
        </el-form-item>
    </el-form>

</template>

<script>
import request from '@/utils/request';
import validateConstant from '@/utils/ValidateConstant';


export default {
    props: {
        data: {
            require: true
        },
        inputValueType: {
            require: true
        },
        leftValueDataType:{

        },
        echo:{}
    },

    data() {
        return {
            valueForm: 	{
                description: "",
                name: "",
                value: "",
                valueDataType: "",
                valueDescription: "",
                valueType: ""
            },
            valueType: this.inputValueType,
            valueDataType:this.leftValueDataType,

            loading: false,

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
                }, {
                    value: 'OBJECT',
                    label: 'JAVA对象'
                }
            ],
            options: [
                {
                    value: 'ELEMENT',
                    label: '元素'
                },
                {
                    value: 'VARIABLE',
                    label: '变量'
                },
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
                }
            ],
            values: [],
            rightValueDataTypes: [
                {
                    value: 'ELEMENT',
                    label: '元素'
                },
                {
                    value: 'VARIABLE',
                    label: '变量'
                }
            ],
            valueRule: {
                value: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            validateConstant(rule, value, callback, this.valueType)
                        },
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    watch: {
        inputValueType: function(newValue, oldValue) {
            this.valueType = newValue;
        },
        data: function(newValue, oldValue) {
            if (newValue) {
                this.valueForm = newValue;
            }
        },
        leftValueDataType: function(newValue, oldValue) {
            this.valueDataType = newValue;
        }
    },
    created() {

        if (this.data.value) {
            this.valueForm=this.data
        }
        if (this.echo) {
            if (this.valueType === 'ELEMENT') {
                request.get('/element/get?id='+this.valueForm.value).then(res=>{
                    this.valueForm.value=res.data
                    this.values.push(res.data)
                })
            }else if (this.valueType === 'VARIABLE') {
                request.get('/variable/get?id='+this.valueForm.value).then(res=>{
                    this.valueForm.value=res.data
                    this.values.push(res.data)
                })
            }
        }
        console.log(this.valueForm)

    },
    methods: {
        reset() {
            this.$refs.valueForm.resetFields();
        },

        validateForm () {
            let flag = true
            this.$refs.valueForm.validate(valid => {
                if (valid) {
                } else {
                    flag = false
                }
            })
            return flag
        },
        async focusValue() {
            if (this.valueForm.valueType === 'ELEMENT') {
                this.queryElement();
            } else if (this.valueForm.valueType === 'VARIABLE') {
                this.queryVariable();
            }
        },
        remoteValue(value, valueType) {
            if (valueType === 'ELEMENT') {
                this.queryElement(value);

            } else if (valueType === 'VARIABLE') {
                this.queryVariable(value);
            }
        },
        queryElement(name) {
            var param = {};
            if (name) {
                param.name = name;
            }
            if (this.valueDataType) {
                param.valueDataType = [this.valueDataType];
            }
            return request.post('element/list', {
                query: param,
                page: {
                    pageIndex: 1,
                    pageSize: 10
                }
            }).then(res => {
                this.values = res.data;
            });
        },
        queryVariable(name) {
            var param = {};
            if (name) {
                param.name = name;
            }

            if (this.valueDataType) {
                param.valueDataType = [this.valueDataType];
            }
            request.post('variable/list', {
                query: param,
                page: {
                    pageIndex: 1,
                    pageSize: 10
                }
            }).then(res => {
                this.values = res.data;
            });
        }

    }


};
</script>

<style>


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
