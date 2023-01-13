<template>
  <el-button-group>
    <el-tooltip  effect="light" content="开启/关闭流程模拟" placement="top-start">
      <el-button class="el-button__no-padding" title="开启/关闭流程模拟" @click="mockSimulationToggle">
      <i class="el-icon-s-claim"></i>
    </el-button>
    </el-tooltip>
    <el-tooltip  effect="light" content="展开/收起小地图" placement="top-start">
      <el-button class="el-button__no-padding"  @click="minimapToggle">
      <i class="el-icon-map-location"></i>
    </el-button>
    </el-tooltip>
    <el-tooltip  effect="light" content="撤销" placement="top-start">
      <el-button class="el-button__no-padding" title="开启/关闭流程模拟" @click="undo">
      <i class="el-icon-refresh-left"></i>
    </el-button>
    </el-tooltip>
    <el-tooltip  effect="light" content="恢复" placement="top-start">
      <el-button class="el-button__no-padding"  @click="redo">
      <i class="el-icon-refresh-right"></i>
    </el-button>
    </el-tooltip>
    <el-button @click="preview">预览</el-button>
  </el-button-group>
</template>

<script>

export default {
  name: "BpmnExternals",
  methods: {
    // 开启或关闭流程校验
    mockSimulationToggle() {
      this.$emit('mockSimulationToggle');
    },
    // 展开收起小地图
    minimapToggle() {
      this.$emit('minimapToggle')
    },
    //撤销
    undo(){
        this.$emit('undo')
    },
    //恢复
    redo(){
      this.$emit('redo')
    },
    preview(){
      this.$emit('preview')
    },
  }
};
</script>
