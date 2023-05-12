<template>
  <div class="wl-explorer" @contextmenu.prevent>
    <div class="header">
      上传资源
    </div>
    <div class="main">
      <div class="main_file_upload">
        <el-upload
            class="upload-demo"
            drag
            multiple
            limit="1"
            action="11"
            name="file"
            v-model:file-list="fileList"
            :auto-upload="false"
            :on-exceed="handleExceed"
        >
          <div class="el-upload__text">
            将文件拖到此处或<em>单击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              上传文件不超过1024MB
            </div>
          </template>
        </el-upload>

      </div>
      <div class="main_title">
        <span>标题描述</span>
        <el-input
            class="main_title_input"
            v-model="title"
            :rows="3"
            maxlength="50"
            type="textarea"
            show-word-limit
            placeholder="请输入标题"
        />
      </div>
      <div class="main_content">
        <span>内容描述</span>
        <el-input
            class="main_content_input"
            v-model="content"
            :rows="11"
            maxlength="500"
            type="textarea"
            show-word-limit
            placeholder="请输入内容"
        />
      </div>
      <div class="main_button">
        <el-button type="primary" style="width: 100px;height: 45px;" @click="submitRectification">确定上传</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {SearchFileUploadApi,searchUpdate} from "../api/File";
import {ElMessage} from "element-plus";
import {ref} from "vue";
import { toRaw } from '@vue/reactivity'

const title = ref('')
const content = ref('')
const fileList = ref([])
/**
 * 文件上传
 * @param file 文件
 */
const submitRectification = () => {
  if ((title.value != null && title.value != "") && (content.value != null && content.value != "")){
    if (fileList.value[0] != null){
      const formData = new FormData();
      const file = toRaw(fileList.value)[0]["raw"]
      formData.append("file", file);
      formData.append("title", title.value);
      formData.append("content", content.value);
      SearchFileUploadApi(formData).then((res) => {
        if (res.data.code === 200) {
          // 上传成功
          ElMessage.success("上传成功");
          title.value = ''
          content.value = ''
        }else {
          ElMessage.error("上传失败");
        }
      });
    }else {
      ElMessage.error("文件为空");
    }
  }else {
    ElMessage.error("内容不能为空");
  }
}
const handleExceed = () => {
  ElMessage.success("只能上传一个！");
}
</script>

<style scoped lang="scss">
.wl-explorer{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: space-between;
  align-items: center;
}
.header{
  font-size: 20px;
  margin-top: 10px;
}
.main{
  width: 60%;
  display: flex;
  flex-direction: column;
  align-content: space-between;
  align-items: center;
  border: 0.5px solid #EBEEF5;
  border-radius: 4px;
  margin-top: 10px;
}
.main_file_upload{
  width: 90%;
  height: 100px;
  margin-top: 20px;
}
.main_title{
  width: 90%;
  margin-top: 60px;
}
.main_content{
  width: 90%;
  margin-top: 5px;
}
span{
  //margin: 5px 0 0 5px;
  color: #696868;
}
.main_button{
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>