<template>
  <div class="tree-data">
    <el-tree
      :data="data"
      node-key="id"
      @node-click="handleNodeClick"
      ref="tree"
      :filter-node-method="filterNode"
      accordion
      :expand-on-click-node="true"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span style="width: 300px">{{ data.name }}</span>
        <span :title="data.description" style="width: 300px;text-overflow: ellipsis;white-space:no-wrap;overflow:hidden">描述:{{ !data.description?'暂无描述':data.description }}</span>
        <span style="width: 500px; margin-left: 100px">
          <el-button
            type="primary"
            @click.stop="getCurrentNode(data)"
            icon="el-icon-edit"
            title="修改信息"
            circle
          >
          </el-button>
          <el-button
            type="success"
            circle
            title="添加子类"
            icon="el-icon-plus"
            @click.stop="() => append(data)"
          >
          </el-button>
          <el-button
            type="danger"
            circle
            title="删除"
            icon="el-icon-delete"
            @click.stop="() => remove(node, data)"
          >
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data:[
        {name:'宜房宝',description:'你好'}
      ], // 数据
      filterText: '',
      dataList: [],
      // pageIndex: 1,
      // pageSize: 10,
      // totalPage: 0,
      // dataListSelections: [],
      addOrUpdateVisible: false,
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    search () {
      this.$refs.tree.filter(this.filterText)
    },
     filterNode(value, data,node){
      if (!value) return true;
      let parentNode = node.parent
      let labels = [node.label]
      let level = 1
      while (level < node.level) {
        labels = [...labels, parentNode.label]
        parentNode = parentNode.parent
        level++
       }
      return labels.some(label => PinyinMatch.match(label,value) || label.indexOf(value)) 
    },
    async initRequest () {
      this.data = await this.request(1)
      for (const e of this.data) {
        let list = await this.request(e.level + 1, e.id)

        this.$set(e, 'children', list)
      }
      this.data = JSON.parse(JSON.stringify(this.data))
    },
    request (level, id = null) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: '/mr/chemicalcategory/queryAll',
          method: 'get',
          loading: false,
          params: {
            parentId: id,
            level
          }
        }).then(({ data }) => {
          if (data.list.length == 0) {
            resolve(data.list)
            return
          }
          data.list.forEach(e=>e.label=e.name)
          resolve(data.list)
        })
      })
    },
    // 修改信息
    getCurrentNode (data) {
        // console.log('修改');
        alert('修改')
        return 

      this.datainfo = data
      this.$refs.NodeInfoEdit.dataForm = data
      this.$refs.NodeInfoEdit.visible = true
    },
    // 点击节点的触发回调函数
    async handleNodeClick (data) {
        // console.log('点击节点')
        // alert('点击了节点')
        // return
      if (!data.children) {
        data.children = []
      }
      if (data.isRequest || data.children.length == 0) {
        return
      }
      data.isRequest = true // 添加已请求的标识,防止反复请求
      for (const e of data.children) {
        let list = await this.request(e.level + 1, e.id)
        this.$set(e, 'children', list)
      }
    },
    append (data) {
        // console.log('添加子节点')
        // alert('添加节点')
        // return
    //   if (data.level >= 2) {
    //     this.myAlert({
    //       type: 'warning',
    //       message: '暂不支持添加更多节点'
    //     })
    //     return
    //   }
     if (!data.children) {
        this.$set(data, 'children', [])
      }
      // 添加节点
      let labelName = `新建1`
    //   let uuid = this.$newgetUUID()
      const newChild = {
        parentId: 1,
        id:data.children.length ? data.children.length+1 : 1,
        name: labelName,
        children: [],
        // level: data.level + 1,
        // sort: sort + 1
      }
     
      data.children.push(newChild)
      return
      this.$http({
        url: '/mr/chemicalcategory/save',
        method: 'POST',

        data: {
          id: uuid,
          level: data.level + 1, // 当前的level
          parentId: data.id, // 父节点的parentId的
          // "parentCode":data.parentCode,//当前的parentCode
          name: labelName, // 当前的名字
          description: '', // 当前的描述
          sort: sort + 1 // 当前的排序sort值
        }
      }).then((res) => {
        if (res.data.code == 0) {
          this.myAlert({
            message: '添加成功',
            type: 'success'
          })
          newChild.label = newChild.name
          data.children.push(newChild)
        }
      })
    },

    remove (node, data) {
        // console.log('移除节点');
        // alert('删除')
        // return
      // 删除节点
      if (data.children.length > 0) {
        this.myAlert({
          type: 'warning',
          message: '该节点下还有子节点未删除'
        })
        return
      }
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id);
       children.splice(index, 1)
       return
      this.$confirm(`此操作删除该该节点, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: '/mr/chemicalcategory/delete',
            method: 'POST',
            data: [data.id]
          }).then((res) => {
            if (res.data.code == 0) {
              this.myAlert({
                message: '删除成功',
                type: 'success'
              })
              children.splice(index, 1)
            }
          })
        })
        .catch(() => {})
    },
    
    // 查看详情
    showDetails (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, true)
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      //
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id || this.data)
      })
    }
  }
}
</script>
<style lang="scss">
.el-button--medium.is-circle {
  padding: 6px !important;
  // width:20px !important;
  // height:20px !important;
}
.el-tree-node__content {
  min-height: 50px !important;
  display: flex !important;
  align-items: center !important;
}
.custom-tree-node {
  display: flex !important;
  align-items: center !important;
}
</style>