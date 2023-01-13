// 默认空的xml
export default () => {
    const id = `Process_${Date.now()}`
    return `<?xml version="1.0" encoding="UTF-8"?>
    <definitions 
    xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" 
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
    xmlns:flowable="http://flowable.org/bpmn" 
    xmlns:activiti="http://activiti.org/bpmn" 
    xmlns:camunda="http://camunda.org/schema/1.0/bpmn" 
    targetNamespace="http://bpmn.io/schema/bpmn"
     >
      <process id="${id}" name="${id}" isExecutable="true">
      </process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${id}" />
      </bpmndi:BPMNDiagram>
    </definitions>`;
}