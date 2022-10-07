<template>
  <div>
    <el-upload
      list-type="picture-card"
      :file-list="fileList"
      :multiple='isMultiple'
      :limit="maxCount"
      :auto-upload="autoUpload"
      :on-remove="remove"
      :headers="headers"
      :on-error="error"
      :on-success="success"
      :on-change="change"
      :http-request="uploadFile"
      ref="elUpload"
      :class="{ showHidden: fileList.length >= maxCount }"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="isShowDown"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="isShowRemove"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-image-viewer
      :zIndex="30000"
      v-if="showViewer"
      :onClose="
        () => {
          showViewer = false;
        }
      "
      :url-list="imgList"
    />
  </div>
</template>

<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  components: {
    ElImageViewer,
  },
  props: {
    //是否多选 默认是
    isMultiple:{
      type:Boolean,
      default:true
    },
    // 是否自动上传
    autoUpload: {
      type: Boolean,
      default: false,
    },
    //是否显示下载
    isShowDown: {
      type: Boolean,
      default: false,
    },
    //是否显示移除
    isShowRemove: {
      type: Boolean,
      default: false,
    },
    //文件列表
    fileList: {
      type: Array,
      default: () => [],
    },
    //最大允许上传的个数
    maxCount: {
      type: Number | String,
      default: 9,
    },
  },
  watch: {
    fileList: {
      handler() {
        this.list = this.fileList;
      },
    },
  },
  data() {
    return {
      list: [],
      //上传文件的地址
      // 上传的文件地址
      // action: process.env.VUE_APP_API_BASE_URL + "/api/oss/upload",
      imgList: null,
      //放大图片空间
      showViewer: false,
      disabled: false,
      showHidden: false,
    };
  },

  methods: {
    // 使用自己的上传方法
    uploadFile(file) {
      const formData = new FormData();
      formData.append("file", file.file);
      // 使用自己项目中封装的方法
      this.$house.file_upload(formData).then((res) => {
        let list = this.$refs.elUpload.uploadFiles;
        this.uploadFilesLength = list.length;
        list.forEach((ele) => {
          if (ele.uid == file.file.uid) {
            ele.url = this.apiUrl + res.file_path;
          }
        });
        //给list添加这个元素
        this.list.push({
          uid: file.file.uid.toString(),
          url: this.apiUrl + res.file_path,
        });
        this.uploadList.push(res.file_path);
        this.$emit("addImg", this.uploadList);
      });
    },
    //上传方法
    upload() {
      this.$refs.elUpload.submit();
    },
    //错误回调
    error(err, file, fileList) {
      console.log(err, "错误回调");
      console.log(file, "file");
      console.log(fileList, "fileList");
    },
    //移除回调
    remove(file, fileList) {
      console.log("移除回调");
      console.log(file);
      console.log(fileList);
    },
    //成功回调
    success(response, file, fileList) {
      //  console.log('成功回调')
      //  console.log(fileList,'fileList成功回调')
      this.$emit("on-success", fileList);
    },
    //文件状态改变时回调
    change(file, fileList) {
      //  console.log(fileList,'fileList')
      this.list = fileList;
    },
    //移除菜操作
    handleRemove(file) {
      const index = this.list.findIndex((ele) => ele.uid == file.uid);
      this.list.splice(index, 1);
    },
    //预览操作
    handlePictureCardPreview(file) {
      this.imgList = [file.url];
      this.showViewer = true;
    },
    //下载操作
    handleDownload(file) {
      console.log(file);
    },
  },
};
</script>
<style lang="scss" scoped>
.showHidden {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
::v-deep .el-upload--picture-card {
  width: 100px;
  height: 100px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
// 设置宽高的大小
::v-deep .el-upload-list__item {
  width: 100px;
  height: 100px;
}
</style>