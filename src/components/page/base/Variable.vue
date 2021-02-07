<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 变量
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
                <el-input v-model="query.query.name" placeholder="名称" class="handle-input mr10"></el-input>
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
                <el-table-column prop="valueDataTypeDesc" label="数据类型"></el-table-column>

                <af-table-column prop="description" label="描述"></af-table-column>
                <af-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button @click="showVaiableDetail(scope.row)" type="text" size="small">查看</el-button>
                    </template>
                </af-table-column>

            </el-table>
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
        <el-dialog title="添加变量" :visible.sync="editVisible" width="30%" @close="closedDiaglog">
            <el-form ref="form" :model="form" label-width="100px" :rules="rules">

                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="数据类型" prop="valueDataType">
                    <el-select v-model="form.valueDataType" style="width: 100%">
                        <el-option
                            v-for="item in valueDataTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="函数" prop="function">
                    <el-select
                        v-model="form.function"
                        filterable
                        remote
                        clearable
                        reserve-keyword
                        placeholder="请输入函数名称"
                        @focus="functionFocus"
                        value-key="name"
                        :remote-method="remoteMethod"
                        :loading="loading" style="width: 100%">
                        <el-option
                            v-for="item in functions"
                            :key="item.name"
                            :label="item.description"
                            :value="item"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item style=" margin-left: 15%" v-for="(item,i) in form.function.variables" prop="variables">
                    <span slot="label">
                        <p style="color: #20a0ff; font-size: 10px">{{ item.description }}</p>
                        <p style="color: #20a0ff; font-size: 10px">({{ item.valueDataType }})</p>
                    </span>
                    <!--如果是java对象，则只能使用变量-->
                    <div v-if="item.valueDataType==='POJO'" style="margin-top: 15px;">
                        <el-autocomplete
                            v-model="form.function.variables[i].valueDescription"
                            placeholder="请输入变量名称"
                            :fetch-suggestions="((queryString,cb)=>{querySearchAsync(queryString,cb,'VARIABLE','POJO')})"

                            @select="((value)=>{handleSelect(value,i,form.function.variables[i].valueType)})"
                        >
                            <el-select v-model="form.function.variables[i].valueType='变量'" slot="prepend" disabled>
                            </el-select>
                        </el-autocomplete>
                    </div>

                    <div v-else style="margin-top: 15px;">
                        <el-autocomplete
                            v-model="form.function.variables[i].valueDescription"
                            placeholder="请输入内容"
                            @blur="((event)=>{valueTypeBlur(event,i,form.function.variables[i].valueType,form.function.variables[i].valueDescription)})"
                            :disabled="form.function.variables[i].valueType===undefined"
                            :fetch-suggestions="((queryString,cb)=>{querySearchAsync(queryString,cb,form.function.variables[i].valueType,item.valueDataType)})"
                            @select="((value)=>{handleSelect(value,i,form.function.variables[i].valueType)})"
                        >
                            <el-select v-model="form.function.variables[i].valueType" slot="prepend" placeholder="请选择" style="cursor: pointer">
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
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>

                <el-form-item size="large">
                    <el-button type="primary" @click="saveEdit()">立即创建</el-button>
                    <el-button @click="editVisible =false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


        <el-dialog title="查看变量" :visible.sync="showVisible" width="30%">
            <el-form :model="showForm" label-width="78px" disabled>

                <el-form-item label="名称" prop="name">
                    <el-input v-model="showForm.name"></el-input>
                </el-form-item>
                <el-form-item label="数据类型" prop="valueDataType">
                    <el-input v-model="showForm.valueDataType"></el-input>
                </el-form-item>
                <el-form-item label="函数" prop="function">
                    <el-input v-model="showForm.function.name"></el-input>
                </el-form-item>

                <el-form-item style=" margin-left: 15%" v-for="(item,i) in showForm.function.variables"
                              prop="variables">
                    <span slot="label">
                        <p style="color: #20a0ff;">{{ item.description }}</p>
                        <p style="color: #20a0ff;">({{ item.valueDataType }})</p>
                    </span>
                    <!--如果是java对象，则只能使用变量-->
                    <div style="margin-top: 15px;">
                        <el-input v-model="showForm.function.variables[i].valueDescription">
                            <el-select v-model="showForm.function.variables[i].valueType" slot="prepend" disabled>
                            </el-select>
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input type="textarea" v-model="showForm.description"></el-input>
                </el-form-item>


            </el-form>

        </el-dialog>

    </div>
