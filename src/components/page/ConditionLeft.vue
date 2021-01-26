<template>


    <el-form ref="conditionForm" :model="aaa" label-width="70px" :rules="conditionFormRules">


                                        <el-select v-model="conditionForm.config.rightVariable.valueType" slot="prepend"
                                                   placeholder="请选择" style="width: 28%;margin-right: 4%"
                                                   @focus="listRightValueDataType"
                                                   :disabled="conditionForm.config.symbol===''"
                                        >
                                            <el-option
                                                v-for="item in rightValueDataTypes"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            >
                                            </el-option>
                                        </el-select>

                                        <el-input
                                            v-if="conditionForm.config.rightVariable.valueType!=='ELEMENT' && conditionForm.config.rightVariable.valueType!=='VARIABLE'"
                                            v-model="conditionForm.config.rightVariable.value" style="width: 68%"
                                            :disabled="conditionForm.config.rightVariable.valueType===''"
                                        ></el-input>

                                        <el-select
                                            v-else
                                            v-model="conditionForm.config.rightVariable.value"
                                            filterable
                                            remote
                                            clearable
                                            :disabled="conditionForm.config.rightVariable.valueType===''"
                                            reserve-keyword
                                            placeholder="请输入名称"
                                            @focus="focusValue"
                                            value-key="id"
                                            :remote-method="((queryString)=>{remoteValue(queryString,conditionForm.config.rightVariable.value)})"
                                            :loading="loading" style="width: 68%">
                                            <el-option
                                                v-for="item in values"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>

    </el-form>


</template>

<script>
import request from '@/utils/request';


export default {
    props: {
        data: {
            require: true,
        }
    },

    data() {
        return {
            leftValue: {},
            loading: false,
            symbols: [],
            leftValueDataType: '',
            conditionForm: {
                config: {
                    leftVariable: {
                        value: '',
                        valueDataType: '',
                        valueName: '',
                        valueType: ''
                    },
                    rightVariable: {
                        value: '',
                        valueDataType: '',
                        valueName: '',
                        valueType: ''
                    },
                    symbol: ''
                },
                description: '',
                name: ''
            },
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
            ]
        };
    },
    methods: {



        listRightValueDataType() {
            this.$data.rightValueDataTypes = this.$options.data().rightValueDataTypes;
            for (const valueDataType of this.conditionForm.config.symbol.valueDataTypes) {
                for (const option of this.options) {
                    if (option.value === valueDataType) {
                        this.rightValueDataTypes.push(option);
                    }
                }
            }
        },

        async focusValue() {
            if (this.conditionForm.config.leftVariable.valueType === 'ELEMENT') {
                this.queryElement();
            } else if (this.conditionForm.config.leftVariable.valueType === 'VARIABLE') {
                this.queryVariable();
            }
        },
        remoteValue(value, valueDataType) {
            if (this.conditionForm.config.leftVariable.valueType === 'ELEMENT') {
                this.queryElement(value, valueDataType);
            } else if (this.conditionForm.config.leftVariable.valueType === 'VARIABLE') {
                this.queryVariable(value, valueDataType);
            }
        },
        queryElement(name, valueDataType) {
            var param = {};
            if (name) {
                param.name = queryString;
            }
            if (valueDataType) {
                param.valueDataType = [valueDataType];
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
        queryVariable(name, valueDataType) {
            var param = {};
            if (name) {
                param.name = queryString;
            }

            if (valueDataType) {
                param.valueDataType = [valueDataType];
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
        },

    },
    created() {
        this.leftValue = this.data
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
