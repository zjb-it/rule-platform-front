# 操作文档 (文档可能不全，补充中)

开发规则平台的意义：
>1. 低代码的，可视化的规则配置平台
>2. 快速集成:在依赖其它系统接口的时候，不再需要额外工作量，只需要注册接口，即可完成集成
>3. 在保证运行结果正确的情况下，优化数据结构，减少内存开销，提升运行速度

*试用链接：数据每天24点会重置* http://39.103.133.197/rule-front/

**名词详细解释可查看[文档](https://github.com/zjb-it/rule-engine/blob/master/README.md)**

**[规则引擎文档](https://github.com/zjb-it/rule-engine/blob/master/README.md)**

**[规则平台后台文档](https://github.com/zjb-it/rule-platform-server/blob/master/README.md)**

**[更多开源软件 https://www.gamewar.cn](https://www.gamewar.cn)**

*本人为java开发，刚接触前端，页面一定会有bug, 如果遇到bug, 欢迎 issues*

*待开发（todo list）*
>1. 规则集模块
>2. 决策表模块
>3. 多环境发布模块


## 新建一个 "电话号码归属地是否是风险地区" 规则，如果 电话号码归属地=新疆 或 电话号码归属地=河北，则为高风险

1. 新建元素：元素即参数，在这指当前用户的电话号码

![新建元素](https://github.com/zjb-it/rule-platform-front/blob/master/screenshot/element.jpg)

2. 新建函数： *获取电话号码归属地*

![新建函数](https://github.com/zjb-it/rule-platform-front/blob/master/screenshot/function.jpg)

>新建函数后，可以简单测试一下，看一下函数返回值

![测试函数](https://github.com/zjb-it/rule-platform-front/blob/master/screenshot/testFunction.jpg)

3. 新建变量 *获取用户号码的归属地*：新建一个变量获取电话号码归属地，该变量引用函数 *"获取电话号码归属地"*

![新建变量1](https://github.com/zjb-it/rule-platform-front/blob/master/screenshot/variable.jpg)

4. 新建变量 *"获取用户号码的归属地的code"*：因为函数 *获取电话号码归属地*返回code=0000,才是成功，所以需要先获取code进行判断 

![新建变量1](https://github.com/zjb-it/rule-platform-front/blob/master/screenshot/variable1.jpg)

5. 新建变量 *"从用户的号码归属地中获取省"* ：获取函数 *"获取电话号码归属地"* 返回值中的data.province 

![新建变量1](https://github.com/zjb-it/rule-platform-front/blob/master/screenshot/variable2.jpg)

6. 新建条件 *电话号码归属地返回的code==0000*： 因为变量 *"获取用户号码的归属地"*code=0000,才是成功,所以先判断code

![新建变量1](https://github.com/zjb-it/rule-platform-front/blob/master/screenshot/condition1.jpg)

7. 新建条件2 *电话号码归属地返回的province=新疆*： 

![新建变量1](https://github.com/zjb-it/rule-platform-front/blob/master/screenshot/condition.jpg)

8. 新建规则 *hign_risk 是否是疫情高风险地区*： 

![新建变量1](https://github.com/zjb-it/rule-platform-front/blob/master/screenshot/rule1.jpg)

9. 下一步配置规则 ： 

![新建变量1](https://github.com/zjb-it/rule-platform-front/blob/master/screenshot/rule2.jpg)

10. 预览 & 测试 & 发布规则 ： 

![新建变量1](https://github.com/zjb-it/rule-platform-front/blob/master/screenshot/rule3.jpg)

>1. 可以测试规则，只用于测试，此时规则不会被发布
>2. 规则发布后，用Curl 命令模拟接口调用，需要更换host
>3. 发布规则， 规则发布成功后，即可通过2中的命令正常调用

