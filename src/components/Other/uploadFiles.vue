<template>
  <img
    style="width: 30px; height: 30px; margin-right: 85%"
    src="../../assets/img/upload.png"
    @click="upload(null)"
  />
  <el-dialog
    title="上传文件"
    :close-on-click-modal="false"
    v-model="uploadFile"
  >
    <el-upload
      class="upload-demo"
      drag
      accept=".pdf,.doc,.docx,.png,.jpg"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :on-remove="handleRemove"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，<em>或点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">只支持pdf、doc、docx、png、jpg</div>
      </template>
    </el-upload>

    <template #footer>
      <div style="text-align: center; width: 100%">
        <el-button
          type="primary"
          style="width: 200px"
          @click="clickSave(upload)"
          >提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";

let uploadFile = ref(false);
let fileList = ref([]);

const upload = () => {
  fileList.value = [];
  uploadFile.value = true;
};

const clickSave = (formEL) => {
  //验证数据是否合格
  formEL.validate((flag) => {
    console.log("提交。。。" + flag);
    if (!flag) return;
    let attachment;
    if (fileList.value.length > 0) {
      attachment = fileList.value[0].url;
    }
    console.log(attachment, "attachment");
    // funUploadFile(p).then((res) => {
    //   if (!res.success) {
    //     ElMessage.error(res.message);
    //     return;
    //   }
    //   uploadFile.value = false;
    // });
  });
};

// 上传校验
const beforeUpload = (file) => {
  console.log(file, "file");
  const isLt2M = file.size / 1024 / 1024 < 10;
  if (!isLt2M) {
    ElMessage.error("上传图片大小不能超过 10MB！");
    return;
  }
  if (fileList.value.length > 3) {
    ElMessage.error("只支持上传3个文件!");
    return;
  }
  let fd = new FormData();
  fd.append("file", file);
  // uploadImg 是接口
  // uploadImg("public", fd).then((res) => {
  //   if (!res.success) {
  //     ElMessage.error(res.message);
  //     return;
  //   }
  //   fileList.value.push({
  //     name: res.data.substring(res.data.lastIndexOf("/") + 1, res.data.length),
  //     url: res.data,
  //   });
  // });
  return false;
};

//文件移除配置方法
const handleRemove = (file, files) => {
  fileList.value = files;
};
</script>

<style></style>
