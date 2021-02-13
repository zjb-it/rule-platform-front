<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i>函数<span style="color: red">(暂时只支持POST & Content-Type=application/json)</span>
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
                <af-table-column prop="code" label="code"></af-table-column>
                <af-table-column prop="name" label="名称"></af-table-column>
                <af-table-column prop="description" label="描述"></af-table-column>
                <af-table-column prop="params" label="参数" show-overflow-tooltip
                                 :formatter="formatterParams"></af-table-column>
                <af-table-column
                    fixed="right"
                    label="操作"
                    width="140">
                    <template slot-scope="scope">
                        <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
                        <el-button @click="updateFunction(scope.row)" type="text" size="small">更新</el-button>
                        <el-button @click="tryRequest(scope.row)" type="text" size="small">试一下</el-button>
                    </template>
                </af-table-column>

            </el-table>


            <el-dialog :title="dialogTitle" :visible.sync="addVisible" v-if="addVisible" width="35%"
                       @close="closedDiaglog">
                <el-form ref="functionForm" :model="functionForm" label-width="80px" :rules="functionFormRules">

                    <el-form-item label="code" prop="code">
                        <el-input v-model="functionForm.code"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="functionForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="接口地址" prop="url">
                        <el-input v-model="functionForm.url"></el-input>
                    </el-form-item>

                    <el-form-item label="返回类型" prop="valueDataType">
                        <el-select v-model="functionForm.valueDataType" style="width: 100%">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item
                        style="margin-left: 5%;margin-bottom: 0px; background-color: #F5F5F5"
                        v-for="(domain, index) in functionForm.params"
                        :label="'参数' + (index+1)"
                        :key="index"
                        :prop="'params.' + index"
                    >
                        <FunctionParam ref="functionParam" :data="domain" :index="index"
                                       :domains="functionForm.params"></FunctionParam>

                    </el-form-item>

                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" v-model="functionForm.description"></el-input>
                    </el-form-item>

                    <el-form-item size="large">
                        <el-button v-if="functionForm.id!==''" type="primary" @click="addFunction">立即更新</el-button>
                        <el-button v-else type="primary" @click="addFunction">立即创建</el-button>
                        <el-button @click="closedDiaglog">取消</el-button>
                    </el-form-item>
                </el-form>

            </el-dialog>

            <el-dialog title="试一下" :visible.sync="tryVisible"  width="35%" show-close @close="closedDiaglog">
                <el-form ref="functionForm" :model="functionForm" label-width="80px">

                    <el-form-item label="code" prop="code">
                        <el-input v-model="functionForm.code" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="functionForm.name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="接口地址" prop="url">
                        <el-input v-model="functionForm.url" disabled></el-input>
                    </el-form-item>


                    <el-form-item
                        style="margin-left: 5%;background-color: #F5F5F5"
                        v-for="(domain, index) in functionForm.params"
                        :label="domain.name+'(' + (domain.code)+')'"
                        :key="index"
                        :prop="'params.' + index"
                    >
                        <el-input v-model="domain.value"></el-input>

                    </el-form-item>
<!--                    <el-form-item label="命令" prop="description" v-if="curlShow">-->
<!--                        <el-input type="textarea" disabled :value="curlDetail"></el-input>-->
<!--                    </el-form-item>-->
                    <el-form-item label="结果" prop="description">
                        <el-input type="textarea" v-model="functionResult" disabled></el-input>
                    </el-form-item>

                    <el-form-item size="large">
                        <el-button type="primary" @click="sendRequest">试一下</el-button>
                        <el-button @click="closedDiaglog">取消</el-button>
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
import FunctionParam from '@/components/page/base/FunctionParam';
import axios from 'axios';


export default {
    name: 'funcTable',
    components: {
        FunctionParam
    },
    data() {
        return {
            query: {
                'query': '',
                page: {
                    pageIndex: 1,
                    pageSize: 10
                }

            },
            functionResult:'',
            tryVisible: false,
            curlDetail: '',
            dialogTitle: '增加函数',
            loading: false,
            tableData: [],
            addVisible: false,
            pageTotal: 0,
            functionForm: {
                code: '',
                description: '',
                valueDataType: '',
                id: '',
                name: '',
                url: '',
                result:'',
                params: [
                    {
                        code: '',
                        name: '',
                        valueDataType: ''
                    }
                ]
            },

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
            idx: -1,
            id: -1,
            functionFormRules: {
                code: [
                    { required: true, message: '不能为空', trigger: 'blur' }

                ],
                name: [
                    { required: true, message: '不能为空', trigger: 'blur' }

                ],
                valueDataType: [
                    { required: true, message: '不能为空', trigger: 'blur' }

                ],
                url: [
                    { required: true, message: '不能为空', trigger: 'blur' }

                ]
            }
        };
    },
    methods: {
        del(row) {
            request.get('/function/delete?id=' + row.id).then(res => {
                this.getData();
            });
        },
        tryRequest(fun) {
            this.functionResult='';
            this.functionForm = fun;
            this.tryVisible = true;
            // this.curlDetail=''
            // this.curlDetail += 'curl -H "Content-Type: application/json" -X POST  --data' + '{';
            // for (const param of fun.params) {
            //     this.curlDetail+='"'+param.code+'":"'+param.value+'"'
            // }
            // this.curlDetail += '}'
            // this.curlDetail += fun.url

        },
        sendRequest() {
            var param={}
            for (const argument of this.functionForm.params) {
                param[argument.code] = argument.value;
            }
            axios.post(this.functionForm.url,JSON.stringify(param)).then(res=>{
                this.functionResult=JSON.stringify(res)
                console.log(this.functionForm)
            })

        },
        updateFunction(fun) {
            this.dialogTitle = '更新函数';
            this.functionForm = fun;
            this.addVisible = true;
        },
        getData() {
            request.post('/function/page', this.query).then(res => {
                this.tableData = res.data;
                this.pageTotal = res.total || 10;
            });
        },

        formatterParams(row, column, cellValue, index) {
            if (cellValue) {
                var result = [];
                for (const cellValueElement of cellValue) {
                    result.push(cellValueElement.name + '(' + cellValueElement.code + ')');
                }
                return result.join(',');
            }

        },


        closedDiaglog() {

            this.addVisible = false;

            this.functionForm={};

        },

        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query.page, 'pageIndex', 1);
            this.getData();
        },


        // 编辑操作
        handleAdd() {
            if (this.$refs.functionForm) {
                this.$refs.functionForm.resetFields();
            }
            this.addVisible = true;
        },
        // 保存编辑
        async addFunction() {
            var validateResult = await this.$refs.functionForm.validate();
            for (const argument of this.$refs.functionParam) {
                let validateForm = await argument.validateForm();
                validateResult = validateForm && validateForm;
            }
            if (validateResult) {
                if (this.functionForm.id !== '') {
                    request.post('/function/update', this.functionForm).then(res => {
                        this.addVisible = false;
                        this.getData();
                    });
                } else {
                    request.post('/function/register', this.functionForm).then(res => {
                        this.addVisible = false;
                        this.getData();
                    });
                }


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
