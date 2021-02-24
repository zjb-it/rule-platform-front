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
        <el-dialog title="添加变量" :visible.sync="editVisible" width="40%">
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
                        @change="changeFunction"
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

                <el-form-item style=" margin-left: 15%;" v-for="(item,i) in this.function.variables" prop="variables">
                    <span slot="label">
                        <p style="color: #20a0ff; font-size: 10px">{{ item.description }}</p>
                        <p style="color: #20a0ff; font-size: 10px">({{ item.valueDataType }})</p>
                    </span>
                    <div style="display: flex">
                        <!--如果是java对象，则只能使用变量 todo-->
                        <el-select v-model="form.function.variables[i].valueType"
                                   placeholder="请选择" style="width: 28%;margin-right: 4%"
                                   @change="changeValueType(i)"
                                   @focus="((event)=>{getOptions(event,item.valueDataType)})"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                        <ConditionLeft :ref="'funVariables'+i" style="width: 68%"
                                       v-bind:data="form.function.variables[i]"
                                       v-bind:inputValueType="form.function.variables[i].valueType"
                                       :leftValueDataType="item.valueDataType"
                        ></ConditionLeft>
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


        <el-dialog title="查看变量" :visible.sync="showVisible" v-if="showVisible" width="40%">
            <el-form :model="showForm" label-width="78px" disabled>

                <el-form-item label="名称" prop="name">
                    <el-input v-model="showForm.name"></el-input>
                </el-form-item>

                <el-form-item label="数据类型" prop="valueDataType">
                    <el-select v-model="showForm.valueDataType" style="width: 100%">
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
                        v-model="showForm.function"
                        disabled
                        value-key="name"
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

                <el-form-item style=" margin-left: 15%;" v-for="(item,i) in showForm.function.variables"
                              prop="variables">
                    <span slot="label">
                        <p style="color: #20a0ff; font-size: 10px">{{ item.description }}</p>
                        <p style="color: #20a0ff; font-size: 10px">({{ item.valueDataType }})</p>
                    </span>
                    <div style="display: flex">
                        <!--如果是java对象，则只能使用变量 todo-->
                        <el-select disabled v-model="showForm.function.variables[i].valueType"
                                   placeholder="请选择" style="width: 28%;margin-right: 4%"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                        <ConditionLeft style="width: 68%" ref="variables"
                                       v-bind:data="item"
                                       v-bind:inputValueType="item.valueType"
                                       :input-value-type="item.valueDataType"
                                       :echo="true"
                        ></ConditionLeft>
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
import validateConstant from '@/utils/ValidateConstant';
import ConditionLeft from '@/components/page/base/ConditionLeft';

export const variables = query => {
    return request({
        url: 'variable/list',
        method: 'post',
        data: query
    });
};
let defaultForm = {
    'description': '',
    'function': {
        'name': '',
        'variables': [
            {
                'description': '',
                'name': '',
                'value': '',
                'valueDataType': '',
                'valueDescription': '',
                'valueType': ''
            }
        ]
    },
    'id': '',
    'name': '',
    'valueDataType': ''
};
export default {
    name: 'basetable',
    components: {
        ConditionLeft
    },
    data() {

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
            function: {},
            loading: false,
            tableData: [],
            editVisible: false,
            pageTotal: 0,
            form: defaultForm,
            showForm: {
                'description': '',
                'function': {
                    'name': '',
                    'variables': [
                        {
                            'description': '',
                            'name': '',
                            'value': '',
                            'valueDataType': '',
                            'valueDescription': '',
                            'valueType': ''
                        }
                    ]
                },
                'id': '',
                'name': '',
                'valueDataType': ''
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
        changeFunction() {
            this.function = this.form.function;
        },
        getOptions(event, valueDataType) {
            this.options = [
                {
                    value: 'ELEMENT',
                    label: '元素'
                },
                {
                    value: 'VARIABLE',
                    label: '变量'
                }
            ];
            for (const valueDataType1 of this.valueDataTypes) {
                if (valueDataType1.value === valueDataType) {
                    this.options.push(valueDataType1);
                    return;
                }
            }

        },
        changeValueType(i) {
            let ref = 'funVariables' + i;
            this.$refs[ref][0].reset();
        },

        async showVaiableDetail(variable) {
            // if (this.$refs.variables) {
            //     this.$refs.variables.forEach(item=>{
            //         item.reset()
            //     })
            // }
            // debugger
            let res = await request.get('variable/get', { params: { 'id': variable.id } });
            this.showForm = res.data;
            this.listFunction();
            this.showVisible = true;
            // request.get('variable/get', { params: { 'id': variable.id } }).then(res => {
            //     this.showForm = res.data;
            //     //todo 优化为只查当前一个函数
            //     this.listFunction()
            //
            //     this.showVisible = true;
            // });
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
            this.form=JSON.parse(JSON.stringify(defaultForm))
            this.function=[]
            this.editVisible = true;

        },
        // 保存编辑
        saveEdit() {
            for (const variable of this.form.function.variables) {
                if (variable.valueType === 'VARIABLE' || variable.valueType === 'ELEMENT') {
                    variable.value = variable.value.id;
                }
            }

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
