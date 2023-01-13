
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";
// 设置扩展属性 设置执行监听
// class类  expression表达式  delegateExpression代理表达式 
// 设置的值就是 对应的表达式

// event 对应三个事件   start  take  end


function createListener(eventType, listenerType, value, uniQueKey, type = 'ExecutionListener') {
    const moddle = this.bpmnModeler.get("moddle")
    const listener = moddle.create(`flowable:${type}`, {
        [listenerType]: value,
        event: eventType,
        uniQueKey
    });
    return listener
}
/**
 * 
 * @param {Object} element 节点元素类型
 * @param {String} eventType 时间类型
 * @param {String} listenerType 监听类型
 * @param {String} value 监听类型的值
 */
function createExecutionEventElement(element, eventType, listenerType, value, uniQueKey) {
    const moddle = this.bpmnModeler.get("moddle")
    const modeling = this.bpmnModeler.get('modeling');
    const businessObject = getBusinessObject(element)
    let extensionElements = businessObject.extensionElements
    if (!extensionElements) {
        extensionElements = moddle.create("bpmn:ExtensionElements", { values: [] });
    }
    const listener = this.createListener(eventType, listenerType, value, uniQueKey)
    extensionElements.values.push(listener)
    modeling.updateProperties(element, {
        extensionElements: extensionElements
    })
}


/**
 * 
 * @param {Object} element 节点元素类型
 * @param {String} eventType 时间类型
 * @param {String} listenerType 监听类型
 * @param {String} value 监听类型的值
 */
function updateExecutionEventElement(element, eventType, listenerType, value, uniQueKey) {

    const modeling = this.bpmnModeler.get('modeling'),
        businessObject = getBusinessObject(element);
    //获取扩展属性
    const extensionElements = businessObject.extensionElements
    //创建一个修改的 listener
    const listener = this.createListener(eventType, listenerType, value, uniQueKey)
    //将创建好的监听器 加入到 flowable:ExecutionListener values中
    // values.push(listener);
    const index = extensionElements.values.findIndex(ele => ele.$attrs.uniQueKey == uniQueKey);
    extensionElements.values.splice(index, 1, listener)
    modeling.updateProperties(element, {
        extensionElements: extensionElements
    })
}


/**
 * 删除元素节点类型
 * @param {Object} element 节点元素类型
 * @param {Number} index 删除的索引值
 */
function deleteExecutionEventElement(element, uniQueKey) {
    const modeling = this.bpmnModeler.get('modeling'),
        businessObject = getBusinessObject(element);
    let extensionElements = businessObject.extensionElements;

    const index = extensionElements.values.findIndex(ele => ele.$attrs.uniQueKey == uniQueKey);
    extensionElements.values.splice(index, 1);
    //如果没有数据了 就置空
    if (!extensionElements.values.length) {

        return modeling.updateProperties(element, {
            extensionElements: undefined
        })
    }

    modeling.updateProperties(element, {
        extensionElements: extensionElements
    })
}
/**
 * 获取节点的执行监听数据
 * @param {Object} element 节点元素
 */
function getExecutionList(element) {
    const businessObject = getBusinessObject(element)
    const extensionElements = businessObject.extensionElements;
    if (extensionElements && extensionElements.values) {
        const listenerTypeList = ['class', 'expression', 'delegateExpression']
        const list = extensionElements.values.filter(ele => ele.$type == 'flowable:ExecutionListener')
            .map(ele => {
                const key = listenerTypeList.find(item => ele[item]);
                // console.log(ele,'ele.$attr.uniQueKey');
                return {
                    value: ele[key],
                    listenerType: key,
                    eventType: ele.event,
                    uniQueKey: ele.$attrs.uniQueKey
                }
            });
        return {
            list,
        }
    }
    return []
}

export default {
    createListener,
    createExecutionEventElement,
    updateExecutionEventElement,
    deleteExecutionEventElement,
    getExecutionList
}