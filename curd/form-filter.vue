<template>
    <!-- 条件表单 -->
    <el-form inline :size="size">
        <el-form-item>
            <el-input v-model="params.componentName" placeholder="请输入组件名称搜索"></el-input>
        </el-form-item>
       
        <div class="form">
            <div>
                <el-button @click="search" icon="el-icon-search" :size="size" type="primary">搜索</el-button>
                <el-button icon="el-icon-delete" :size="size" @click="reset">重置</el-button>
                <el-button  icon="el-icon-plus" @click="$emit('add')" type="primary" :size="size">新增</el-button>
            </div>
            <div>
                <el-button  :size="size" @click="search" icon="el-icon-refresh-left" circle></el-button>
            </div>
        </div>

    </el-form>
</template>

<script>
export default {
    props: {
        filter: {
            type: Object,
            default: () => { }
        },
    },
    computed: {
        
    },
    data() {
        return {
            size: 'small',
            params: {
                //组件名称
                componentName: '',
            }
        }
    },
    watch: {
        filter() {
            Object.keys(this.params)
                .forEach(key => {
                    this.params[key] = this.filter[key]
                })
        },
    },
    methods: {
        //搜索
        search() {
            this.$emit('update:filter', JSON.parse(JSON.stringify(this.params)));
            this.$emit('refreshData')
        },
        //重置清空
        reset() {
            Object.keys(this.params)
                .forEach(key => {
                    this.params[key] = '';
                })
            this.search()
        }
    }
}
</script>

<style lang="scss" scoped>
.form{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:10px;
}
</style>