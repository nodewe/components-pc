<template>
    <div class="main-content">
        <BPMN ref="BPMN" />
        <div class="main-content-edit">
            <el-collapse>
                <ProcessItem v-show="elType=='Process'"/>
                <BaseItem v-show="elType!='Process' && elType!=='TextAnnotation'"/>
                <textAnntationBase v-show="elType=='TextAnnotation'"/>
                <aduitItem v-show="elType=='UserTask'"/>
                
                <conditionItem v-show="elType==='SequenceFlow'"/>
                <ExecutionItem v-show="elType!='Process'"/>
                <TaskItem v-show="elType=='UserTask'"/>
            </el-collapse>
        </div>
    </div>
</template>

<script>
//设置$bus
import './Emiter';
import BPMN from './bpmn.vue';
//流程配置
import ProcessItem from './sliders/process-item.vue';
//基础配置
import BaseItem from './sliders/base-item.vue';
// 执行监听
import ExecutionItem from './sliders/execution-item.vue';
//注释节点 基本配置
import textAnntationBase from './sliders/text-annotation-item.vue';
//流转条件
import conditionItem from './sliders/condition-item.vue';
// 审核配置
import aduitItem from './sliders/aduit-item.vue';
//任务监听
import TaskItem from './sliders/task-item.vue';
export default {
    provide(){
        return {
            vm:this
        }
    },
    created(){
        this.$bus.$on('bpmn:click',(element)=>{
            this.activeElement = element
        })
    },
    computed: {
        //节点类型
        elType() {
            if(!this.activeElement)return 'Process'
            const type = this.activeElement.type;
            // console.log(type,'type');
            const dot = type.indexOf(':');
            return type.slice(dot+1)
        }
    },
    components: {
        BPMN,
        ProcessItem,
        BaseItem,
        ExecutionItem,
        textAnntationBase,
        conditionItem,
        aduitItem,
        TaskItem
    },
    data() {
        return {
            info: {

            },
            activeElement:null
        }
    },
}
</script>

<style lang="scss" scoped>
.main-content {
    // position: relative;
    display:flex;
    // flex:1;
    height:500px;
}
.main-content-edit{
    width:480px !important;
    height:100%;
    background-color:white;
    box-sizing: border-box;
    padding: 0 8px;
    border-left: 1px solid #eee;
    box-shadow: 0 0 8px #ccc;
}
</style>