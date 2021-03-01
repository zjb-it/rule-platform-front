<template>
    <div>
        <h1>规则平台</h1>
        <ol>

            <li>
                <h2>试用地址</h2>
                <a target="_blank" href="https://www.pincheche.online/rule-front/#/rule">https://www.pincheche.online/rule-front/#/rule</a>
            </li>

            <li>
                <h2>规则前端文档</h2>
                <a target="_blank" href="https://github.com/zjb-it/rule-platform-front/blob/master/README.md">https://github.com/zjb-it/rule-platform-front/blob/master/README.md</a>
            </li>

            <li>
                <h2>规则后台文档</h2>
                <a target="_blank" href="https://github.com/zjb-it/rule-platform-server/blob/master/README.md">https://github.com/zjb-it/rule-platform-server/blob/master/README.md</a>
            </li>

            <li>
                <h2>规则引擎文档</h2>
                <a target="_blank" href="https://github.com/zjb-it/rule-engine/blob/master/README.md">https://github.com/zjb-it/rule-engine/blob/master/README.md</a>
            </li>
        </ol>
        <h1>更多开源软件请查看
        <a target="_blank" href="https://www.pincheche.online/">https://www.pincheche.online/</a>
        </h1>

    </div>

</template>

<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
export default {
    name: 'dashboard',
    data() {
        return {
            name: localStorage.getItem('username'),
        };
    },
    components: {
        Schart
    },
    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },

    methods: {

    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
