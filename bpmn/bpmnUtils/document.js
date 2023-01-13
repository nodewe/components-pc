//关于 document属性的操作
/**
 * 
 * @param {String} text 设置元素的值
 * @param {Object} element 元素对象
 */
function setDocumentVal(text, element) {
    const bpmnFactory = this.bpmnModeler.get("bpmnFactory")
    const modeling = this.bpmnModeler.get('modeling');
    // 如果传入的描述是空值 则把当前document 移除
    if (!text) {
        return modeling.updateProperties(element, {
            documentation: null
        })
    }
    const doc = bpmnFactory.create("bpmn:Documentation", { text })
    return modeling.updateProperties(element, {
        documentation: [doc]
    })
}
/**
 * 获取描述节点的值 
 * @param {Object} element 得到的element
 * @returns {String}
 */
function getDocumentVal(element) {
    const businessObject = element.businessObject;
    const documentation = businessObject && findDocumentation(businessObject.get("documentation"));
    return documentation && documentation.text;
}
const DOCUMENTATION_TEXT_FORMAT = "text/plain";
// 查找 描述描述节点的 值   helper 帮助函数
function findDocumentation(docs) {
    return docs.find(function (d) {
        return (d.textFormat || DOCUMENTATION_TEXT_FORMAT) === DOCUMENTATION_TEXT_FORMAT;
    });
}
export default{
    setDocumentVal,
    getDocumentVal
}