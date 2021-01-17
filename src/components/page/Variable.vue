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
                <el-table-column prop="valueDataType" label="数据类型"></el-table-column>

                <af-table-column prop="description" label="描述"></af-table-column>


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
        <el-dialog title="添加变量" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">

                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>



                <el-form-item label="函数">
                    <el-select
                        v-model="form.function"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入函数名称"
                        @change="selectFunction"
                        :remote-method="remoteMethod"
                        :loading="loading" style="width: 100%" >
                        <el-option
                            v-for="item in functions"
                            :key="item.name"
                            :label="item.name"
                            :value="item"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-row :gutter="20" v-for="item in form.function.variables" >
                    <el-col :span="5">
                        <div class="grid-content bg-purple" style="visibility: hidden"></div>
                    </el-col>
                    <el-col :span="16">
                        <div class="grid-content bg-purple">
                            <el-form-item :label="item.code" >
                                <div style="margin-top: 15px;">
                                    <el-input placeholder="请输入内容"  class="input-with-select">
                                        <el-select v-model="valueType" slot="prepend" placeholder="请选择">
                                            <el-option label="餐厅名" value="1"></el-option>
                                            <el-option label="订单号" value="2"></el-option>
                                            <el-option label="用户电话" value="3"></el-option>
                                        </el-select>
                                        <el-button slot="append" icon="el-icon-search"></el-button>
                                    </el-input>
                                </div>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>

                <el-form-item label="描述">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>

                <el-form-item size="large">
                    <el-button type="primary" @click="saveEdit()">立即创建</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
            <!--            <span slot="footer" class="dialog-footer">-->
            <!--                <el-button @click="editVisible = false">取 消</el-button>-->
            <!--                <el-button type="primary" @click="saveEdit">确 定</el-button>-->
            <!--            </span>-->
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
        return {
            query: {
                'query': {},
                page: {
                    pageIndex: 1,
                    pageSize: 10
                }

            },
            queryFunction: {
                'query': '',
                page: {
                    pageIndex: 1,
                    pageSize: 10
                }

            },
            valueType: 1,
            loading: false,
            tableData: [],
            editVisible: false,
            pageTotal: 0,
            form: {
                valueType: 'NUMBER',
                function: {}
            },
            functions:{

            },

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
            id: -1
        };
    },
    created() {
        this.getData();
    },
    mounted() {
        this.listFunction();
    },
    methods: {
        getData() {
            variables(this.query).then(res => {
                this.tableData = res.data;
                this.pageTotal = res.total || 10;
            });
        },
        listFunction() {
            request.post("function/list",this.queryFunction).then(res=>{
                this.functions=res.data;
            })
        },
        selectFunction(func){
            console.log(this.form.function.name.variables)
        },

        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query.page, 'pageIndex', 1);
            this.getData();
        },

        remoteMethod(query) {
            console.log("remoteMethod")
            // if (query !== '') {
            //     this.loading = true;
            //     setTimeout(() => {
            //         this.loading = false;
            //         this.options = this.list.filter(item => {
            //             return item.label.toLowerCase()
            //                 .indexOf(query.toLowerCase()) > -1;
            //         });
            //     }, 200);
            // } else {
            //     this.options = [];
            // }
        },
        // 编辑操作
        handleAdd() {
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;

            request.post('/element/add', this.form).then(res => {
                this.getData();
            });

        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query.page, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
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

/*.el-row {*/
/*    margin-bottom: 20px;*/
/*    &:last-child {*/
/*     margin-bottom: 0;*/
/*    }*/
/*}*/


.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}



.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
