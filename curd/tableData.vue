<template>
    <el-table class="table" :height="440" :data="dataList" style="width: 100%">
        <el-table-column type="selection" width="30">
        </el-table-column>
        <el-table-column align="center" prop="componentName" label="组件名称">
        </el-table-column>
        <el-table-column align="center" prop="tableName" label="组件标题">
        </el-table-column>
        <el-table-column align="center" prop="formDescription" label="组件描述">
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作">
            <template slot-scope="scope">
                <el-button style="color:#409EFF" type="text" @click="$emit('edit', scope)" size="small">修改</el-button>
                <el-button style="color:#F56C6C" type="text" @click="$emit('del', scope)" size="small">删除</el-button>
                <el-button style="color:#E6A23C" @click="$emit('view', scope)" type="text" size="small">查看</el-button>
            </template>
        </el-table-column>
        <template slot="empty">
            <el-empty :image-size="100" description="暂无数据"></el-empty>
        </template>
    </el-table>
</template>

<script>
export default {
    props: {
        dataList: {
            type: Array,
            default: () => [
                // {batch:'批次',plan:'计划',year:'年度',enabled:'启用'}
            ]
        },
    }
}
</script>

<style lang="scss" scoped>
.table {
    /deep/ th {
        word-break: break-word;
        color: rgba(0, 0, 0, .85);
        background-color: #fafafa !important;
    }

    /deep/ th.el-table__cell.is-leaf {
        border-bottom: 1px solid #EBEEF5;
    }
}
</style>