</template>

<script>
import request from '@/utils/request';

export const variables = query => {
    return request({
        url: 'variable/list',
        method: 'post',
        data: query
    });
};
export default {
    name: 'basetable',
    data() {
        let validateConstant = (rule, value, callback) => {
            for (const variable of this.form.function.variables) {
                if (variable.value === '') {
                    callback(new Error('不能为空'));
                    return;
                }
                if (variable.valueType === 'CONSTANT') {
                    if (variable.valueDataType === 'BOOLEAN') {
                        if (variable.value!=='true' && variable.value!=='false') {
                            callback(new Error('布尔类型只能是true或false'));
                        }
                    } else if (variable.valueDataType === 'COLLECTION') {
                        if (!Array.isArray(JSON.parse(variable.value))) {
                            callback(new Error('不是数组类型，数组类型格式为[1,2,3]'));
                        }
                    } else if (variable.valueDataType === 'JSONOBJECT') {
                        if (typeof JSON.parse(variable.value)!=='object' || Array.isArray(JSON.parse(variable.value))) {
                            callback(new Error('不是JSON类型，json类型为{...}'));
                        }
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            }
        };
        return {
            query: {
                'query': {},
                page: {
                    pageIndex: 1,
                    pageSize: 10
                }

            },
            showVisible: false,
            searchFunctionName: '',
            select: '',
            loading: false,
            tableData: [],
            editVisible: false,
            pageTotal: 0,
            form: {
                valueDataType: 'NUMBER',
                function: {}
            },
            showForm: {
                valueDataType: '',
                function: {}
            },
            functions: [],
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
                    value: 'POJO',
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
            id: -1,

            rules: {
                name: [
                    { required: true, message: '请输入变量名称', trigger: 'blur' }
                ],
                function: [
                    { required: true, message: '请选择函数', trigger: 'change' }
                ],
                valueDataType: [
                    { required: true, message: '请选择函数', trigger: 'change' }
                ],
                variables: [
                    { validator: validateConstant, trigger: 'blur' }
                ]


            }
        };

    },
    methods: {
        querySearchAsync(queryString, cb, valueType, valueDataType) {
            if (valueType !== 'CONSTANT' && queryString && queryString !== '' && cb) {
                var data = [];
                if (valueType === 'VARIABLE') {
                    variables({
                        query: { 'name': queryString, 'valueDataType': [valueDataType] },
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
                        query: { 'name': queryString, 'valueDataType': [valueDataType] },
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
        showVaiableDetail(variable) {
            request.get('variable/get', { params: { 'id': variable.id } }).then(res => {
                this.showForm = res.data;
                this.showVisible = true;
            });
        },
        handleSelect(value, i, valueType) {
            if (valueType === 'CONSTANT') {
                this.form.function.variables[i].value = value;
            } else {
                this.form.function.variables[i].value = value.id;
            }

        },
        valueTypeBlur(event, i, valueType, valuleDesc) {
            if (valueType === 'CONSTANT') {
                this.form.function.variables[i].value = valuleDesc;
            }
        },

        getData() {
            variables(this.query).then(res => {
                this.tableData = res.data;
                this.pageTotal = res.total || 10;
            });
        },
        listFunction() {
            request.get('function/list', {
                params: {
                    'name': this.searchFunctionName,
                    'valueDataType': this.form.valueDataType
                }
            }).then(res => {
                this.functions = res.data;
            });
        },

        closedDiaglog() {
            this.$refs.form.resetFields();
        },

        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query.page, 'pageIndex', 1);
            this.getData();
        },
        functionFocus(name) {
            this.listFunction();
        },
        remoteMethod(query) {
            this.searchFunctionName = query;
            this.listFunction();

        },


        // 编辑操作
        handleAdd() {
            console.log(this.form.function);
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    request.post('/variable/add', this.form).then(res => {
                        this.editVisible = false;
                        this.getData();
                    });
                }
            });

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
