# 独立封装BPMN业务组件

注意事项 首先下载相关的npm包

```bash
npm i  bpmn-js@9.4.1
        @bpmn-io/properties-panel@0.20.3
        bpmn-js-bpmnlint@0.19.0
        bpmn-js-connectors-extension@0.4.1
        bpmn-js-properties-panel@1.6.1
        bpmn-js-token-simulation@0.27.0
        camunda-bpmn-moddle@7.0.1
        highlight.js@10.5.0
        diagram-js-minimap@2.1.1
```

以上的版本是我自己配出来的且运行没问题的

注意事项：

​	1、由于组件比较复杂 所以用到了一些比较侵入性的代码，比如所依赖的组件库必须是`elementUI`，如果项目不是`elementUI`写的需要自行修改相关的`elementUI`组件

1、bpmnUtils目录下时关于节点的基本操作 

![image](https://files.catbox.moe/24kiv4.png)



`condition.js` 文件里面就是关于节点的流转条件的 设置 和获取操作

`document.js` 里面时关于 节点描述信息 的设置和获取操作

`executionListener.js` 里面是关于执行监听器的创建 ，修改 ，删除，获取操作

`taskListener.js` 里面时关于任务监听器的创建，修改，删除，获取操作

`bpmn-main.vue`主体视图

`bpmn.vue`就是编辑器

`sliders`是节点信息编辑的的工具栏