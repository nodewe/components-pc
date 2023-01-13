import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";

// 关于条件节点的操作 当元素节点为 bpmn:SequenceFlow 类型是可以设置条件

function setConditionVal(text,element) {
    // <conditionExpression xsi:type="tFormalExpression">1&gt;2</conditionExpression>
    const bpmnFactory = this.bpmnModeler.get("bpmnFactory")
    const modeling = this.bpmnModeler.get('modeling');
    // 如果传入的条件是空值 则把当前条件 移除
    if (!text) {
        return modeling.updateProperties(element, {
            conditionExpression:null
        })
    }
    const cond = bpmnFactory.create("bpmn:FormalExpression", { body:text })
    return modeling.updateProperties(element, {
        conditionExpression: cond
    })
}

// 获取条件节点的值
function getConditionVal(element) {
    const businessObject = getBusinessObject(element),
     conditionExpression = businessObject.get('conditionExpression');
    return conditionExpression ? conditionExpression.get('body') : ""
}

export default{
    setConditionVal,
    getConditionVal
}