<template>
    <el-collapse-item title="流转条件" name="1">
        <edit-item label="流转条件：">
            <el-input placeholder="请输入流转条件" :size="size" v-model="condVal" maxlength="32" @change="updateElementCondVal" />
        </edit-item>
    </el-collapse-item>
</template>

<script>
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
            //条件值
            condVal:'',
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
           if(element.type!=='bpmn:SequenceFlow')return
           this.activeElement = element;
           this.condVal = this.getBpmn.getConditionVal(element)
        },
        //更新元素id
        updateElementCondVal(value) {
            this.getBpmn.setConditionVal(value,this.activeElement)
        },
    },
}
</script>

<style lang="scss" scoped>

</style>