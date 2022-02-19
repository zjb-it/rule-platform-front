<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 规则集
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
                <el-table-column prop="id" label="ID"  align="center"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="code" label="code"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag
                            type="success"
                            disable-transitions>{{scope.row.status===0?'编辑中':scope.row.status===1?'待发布':'已发布'}}</el-tag>
                    </template>

                </el-table-column>

                <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
                <af-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status>0" @click="previewRule(scope.row)" type="text" size="small">预览</el-button>
                        <el-button @click="editRule(scope.row)" type="text" size="small">编辑</el-button>
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

    </div>
</template>

<script>
import request from '@/utils/request';


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
            editVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1

        };
    },
    activated() {
        this.getData();
    },
    created() {
        // this.getData();
    },
    methods: {
        previewRule(row) {
            this.$router.push({name:'PreviewRule',params:{ruleId:row.id}})
        },
        editRule(row) {
            this.$router.push({name:'createRule',params:{ruleId:row.id}})
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            request.post("/ruleSet/page",this.query).then(res => {
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
            this.$router.push({path:'/createRuleSet',query:{'id':1}})

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
