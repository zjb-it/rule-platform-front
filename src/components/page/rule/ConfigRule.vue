<template>

    <div style="height: 100%;">

        <el-steps :active="2">
            <el-step title="规则定义" description=""></el-step>
            <el-step title="规则配置" description=""></el-step>
            <el-step title="规则测试" description=""></el-step>
        </el-steps>
        <el-form ref="form" :model="form" label-width="15%" :rules="rules">
            <el-form-item
                style="margin-top: 30px"
                v-for="(domain, index) in form.conditionGroups"
                :label="'条件组'+(index+1)"
                :key="'conditionGroups'+index"
                :prop="'conditionGroups.' + index+'.conditionIds'"
                :rules="{required:true,message:'不能为空',trigger:'change'}"
            >
                <el-select

                    v-model="domain.conditionIds"
                    multiple
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    value-key="id"
                    placeholder="请输入条件名称关键词"
                    @focus="queryConditions('')"
                    :remote-method="queryConditions"

                    :loading="false">
                    <el-option
                        v-for="item in conditions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>


                <i class="el-icon-plus" style="margin-left: 1%" v-if="index==form.conditionGroups.length-1"
                   @click="addConditionGroup"></i>
                <i class="el-icon-delete" style="margin-left: 1%" v-if="form.conditionGroups.length>1"
                   @click="delConditionGroup(domain)"></i>
            </el-form-item>


            <el-form-item label="规则结果"  prop="action" STYLE="background-color: #F5F5F5;padding-top: 1.6%">

                <div style="display: flex">
                    <!--如果是java对象，则只能使用变量 todo-->
                    <el-select v-model="form.action.valueType"
                               placeholder="请选择"
                               @change="changeValueType()"
                    >
                        <el-option
                            v-for="item in valueDataTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <ConditionLeft ref="actionValue" style="width: 20%;margin-left: 2%"
                                   v-bind:data="form.action"
                                   v-bind:inputValueType="form.action.valueType"
                    ></ConditionLeft>
                </div>
            </el-form-item>

                <el-form-item size="large" style="margin-top: 1%">
                    <el-button type="primary" @click="saveAndPreview">保存下一步</el-button>
                    <!--                    <el-button type="warning" @click="toCreate">上一步</el-button>-->
                    <el-button @click="$router.push('/rule')">取消</el-button>
                </el-form-item>
<!--            </el-form-item>-->
        </el-form>

    </div>


</template>

<script>
import request from '@/utils/request';
import validateConstant from '@/utils/ValidateConstant';
import ConditionLeft from '@/components/page/base/ConditionLeft';


export default {
    name: 'basetable',
    components: {
        ConditionLeft
    },
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
            cacheConditionIds: [],
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
            edit: false,
            rules: {
                'action.value': [
                    {
                        validator: (rule, value, callback) => {
                            validateConstant(rule, value, callback, this.form.action.valueType);
                        },
                        trigger: 'blur'
                    }
                ],
                'action.valueType': [{ required: true, message: '请选择数据类型', trigger: 'change' }]
            },
            idx: -1,
            id: -1

        };
    },
    activated() {
        this.conditions = [];
        this.cacheConditionIds = [];
        this.values = [];
        this.form.code = this.$route.params.form.code;
        this.form.id = this.$route.params.form.id;
        this.form.name = this.$route.params.form.name;
        this.form.description = this.$route.params.form.description;
        let action = this.$route.params.form.action;
        if (action) {
            this.edit = true;
            this.form.action = action;
            this.form.id = this.$route.params.form.id;
            this.form.conditionGroups = this.$route.params.form.conditionGroups;

            this.form.conditionGroups.forEach((item, i) => {
                for (const condition of item.conditions) {
                    if (!item.conditionIds) {
                        item.conditionIds = [];
                    }
                    item.conditionIds.push(condition.id);
                    if (this.cacheConditionIds.indexOf(condition.id) < 0) {
                        this.conditions.push(condition);
                        this.cacheConditionIds.push(condition.id);
                    }
                }
            });
            if (this.form.action.valueType === 'ELEMENT') {
                request.get('/element/get?id=' + this.form.action.value).then(res => {
                    this.form.action.value = res.data;
                    this.values.push(res.data);
                });

            } else if (this.form.action.valueType === 'VARIABLE') {
                request.get('/variable/get?id=' + this.form.action.value).then(res => {
                    this.form.action.value = res.data;
                    this.values.push(res.data);
                });
            }

        }
    },
    created() {
        // let item = getRuleCache();
        // if (item) {
        //     if (typeof JSON.parse(item) === 'object' ){
        //         let parse = JSON.parse(item);
        //         this.form.code = parse.code;
        //         this.form.name = parse.name;
        //         this.form.description = parse.description;
        //     }
        // }


    },
    methods: {
        changeValueType(){
            this.$refs.actionValue.reset();
        },
        clearValues() {
            this.values = [];
            this.form.action.value = '';
        },
        async saveAndPreview() {
            if (this.edit) {
                this.addRule('/rule/update');
            } else {
                this.addRule('/rule/add');
            }

        },
        async addRule(url) {
            // debugger
            let valid =await this.$refs.actionValue.validateForm();
            if (!valid) {
                return false;
            }
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.form.conditionGroups.forEach((item, i) => {
                        item.order = i;
                    });
                    if (this.form.action.valueType === 'VARIABLE' || this.form.action.valueType === 'ELEMENT') {
                        this.form.action.valueDataType = this.form.action.value.valueDataType;
                        this.form.action.valueName = this.form.action.value.name;
                        this.form.action.value = this.form.action.value.id;
                    } else {
                        this.form.action.valueDataType = this.form.action.valueType;
                    }
                    request.post(url, this.form).then(res => {
                        // setRuleCache(res.data)
                        this.$router.push({ name: 'PreviewRule', params: { 'ruleId': res.data } });
                    });
                }
            });
        },

        async focusValue() {
            if (this.form.action.valueType === 'ELEMENT') {
                this.queryElement();
            } else if (this.form.action.valueType === 'VARIABLE') {
                this.queryVariable();
            }
        },
        remoteValue(value, valueDataType) {
            console.log(this.form.action.valueType);
            if (valueDataType === 'ELEMENT') {
                this.queryElement(value, valueDataType);

            } else if (valueDataType === 'VARIABLE') {
                this.queryVariable(value, valueDataType);
            }
        },
        queryElement(name, valueDataType) {
            var param = {};
            if (name) {
                param.name = name;
            }
            return request.post('element/list', {
                query: param,
                page: {
                    pageIndex: 1,
                    pageSize: 10
                }
            }).then(res => {
                this.values = res.data;
            });
        },
        queryVariable(name, valueDataType) {
            var param = {};
            if (name) {
                param.name = name;
            }

            request.post('variable/list', {
                query: param,
                page: {
                    pageIndex: 1,
                    pageSize: 10
                }
            }).then(res => {
                this.values = res.data;
            });
        },
        queryConditions(conName) {
            request.post('condition/list', {
                query: conName,
                page: {
                    pageIndex: 1,
                    pageSize: 5
                }

            }).then(res => {
                this.conditions = res.data;
                // console.log(this.conditions);
            });
        },
        delConditionGroup(item) {
            var index = this.form.conditionGroups.indexOf(item);

            if (index !== -1) {
                this.form.conditionGroups.splice(index, 1);
            }
        },
        addConditionGroup() {
            this.form.conditionGroups.push({});
        },

        toCreate() {
            this.$router.go(-1);
        }


    }
};
</script>

<style>

</style>
