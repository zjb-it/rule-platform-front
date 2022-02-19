import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/element',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/base/Element.vue'),
                    meta: { title: '元素' }
                },
                {
                    path: '/condition',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/base/Condition.vue'),
                    meta: { title: '条件' }
                },
                {
                    path: '/variable',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/base/Variable.vue'),
                    meta: { title: '变量' }
                },
                {
                    // 富文本编辑器组件
                    path: '/function',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/base/Function.vue'),
                    meta: { title: 'http函数' }
                },
                {
                    path: '/sysFunction',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/base/SysFunction.vue'),
                    meta: { title: '系统函数' }
                },
                {
                    path: '/rule',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/rule/rule.vue'),
                    meta: { title: '规则' }
                },
                {
                    path: '/createRule',
                    name: 'createRule',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/rule/CreateRule.vue'),
                    meta: { title: '创建规则' }
                },
                {
                    path: '/ConfigRule',
                    name: 'ConfigRule',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/rule/ConfigRule.vue'),
                    meta: { title: '配置规则' }
                },
                {
                    path: '/PreviewRule',
                    name: 'PreviewRule',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/rule/PreviewRule.vue'),
                    meta: { title: '预览规则' }
                },
                {
                    path: '/ruleSet',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/ruleSet/ruleSet.vue'),
                    meta: { title: '规则集' }
                },{
                    path: '/createRuleSet',
                    name: 'createRuleSet',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/ruleSet/CreateRuleSet.vue'),
                    meta: { title: '创建规则' }
                },
                {
                    path: '/configRuleSet',
                    name: 'configRuleSet',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/ruleSet/ConfigRuleSet.vue'),
                    meta: { title: '创建规则' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
