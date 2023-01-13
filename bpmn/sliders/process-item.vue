<template>
    <el-collapse-item title="流程配置" name="1">
        <edit-item label="流程key：">
            <el-input placeholder="请输入流程id" :size="size" v-model="elementId" maxlength="32" @change="updateElementId" />
        </edit-item>

        <edit-item label="流程名称：">
            <el-input placeholder="请输入流程名称" :size="size" v-model="elementName" maxlength="20" @change="updateElementName" />
        </edit-item>
        <edit-item label="流程描述：">
            <el-input placeholder="请输入流程描述" :size="size" v-model="documentName" maxlength="20" @change="updateElementDocument" />
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
            //元素id
            elementId:"",
            //流程名称
            elementName:'',
            //节点描述
            documentName:'',
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
           if(element.type!=='bpmn:Process')return
           this.activeElement = element;
           this.elementId =  element.businessObject.get('id')
           this.elementName = element.businessObject.get('name');
           this.documentName = this.getBpmn.getDocumentVal(element)
        },
        //更新元素id
        updateElementId(value) {
            this.getBpmn.updateElAttr({
                id:value
            })
        },
        //更新流程名称
        updateElementName(value){
            this.getBpmn.updateElAttr({
                name:value
            })
        },
        //流程描述
        updateElementDocument(value){
            this.getBpmn.setDocumentVal(value,this.activeElement)
        }
    },
}
</script>

<style lang="scss" scoped>

</style>