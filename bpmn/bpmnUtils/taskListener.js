// 设置扩展属性 设置任务监听
// class类  expression表达式  delegateExpression代理表达式 
// 设置的值就是 对应的表达式

// event 对应四个事件   create  assignment complete  delete
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";
/**
 * 
 * @param {Object} element 节点元素类型
 * @param {String} eventType 事件类型
 * @param {String} listenerType 监听类型
 * @param {String} value 监听类型的值
 */
function createTaskEventElement(element, eventType, listenerType, value,uniQueKey) {
    const moddle = this.bpmnModeler.get("moddle")
    const modeling = this.bpmnModeler.get('modeling');
    const businessObject = getBusinessObject(element)
    let extensionElements = businessObject.extensionElements
    if (!extensionElements) {
        extensionElements = moddle.create("bpmn:ExtensionElements", { values: [] });
    }
    const listener = this.createListener(eventType, listenerType, value,uniQueKey, 'TaskListener')
    extensionElements.values.push(listener)
    modeling.updateProperties(element, {
        extensionElements: extensionElements
    })
}


/**
 * 
 * @param {Object} element 节点元素类型
 * @param {String} eventType 事件类型
 * @param {String} listenerType 监听类型
 * @param {String} value 监听类型的值
 */
function updateTaskEventElement(element, eventType, listenerType, value, uniQueKey) {

    const modeling = this.bpmnModeler.get('modeling'),
        businessObject = getBusinessObject(element);
    //获取扩展属性
    const extensionElements = businessObject.extensionElements
    //创建一个修改的 listener
    const listener = this.createListener(eventType, listenerType, value,uniQueKey, 'TaskListener')
    //将创建好的监听器 加入到 flowable:ExecutionListener values中
    const index = extensionElements.values.findIndex(ele => ele.$attrs.uniQueKey == uniQueKey);
    extensionElements.values.splice(index, 1, listener)
    modeling.updateProperties(element, {
        extensionElements: extensionElements
    })

}


/**
 * 删除元素节点类型
 * @param {Object} element 节点元素类型
 * @param {Array} values 保留的扩展属性的list
 */
function deleteTaskEventElement(element, uniQueKey) {
    const modeling = this.bpmnModeler.get('modeling'),
        businessObject = getBusinessObject(element);
    let extensionElements = businessObject.extensionElements
    const index = extensionElements.values.findIndex(ele => ele.$attrs.uniQueKey == uniQueKey);
    extensionElements.values.splice(index, 1)
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
 * 获取节点的任务监听数据
 * @param {Object} element 节点元素
 */
function getTaskList(element) {
    const businessObject = getBusinessObject(element)
    const extensionElements = businessObject.extensionElements;
    if (extensionElements && extensionElements.values) {
        const listenerTypeList = ['class', 'expression', 'delegateExpression']
        const list = extensionElements.values.filter(ele => ele.$type == 'flowable:TaskListener')
            .map(ele => {
                const key = listenerTypeList.find(item => ele[item]);
                // console.log(ele,'ele');
                return {
                    uniQueKey:ele.$attrs.uniQueKey,
                    value: ele[key],
                    listenerType: key,
                    eventType: ele.event
                }
            })
        // console.log(list, 'list');
        return {
            list
        }
    }
    return []
}

export default {
    createTaskEventElement,
    updateTaskEventElement,
    deleteTaskEventElement,
    getTaskList
}