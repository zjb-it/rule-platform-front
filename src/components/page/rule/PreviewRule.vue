<template>

    <div style="height: 100%;">

        <el-steps :active="3">
            <el-step title="规则定义" description=""></el-step>
            <el-step title="规则配置" description=""></el-step>
            <el-step title="规则预览测试"></el-step>
        </el-steps>
        <!--   规则定义-->
        <el-row STYLE="margin-top: 15PX">

            <el-col :span="2" :offset="3">
                <div><p>规则定义:</p></div>
            </el-col>
            <el-col :span="19">
                <p>
                    <el-tooltip class="item" effect="dark" content="规则名称" placement="top-start">
                        <span>{{ rule.name }}</span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="规则code，用于调用规则" placement="top-start">
                        <el-tag type="success">{{ rule.code }}</el-tag>
                    </el-tooltip>
                </p>


            </el-col>
        </el-row>

        <!--条件组-->
        <el-row STYLE="margin-top: 15PX" v-for="(domain, index) in rule.conditionGroups">
            <el-col :span="2" :offset="3">
                <div v-if="index===0"><p>条件组:</p></div>
                <div v-else><p>&nbsp;</p></div>
            </el-col>
            <el-col :span="19">
                <div>
                    <el-col :span="2" align="middle">
                        <div><p>条件组{{ index + 1 }}:</p></div>
                        <el-tag type="success" v-if="index<rule.conditionGroups.length-1" style="margin-top: 15px">or
                        </el-tag>
                    </el-col>
                    <div v-for="(condition, conIndex) in domain.conditions">
                        <el-col :span="4" align="middle">
                            <el-tooltip class="item" effect="dark"
                                        :content="condition.name+':'+condition.config.leftVariable.valueName+condition.config.symbol+condition.config.rightVariable.valueName"
                                        placement="top-start">
                                <el-tag>
                                    {{ condition.name.length > 10 ? condition.name.substring(0, 9) + '...' : condition.name
                                    }}
                                </el-tag>
                            </el-tooltip>
                        </el-col>
                        <el-col :span="1" align="middle">
                            <el-tag type="success" v-if="conIndex<domain.conditions.length-1">and</el-tag>
                        </el-col>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!--action-->
        <el-row STYLE="margin-top: 15PX">
            <el-col :span="2" :offset="3">
                <div><p>规则结果:</p></div>
            </el-col>
            <el-col :span="19">
                <el-tag v-if="this.rule.action.valueType==='VARIABLE' || this.rule.action.valueType==='ELEMENT'"
                        type="success">
                    {{ this.rule.action.valueName }}
                </el-tag>
                <el-tag v-else type="success">{{ this.rule.action.value }}</el-tag>
            </el-col>
        </el-row>


    </div>


</template>

<script>
import request from '@/utils/request';

export default {
    name: 'basetable',
    data() {

        return {
            tableData: [],
            editVisible: false,
            pageTotal: 0,
            values: [],
            valueDataTypes: [
                {
                    value: 'VARIABLE',
                    label: '变量'
                },
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
                    value: 'ELEMENT',
                    label: '元素'
                }
            ],
            conditions: [],
            form: {
                action: {
                    value: '',
                    valueDataType: '',
                    valueName: '',
                    valueType: ''
                },
                code: '',
                conditionGroups: [
                    {
                        conditionIds: [],
                        order: 0
                    }
                ],
                description: '',
                id: 0,
                name: ''
            },
            rule: {
                'action': {
                    'valueDataType': '',
                    'value': '',
                    'valueName': '',
                    'valueType': ''
                }
            },
            idx: -1,
            id: -1

        };
    },
    created() {
        if (localStorage.getItem('rule')) {
            this.getRule(localStorage.getItem('rule'));

        }
    },
    methods: {

        getRule(id) {
            request.get('rule/get?id=' + id).then(res => {
                this.rule = res.data;
            });
        },


        toCreate() {
            this.$router.go(-1);
        }


    }
};
</script>

<style>


</style>
