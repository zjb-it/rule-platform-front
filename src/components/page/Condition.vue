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
                <el-form ref="conditionForm" :model="conditionForm" label-width="70px">

                    <el-form-item label="名称" prop="name">
                        <el-input v-model="conditionForm.name"></el-input>
                    </el-form-item>


                    <el-form-item label="左值" style=" margin-left: 15%" prop="leftVariable">

                        <div>
                            <el-autocomplete
                                v-model="conditionForm.config.leftVariable.valueDescription"
                                placeholder="请输入内容"
                                :disabled="conditionForm.config.leftVariable.valueType===''"
                                :fetch-suggestions="((queryString,cb)=>{querySearchAsync(queryString,cb,conditionForm.config.leftVariable.valueType)})"
                                @select="((value)=>{handleSelect(value,i,conditionForm.config.leftVariable.valueType)})"
                            >
                                <el-select v-model="conditionForm.config.leftVariable.valueType" slot="prepend"
                                           placeholder="请选择">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-autocomplete>
                        </div>

                    </el-form-item>

                    <el-form-item label="符号" style=" margin-left: 15%" prop="symbol">

                        <div>
                            <el-select v-model="conditionForm.config.symbol" slot="prepend" style="width:28%"
                                       :disabled="conditionForm.config.leftVariable.valueDescription===''"
                                       @focus="searchSymbol()"
                            >
                                <el-option
                                    v-for="item in symbols"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                      </div>
                    </el-form-item>

                    <el-form-item label="左值" style=" margin-left: 15%" prop="rightVariable">

                        <div>
                            <el-autocomplete
                                v-model="conditionForm.config.rightVariable.valueDescription"
                                placeholder="请输入内容"
                                :disabled="conditionForm.config.rightVariable.valueType===''"
                                :fetch-suggestions="((queryString,cb)=>{querySearchAsync(queryString,cb,conditionForm.config.rightVariable.valueType)})"
                                @select="((value)=>{handleSelect(value,i,conditionForm.config.rightVariable.valueType)})"
                            >
                                <el-select v-model="conditionForm.config.rightVariable.valueType" slot="prepend"
                                           :disabled="conditionForm.config.symbol===''"
                                           placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-autocomplete>
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

export const listConditions = query => {
    return request({
        url: 'condition/list',
        method: 'post',
        data: query
    });
};
export default {
    name: 'conditionTable',
    data() {
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
            symbols:[],
            tableData: [],
            addVisible: false,
            pageTotal: 0,
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
                    value: 'CONSTANT',
                    label: '固定值'
                }
            ],
            idx: -1,
            id: -1
        };
    },
    methods: {

        getData() {
            listConditions(this.query).then(res => {
                this.tableData = res.data;
                this.pageTotal = res.total || 10;
            });
        },
        querySearchAsync(queryString, cb, valueType, valueDataType) {

            if (valueType !== 'CONSTANT' && queryString && queryString !== '' && cb) {
                var param={};
                param.name=queryString
                if (valueDataType){
                    param.valueDataType=[valueDataType]
                }
                var data = [];
                if (valueType === 'VARIABLE') {
                    request.post('variable/list',{
                        query: param,
                        page: {
                            pageIndex: 1,
                            pageSize: 10
                        }
                    }).then(function(res) {
                        for (let i = 0; i < res.data.length; i++) {
                            data[i] = { 'value': res.data[i].name, 'id': res.data[i].id };
                        }
                        cb(data);
                    });

                } else if (valueType === 'ELEMENT') {
                    request.post('element/list', {
                        query: param,
                        page: {
                            pageIndex: 1,
                            pageSize: 10
                        }
                    }).then(res => {
                        for (let i = 0; i < res.data.length; i++) {
                            data[i] = { 'value': res.data[i].name, 'id': res.data[i].id };
                        }
                        cb(data);
                    });

                }
            }
        },


        closedDiaglog() {
            this.$refs.conditionForm.resetFields();
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
        },
        // 保存编辑
        addCondition() {
            this.addVisible = false;


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
