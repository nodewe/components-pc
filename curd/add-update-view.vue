<template>
    <el-dialog :close-on-click-modal="false" @close="cancel" :append-to-body="true" width="900px" :title="title"
        :visible.sync="visible">
        <el-form class="dialogForm" ref="Form" :rules="rules" :model="form" label-width="100px" label-position="left">
            <el-form-item style="width:calc(50% - 10px)" prop="componentName" label="组件名称">
                <el-input :disabled="disabled" v-model="form.componentName" placeholder="请输入组件名称"></el-input>
            </el-form-item>
            <el-form-item style="width:calc(50% - 10px)" prop="tableName" label="组件标题">
                <el-input :disabled="disabled" v-model="form.tableName" placeholder="请输入组件标题"></el-input>
            </el-form-item>
            <el-form-item style="width:100%" label="组件描述">
                <el-input :disabled="disabled" type="textarea" rows="3" v-model="form.formDescription"
                    placeholder="请输入组件描述"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" v-if="!disabled" class="dialog-footer">
            <el-button :size="size" :icon="iconStyle" type="primary" @click="onSave">{{ saveBtnText }}</el-button>
            <el-button :size="size" :icon="iconStyle" @click="cancel">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
/**
 * 如果里面需要做参数收集 则不用 v-if 如果不需要参数收集则使用 v-if
 */
import { addTabForm, updateTabForm } from "@/api/form";
export default {
    props: {
        //是否禁用
        disabled: {
            type: Boolean,
            default: false
        },
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
                id: '',
                //组件名称
                componentName: '',
                // 渲染的名称
                tableName: '',
                //表单的描述
                formDescription: '',
                // sort: ''
            },
            //表单校验规则
            rules: {
                componentName: [
                    { required: true, message: '组件名称不能为空' }
                ],
                tableName: [
                    { required: true, message: '组件标题不能为空' }
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

    },
    methods: {
        //初始化dialog
        initDialog(state) {
            this.visible = true;
            const titles = {
                'add': '新增',
                'view': '查看',
                'edit': '修改'
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
            }
        },
        //关闭dialog
        closeDialog() {
            this.$emit('closeDialog')
        },
        //
        refreshData() {
            this.$emit('refreshData')
        },
        //取消
        cancel() {
            this.closeDialog()
        },
        //保存
        onSave() {
            this.$refs.Form.validate(vaild => {
                if (vaild) {
                    const STATEAPI = {
                        'add': addTabForm,
                        'edit': updateTabForm
                    }
                    const titles = {
                        'add': '新增',
                        'view': '查看',
                        'edit': '修改'
                    }
                    STATEAPI[this.state](this.form)
                        .then(res => {
                            if (res.data.code == 200) {
                                this.$message.success(`${titles[this.state]}成功`);
                                this.closeDialog()
                                this.refreshData()
                            }
                        })
                        .catch(err => {
                            console.log(err, 'add-update-view');
                        })

                }
            })

        },

    }
}
</script>

<style lang="scss" scoped>
/deep/.el-dialog__header {
    padding: 16px 24px;
    min-height: 20px;
    border-bottom: 1px solid #f0f0f0;
}

.dialogForm{
    display:flex;
    align-items:center;
    flex-wrap:wrap;
    width:100%;
    justify-content:space-between;
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