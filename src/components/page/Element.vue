<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
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
                <el-input v-model="query.query" placeholder="名称或code" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="code" label="code"></el-table-column>
                <el-table-column prop="valueDataType" label="数据类型"></el-table-column>

                <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>


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
        <el-dialog title="添加元素" :visible.sync="editVisible" width="30%" >
            <el-form ref="form" :model="form" label-width="70px">

                <el-form-item
                    label="code"
                    prop="code"
                    :rules="[
                    { required: true, message: 'code不能为空'},
                    ]">
                    <el-input type="code" v-model="form.code" auto-complete="off" ></el-input>
                </el-form-item>

                <el-form-item label="数据类型">
                    <el-select v-model="form.valueType" style="width: 100%" >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="描述">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>

                <el-form-item size="large">
                    <el-button type="primary" @click="saveEdit()">立即创建</el-button>
                    <el-button @click="editVisible = false">取消</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>
    </div>
</template>

<script>
import request from '@/utils/request';

export const elements = query => {
    return request({
        url: 'element/list',
        method: 'post',
        data: query
    });
};
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                'query': '',
                page: {
                    pageIndex: 1,
                    pageSize: 10
                }

            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {
                valueType: 'NUMBER',
            },
            options: [
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
                }
            ],

            idx: -1,
            id: -1

        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            elements(this.query).then(res => {
                console.log(res);
                this.tableData = res.data;
                this.pageTotal = res.total || 50;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query.page, 'pageIndex', 1);
            this.getData();
        },


        // 编辑操作
        handleAdd() {
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;

            request.post("/element/add",this.form).then(res=>{
                this.getData();
            })

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
</style>
