// 关于注释节点的操作 当元素节点为  类型是可以设置条件

function settextAnnotationVal(text,element) {
    // <conditionExpression xsi:type="tFormalExpression">1&gt;2</conditionExpression>
    const bpmnFactory = this.bpmnModeler.get("bpmnFactory")
    const modeling = this.bpmnModeler.get('modeling');
    // 如果传入的条件是空值 则把当前条件 移除
    if (!text) {
        return modeling.updateProperties(element, {
                text:null
        })
    }
    // const textAnnotation = bpmnFactory.create("bpmn:textAnnotation", { text })
    return modeling.updateProperties(element, {
        text
    })
}

// 获取注释节点节点的值
function gettextAnnotationVal(element) {
    const businessObject = element.businessObject;
    return businessObject.text || ""
}

export default{
    settextAnnotationVal,
    gettextAnnotationVal
}