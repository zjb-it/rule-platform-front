<template>

    <el-collapse v-model="activeNames">

        <el-collapse-item title="解释" name="1">
            <div><strong>系统函数：</strong>指的是系统内部的函数，需要开发</div>
            <div><strong>http函数：</strong>指的是系统外部的函数，需要注册http接口</div>
        </el-collapse-item>

        <el-collapse-item title="获取json对象属性" name="2">
            <div>描述：从json对象中获取它的属性值</div>
            <div>包含2个参数
<!--                <ul>-->
                    <li><strong>JSON对象:</strong> 目标对象</li>
                    <li><strong>对象属性code:</strong> 目标对象的属性code，支持嵌套获取属性</li>
                    <li><strong>示例1：</strong>
                        JSON对象={"code":0,"data":{"name":"zhaojingbo"}},
                        对象属性code=code
                        函数运行结果为 0
                    </li>
                    <li><strong>示例2：</strong>
                        JSON对象={"code":0,"data":{"name":"zhaojingbo"}},
                        对象属性code=data
                        函数运行结果为 {"name":"zhaojingbo"}
                    </li>

                    <li><strong>示例3：</strong>
                        JSON对象={"code":0,"data":{"name":"zhaojingbo"}},
                        对象属性code=data.name
                        函数运行结果为 zhaojingbo
                    </li>
<!--                </ul>-->
            </div>
        </el-collapse-item>

        <el-collapse-item title="获取java对象属性(暂未开放)" name="3">
            <div>描述：从json对象中获取它的属性值</div>
            <div>包含2个参数
                <!--                <ul>-->
                <li><strong>java对象:</strong> 目标对象</li>
                <li><strong>对象属性code:</strong> 目标对象的属性code，支持嵌套获取属性</li>

            </div>
        </el-collapse-item>

    </el-collapse>
</template>
<script>
export default {
    data() {
        return {
            activeNames: ['1','2']
        };
    },
    methods: {
        // handleChange(val) {
        //     console.log(val);
        // }
    }
};
</script>