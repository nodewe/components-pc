//节点条件操作
import condition from './bpmnUtils/condition';
// 节点描述操作
import document from './bpmnUtils/document';
// 节点执行监听操作
import executionListener from './bpmnUtils/executionListener';
// 节点任务监听操作
import taskListener from './bpmnUtils/taskListener';
// 注释节点操作
import textAnnotation from './bpmnUtils/textAnnotation';
export default {
    methods: {
        // 修改元素属性
        updateElAttr(data, shape) {
            shape = shape ? shape : this.activeElement;
            const modeling = this.bpmnModeler.get('modeling')
            return modeling.updateProperties(shape, data)
        },
       ...condition,
       ...document,
       ...executionListener,
       ...taskListener,
       ...textAnnotation
    },
}