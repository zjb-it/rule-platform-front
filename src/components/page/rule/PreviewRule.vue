<template>

    <div style="height: 100%;">

        <el-steps :active="3">
            <el-step title="规则定义" description=""></el-step>
            <el-step title="规则配置" description=""></el-step>
            <el-step title="规则预览测试"></el-step>
        </el-steps>
        <!--   规则定义-->

        <el-row STYLE="margin-top: 15PX">

            <el-col :span="2" :offset="20">
                <el-button type="primary" style="float: right" @click="publishRule">发布规则</el-button>
            </el-col>

        </el-row>

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

                            <el-tooltip placement="top">
                                <div slot="content">{{ condition.name }}<br />

                                    <span v-if="condition.config.leftVariable.valueType==='VARIABLE'">
                                         <el-tag type="success">
                                        变量:{{ condition.config.leftVariable.valueName }}
                                         </el-tag>
                                    </span>
                                    <span v-else-if="condition.config.leftVariable.valueType==='ELEMENT'">
                                         <el-tag type="success">
                                        元素:{{ condition.config.leftVariable.valueName }}
                                         </el-tag>
                                    </span>
                                    <span v-else>
                                        {{ condition.config.leftVariable.valueName }}
                                    </span>

                                    {{ condition.config.symbol }}

                                    <span v-if="condition.config.rightVariable.valueType==='VARIABLE'">
                                         <el-tag type="success">
                                        变量:{{ condition.config.rightVariable.valueName }}
                                         </el-tag>
                                    </span>
                                    <span v-else-if="condition.config.rightVariable.valueType==='ELEMENT'">
                                         <el-tag type="success">
                                        元素:{{ condition.config.rightVariable.valueName }}
                                         </el-tag>
                                    </span>
                                    <span v-else>
                                        {{ condition.config.rightVariable.valueName }}
                                    </span>

                                </div>
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
                    <span v-if="this.rule.action.valueType==='VARIABLE'">变量：</span>{{ this.rule.action.valueName }}
                    <span v-if="this.rule.action.valueType==='ELEMENT'">元素：</span>{{ this.rule.action.valueName }}
                </el-tag>
                <el-tag v-else type="success">{{ this.rule.action.value }}</el-tag>
            </el-col>
        </el-row>

        <!--        测试-->
        <el-row STYLE="margin-top: 15PX">
            <el-col :span="5" :offset="3">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>规则测试</span>
                        <el-button style="float: right" type="text" @click="testRule">试一下</el-button>
                    </div>
                    <el-form ref="form" :model="form">

                        <el-form-item :label="param.name" :prop="'ruleParam.'+param.code"
                                      v-for="(param,index) in parameters"
                                      :rules="{required:true,message:'不能为空',trigger:'blur'}">
                            <el-input v-model="form.ruleParam[param.code]" @input="inputParam"></el-input>
                        </el-form-item>

                        <el-form-item label="返回结果">
                            <el-input v-model="this.ruleResult" disabled></el-input>
                        </el-form-item>

                    </el-form>
                </el-card>
            </el-col>

            <el-col :span="5" :offset="3">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>规则发布后，调用参考</span>
                    </div>
                    <div style="word-wrap:break-word;">{{ this.executeCommand }}</div>
                </el-card>
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
            rule: {
                'action': {
                    'valueDataType': '',
                    'value': '',
                    'valueName': '',
                    'valueType': ''
                }

            },
            executeCommand: '',
            ruleResult: '',
            form: {
                'ruleParam': {}
            },
            idx: -1,
            parameters: [],
            id: -1

        };
    },
    activated() {
        this.$refs.form.resetFields();
        this.ruleResult=''
        let ruleId = this.$route.params.ruleId;
        if (ruleId) {
            this.getRule(ruleId);

        }
    },
    created() {
        // let ruleId = this.$route.params.ruleId;
        // if (ruleId) {
        //     this.getRule(ruleId);
        //
        // }
    },
    methods: {
        publishRule() {
            request.get('rule/publish?ruleId=' + this.rule.id).then(res => {
                this.$router.push('/rule');
            });
        },
        async getRule(id) {

            let rule = await request.get('rule/get?id=' + id);
            this.rule = rule.data;
            let elementIds = rule.data.paramIds;
            this.executeCommand = 'curl -H "Content-Type: application/json" -X POST  --data \'{';
            this.executeCommand+='"ruleCode":'+'"'+this.rule.code+'",'
            this.executeCommand+='"ruleParam":{'

            if (elementIds.length > 0) {
                let elements = await request.post('/element/getByIds', { 'ids': elementIds });
                this.parameters = elements.data;
                elements.data.forEach((ele, index) => {
                    this.executeCommand += '"' + ele.code + '":' + '"${' + ele.code + '}"';
                    if (index != elements.data.length - 1) {
                        this.executeCommand += ',';
                    }
                });
            }
            this.executeCommand += '}}\' ';
            this.executeCommand += '${host}/open/ruleEngine/rule/execute';

        },


        testRule() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.ruleId = this.rule.id;
                    request.post('/rule/test', this.form).then(res => {
                        this.ruleResult = res.data + '';
                    });
                }
            });
        },
        toCreate() {
            this.$router.go(-1);
        },
        inputParam() {
            this.ruleResult = '';
        }


    }
};
</script>

<style>


</style>
