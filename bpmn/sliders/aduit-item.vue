<template>
    <el-collapse-item title="审核配置" name="4">
        <edit-item label="处理人">
            <el-input placeholder="请输入处理人" :size="size" v-model="assignee" maxlength="32" @change="setProperty('assignee')" />
        </edit-item>

        <edit-item label="候选用户">
            <el-input placeholder="请输入候选用户" :size="size" v-model="candidateUsers" maxlength="20"  @change="setProperty('candidateUsers')" />
        </edit-item>
        <edit-item label="候选组">
            <el-input placeholder="请输入候选组" :size="size" v-model="candidateGroups" maxlength="20"  @change="setProperty('candidateGroups')" />
        </edit-item>
    </el-collapse-item>
</template>

<script>
import { setPriority } from 'os';
import EditItem from './EditItem.vue';
export default {
    inject:{
        //来自bpmn-main组件的实例
        vm:{
            type:Object,
            default:()=>{}
        }
    },
    components: {
        EditItem,
    },
    computed: {
        getBpmn() {
            return this.vm.$refs.BPMN 
        }
    },
    data() {
        return {
            size:'small',
            //候选人
            assignee:"",
            //候选用户
            candidateUsers:'',
            //候选组
            candidateGroups:'',
            //选中的节点
            activeElement:''
        }
    },
    created(){
        //监听desginer 发过来的事件
        this.$bus.$on('bpmn:click',this.bpmnClick)
    },
    methods: {
        //点击发来的事件
        bpmnClick(element){
           if(element.type!=='bpmn:UserTask')return
           this.activeElement = element;
           const prefix = 'flowable'
           this.assignee = element.businessObject.get(`${prefix}:assignee`);
           this.candidateUsers = element.businessObject.get(`${prefix}:candidateUsers`);
           this.candidateGroups =  element.businessObject.get(`${prefix}:candidateGroups`)
        },
        setProperty(str){
            this.getBpmn.updateElAttr({
                [`flowable:${str}`]:this[str]
            })
        },
    },
}
</script>

<style lang="scss" scoped>

</style>