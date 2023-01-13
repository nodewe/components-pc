//小地图模块
import minimapModule from "diagram-js-minimap";
//流程模拟 动画辅助控件
import TokenSimulationModule from 'bpmn-js-token-simulation';
//基本bpmn 自定义面板
import customPlatte from './palette/index';
//  引入命令模式
import CommandStack from 'diagram-js/lib/command/CommandStack'


import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CloudElementTemplatesPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule
} from "bpmn-js-properties-panel";

// 设置自定义属性文件
// activiti 的自定义属性
import activitiModdleDescriptors from "./moddle-extensions/activiti.json";
// camunda 的自定义
import camundaModdleDescriptors from "./moddle-extensions/camunda.json";
// flowable 的自定义属性配置
import flowableModdleDescriptors from "./moddle-extensions/flowable.json";
// miyue的自定义属性配置
import miyueModdleDescriptors from "./moddle-extensions/miyue.json";


// 修改contextpad面板 
import contextPad from './ContextPad/EnhancementContextPad/index';
// import contextPad from './ContextPad/RewriteContextPad/index';

//辅助模块
const additionalModules = [
    customPlatte,
    // 引入命令模式
    CommandStack,
    //小地图的模块
    minimapModule,
    //流程模拟
    TokenSimulationModule,
    //如果需要官方自带的面板需要将这些插件注册
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CloudElementTemplatesPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule,
    //上下文面板
    contextPad
];

const options = (canvas) => {
    return {
        container: canvas,
        //添加控制板
        // propertiesPanel: {
        //     parent: '#bpmn-panel'
        // },
        // 使用键盘快捷键
        keyboard: { bindTo: document },
        // 辅助模块
        additionalModules,
        moddleExtensions: {
            flowable: flowableModdleDescriptors
        },
    }
}



//导出 options
export default options