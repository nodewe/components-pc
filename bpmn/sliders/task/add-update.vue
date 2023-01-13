<template>
    <el-dialog :close-on-click-modal="false" @close="cancel" :append-to-body="true" width="40%" :title="title"
        :visible.sync="visible" >
        <el-form ref="Form" :size="size" :rules="rules" :model="form"  label-position="top">
            <el-form-item prop="eventType" label="事件类型">
                <el-select style="width:100%" placeholder="请选择事件类型" clearable v-model="form.eventType">
                    <el-option v-for="{ label } in eventTypeList" :label="label" :value="label" :key="label" />
                </el-select>
            </el-form-item>
            <el-form-item prop="listenerType" label="监听器类型">
                <el-select style="width:100%" placeholder="请选择监听器类型" clearable v-model="form.listenerType">
                    <el-option v-for="{ label, value } in listenerTypeList" :label="label" :value="value" :key="value" />
                </el-select>
            </el-form-item>
            <el-form-item prop="value" label="值">
                <el-input v-model="form.value" placeholder="请输入值"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button :size="size" :icon="iconStyle" type="primary" @click="onSave">{{ saveBtnText }}</el-button>
            <el-button :size="size" :icon="iconStyle" @click="cancel">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    props: {
        //传递的数据项
        row: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            //dialog 的标题
            title: '新增',
            // dialog的可见与否
            visible: true,
            // 按钮的尺寸
            size: 'small',
            //状态 是 看 修改  新增
            state: '',
            // 表单数据
            form: {
                uniQueKey:'',
                //事件类型
                eventType: '',
                // 监听器类型
                listenerType: '',
                //值
                value: '',
                // sort: ''
            },
            //表单校验规则
            rules: {
                eventType: [
                    { required: true, message: '事件类型不能为空' }
                ],
                listenerType: [
                    { required: true, message: '监听器类型不能为空' }
                ],
                value: [
                    { required: true, message: '值不能为空' }
                ],
            }
        }
    },
    computed: {
        //保存按钮的文字
        saveBtnText() {
            return this.state == 'add' ? '保存' : '修改'
        },
        // 按钮的样式
        iconStyle() {
            return this.state == 'add' ? 'el-icon-circle-plus-outline' : 'el-icon-circle-check'
        },
        //事件类型枚举
        eventTypeList() {
            return [
                { label: 'create' },
                { label: 'assignment' },
                { label: 'complete' },
                { label: 'delete' },
            ]
        },
        //监听器类型枚举
        listenerTypeList() {
            return [
                { label: '类', value: 'class' },
                { label: '表达式', value: 'expression' },
                { label: '代理表达式', value: 'delegateExpression' },
            ]
        },
    },
    methods: {
        //初始化dialog
        initDialog(state) {
            this.visible = true;
            const titles = {
                'add': '新增执行监听器',
                'view': '查看',
                'edit': '修改执行监听器'
            }
            // 标题赋值
            this.title = titles[state];
            // 状态赋值
            this.state = state;
            if (this.row) {
                Object.keys(this.form)
                    .forEach(key => {
                        this.form[key] = this.row[key]
                    })
            }else{
                this.form.uniQueKey = `${Date.now()}`
            }
        },
        //关闭dialog
        closeDialog() {
            this.$emit('closeDialog')
        },
        //
        refreshData(...data) {
            this.$emit('refreshData',...data)
        },
        //取消
        cancel() {
            this.closeDialog()
        },
        //保存
        onSave() {
            this.$refs.Form.validate(vaild => {
                if (vaild) {
                  
                    this.refreshData(this.form,this.state)
                    this.visible = false
                    // this.closeDialog()
                }
            })

        },

    }
}
</script>

<style lang="scss" scoped>
.el-dialog__header {
    padding: 16px 24px;
    min-height: 20px;
    border-bottom: 1px solid #f0f0f0;
}

.dialog-footer {
    display: block;
    padding: 10px 16px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-top: 1px solid #f0f0f0;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #fff;
    text-align: right;
}
</style>