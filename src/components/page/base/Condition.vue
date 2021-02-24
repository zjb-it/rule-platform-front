<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>条件
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-lx-add"
                    class="handle-del mr10"
                    @click="handleAdd"
                >添加
                </el-button>
                <el-input v-model="query.query" placeholder="名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <af-table-column prop="id" label="ID" align="center"></af-table-column>
                <af-table-column prop="name" label="名称"></af-table-column>
                <af-table-column prop="config" label="配置"></af-table-column>

            </el-table>


            <el-dialog title="添加条件" :visible.sync="addVisible" width="30%" @close="closedDiaglog">
                <el-form ref="conditionForm" :model="conditionForm" label-width="70px" :rules="conditionFormRules">

                    <el-form-item label="名称" prop="name">
                        <el-input v-model="conditionForm.name"></el-input>
                    </el-form-item>


                    <el-form-item label="左值" style=" margin-left: 5%; margin-bottom: 0px" prop="config.rightVariable.valueType">

                        <div style="display: flex">
                            <el-select v-model="conditionForm.config.leftVariable.valueType" slot="prepend"
                                       placeholder="请选择" style="width: 28%;margin-right: 4%"
                            @change="resetConditionLeft('conditionLeft')">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>

                            <ConditionLeft ref="conditionLeft" style="width: 68%"
                                           v-bind:data="conditionForm.config.leftVariable"
                                           v-bind:inputValueType="conditionForm.config.leftVariable.valueType"></ConditionLeft>

                        </div>

                    </el-form-item>

                    <el-form-item label="符号" style=" margin-left: 5%" prop="config.symbol">

                        <div>
                            <el-select v-model="conditionForm.config.symbol" slot="prepend" style="width:28%"
                                       :disabled="conditionForm.config.leftVariable.value===''"
                                       @focus="(()=>{searchSymbol(conditionForm.config.leftVariable.value)})"
                                       value-key="symbol"
                            >
                                <el-option
                                    v-for="item in symbols"
                                    :key="item.symbol"
                                    :label="item.symbol"
                                    :value="item"
                                >
                                </el-option>
                            </el-select>
                        </div>
                    </el-form-item>


                    <el-form-item label="右值" style=" margin-left: 5%;margin-bottom: 0px" prop="config.rightVariable.valueType">
                        <div style="display: flex">
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

                            <ConditionLeft ref="conditionRight" style="width: 68%"
                                           v-bind:data="conditionForm.config.rightVariable"
                                           v-bind:inputValueType="conditionForm.config.rightVariable.valueType"
                                           v-bind:leftValueDataType="conditionForm.config.leftVariable.value.valueDataType===''?conditionForm.config.leftVariable.valueType:conditionForm.config.leftVariable.value.valueDataType"></ConditionLeft>

                        </div>

                    </el-form-item>


                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" v-model="conditionForm.description"></el-input>
                    </el-form-item>

                    <el-form-item size="large">
                        <el-button type="primary" @click="addCondition()">立即创建</el-button>
                        <el-button @click="addVisible=false">取消</el-button>
                    </el-form-item>
                </el-form>

            </el-dialog>


            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.page.pageIndex"
                    :page-size="query.page.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
    </div>
</template>

<script>
import request from '@/utils/request';
import ConditionLeft from '@/components/page/base/ConditionLeft';

export const listConditions = query => {
    return request({
        url: 'condition/list',
        method: 'post',
        data: query
    });
};


export default {
    name: 'conditionTable',
    components: {
        ConditionLeft
    },
    data() {
        let defaultForm= {
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
        }
        return {
            query: {
                'query': '',
                page: {
                    pageIndex: 1,
                    pageSize: 10
                }

            },
            searchFunctionName: '',
            loading: false,
            symbols: [],
            tableData: [],
            addVisible: false,
            pageTotal: 0,
            leftValueDataType: '',
            conditionForm: defaultForm,
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
            idx: -1,
            id: -1,
            conditionFormRules: {
                name: [
                    { required: true, message: '请输入条件名称', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        resetConditionLeft(formName) {
            this.$refs[formName].reset();
        },
        getData() {
            listConditions(this.query).then(res => {
                this.tableData = res.data;
                this.pageTotal = res.total || 10;
            });
        },
        searchSymbol(leftValueDataType) {
            if (leftValueDataType.valueDataType) {
                leftValueDataType = leftValueDataType.valueDataType;
            } else {
                leftValueDataType = this.conditionForm.config.leftVariable.valueType;
            }
            request.post('/symbol/get', { 'valueDataType': leftValueDataType }).then(res => {
                this.symbols = res.data;
            });
        },
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


        closedDiaglog() {
            this.$refs.conditionForm.resetFields();
            this.$refs.conditionLeft.reset();
            this.$refs.conditionRight.reset();
        },

        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query.page, 'pageIndex', 1);
            this.getData();
        },

        remoteMethod(query) {
            this.searchFunctionName = query;
            this.listFunction();

        },


        // 编辑操作
        handleAdd() {
            this.addVisible = true;
            this.conditionForm= {
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
            }
        },
        // 保存编辑
       async addCondition() {
            var param = JSON.parse(JSON.stringify(this.conditionForm));
            param.config.symbol = this.conditionForm.config.symbol.symbol;
            this.processValue(param.config.leftVariable);
            this.processValue(param.config.rightVariable);
            let validateForm = await this.$refs.conditionLeft.validateForm();
            let validateForm1 =await this.$refs.conditionRight.validateForm();
            if (validateForm && validateForm1) {
                this.$refs.conditionForm.validate((valid) => {
                    if (valid) {
                        request.post('/condition/add', param).then(res => {
                            this.addVisible = false;
                            this.getData();
                        });
                    }
                });
            }


        },
        processValue(value) {
            // :{
            //         "value":{
            //             "id":14524,
            //                 "name":"111",
            //                 "valueDataType":"NUMBER",
            //                 "valueDataTypeDesc":"数字",
            //                 "functionName":"GetJsonPropertyFunction",
            //                 "description":null
            //         },
            //         "valueDataType":"",
            //             "valueName":"",
            //             "valueType":"VARIABLE"
            //     }
            if (value.valueType === 'ELEMENT' || value.valueType === 'VARIABLE') {
                value.valueDataType = value.value.valueDataType;
                value.valueName = value.value.name;
                value.value = value.value.id;
            } else {
                // {
                //     "value":"1",
                //     "valueDataType":"",
                //     "valueName":"",
                //     "valueType":"NUMBER"
                // }
                value.valueDataType = value.valueType;
                value.valueName=value.value
            }
        },

        // 分页导航
        handlePageChange(val) {
            this.$set(this.query.page, 'pageIndex', val);
            this.getData();
        }
    },
    created() {
        this.getData();
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
