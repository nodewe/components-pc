<template>
    <el-collapse-item title="执行监听" name="3">
        <div class="element-extension-listeners">
            <el-table border :data="listeners" style="width: 100%" height="230px">
                <el-table-column label="序号" type="index" width="50" />
                <el-table-column label="事件类型" prop="eventType" show-overflow-tooltip />
                <el-table-column width="100" label="监听器类型" prop="listenerType" show-overflow-tooltip />
                <el-table-column label="值" prop="value" show-overflow-tooltip />
                <el-table-column label="操作" width="140">
                    <template slot-scope="{ row, $index }">
                        <el-button type="text" @click="openListenerModel($index, row)">编辑</el-button>
                        <el-button type="text" @click="removeListener($index)">移除</el-button>
                    </template>
                </el-table-column>
                <template slot="empty">
                    <el-empty :image-size="50" description="暂无数据"></el-empty>
                </template>
            </el-table>

            <el-button type="primary" :size="size" class="inline-large-button" icon="el-icon-plus"
                @click="openListenerModel(-1)">
                添加执行监听
            </el-button>
            <addUpdate :row="row" ref="addUpdate" v-if="isShowAddUpdate" @refreshData="refreshData"
                @closeDialog="(isShowAddUpdate = false)" />
        </div>
    </el-collapse-item>
</template>

<script>
import addUpdate from './execution/add-update.vue';
export default {
    inject: {
        //来自bpmn-main组件的实例
        vm: {
            type: Object,
            default: () => { }
        }
    },
    components: {
        addUpdate
    },
    computed: {
        getBpmn() {
            return this.vm.$refs.BPMN
        }
    },
    data() {
        return {
            //选中的索引
            index: -1,
            //传递的数据
            row: null,
            //控制dialog边界面板的显示隐藏
            isShowAddUpdate: false,
            size: 'small',
            //元素id
            elementId: "",
            //流程名称
            elementName: '',
            //节点描述
            documentName: '',
            //选中的节点
            activeElement: '',
            //数据
            listeners: [],
            //保存 对应的额节点数组
            nodeList: []
        }
    },
    created() {
        //监听desginer 发过来的事件
        this.$bus.$on('bpmn:click', this.bpmnClick)
    },
    methods: {
        //点击发来的事件
        bpmnClick(element) {
            if (element.type === 'bpmn:Process') return
            this.activeElement = element;
            // console.log(element, 'element')
            const list = this.getBpmn.getExecutionList(element)
            // console.log(list, 'list')
            if (!Array.isArray(list)) {
                this.listeners = list.list;
                console.log(this.listeners,'listeners');
                // this.nodeList = list.values
            }
        },
        openListenerModel(index, row) {
            // if(){}
            this.row = row;
            this.isShowAddUpdate = true;
            this.index = index;
            this.$nextTick(() => {
                this.$refs.addUpdate.initDialog(index < 0 ? 'add' : 'edit')
            })
        },
        //添加或修改
        refreshData(form, state) {
            const { eventType, listenerType, value,uniQueKey } = form;
            if (state == 'add') {
                return this.getBpmn.createExecutionEventElement(
                    this.activeElement,
                    eventType, listenerType, value,uniQueKey
                )
            }
            //修改
            return this.getBpmn.updateExecutionEventElement(
                this.activeElement,
                eventType, listenerType, value, uniQueKey
            )
        },
        // 删除
        async removeListener(index) {
            const ret = await this.$confirm('确认删除该执行监听器吗？', '提示', { type: 'warning' })
            if (ret !== 'confirm') return
            const uniQueKey = this.listeners[index].uniQueKey;
            this.listeners.splice(index, 1)
            this.getBpmn.deleteExecutionEventElement(
                this.activeElement,
                uniQueKey
            )
        }
    },
}
</script>

<style lang="scss" scoped>
.inline-large-button {
    width: 100%
}
</style>