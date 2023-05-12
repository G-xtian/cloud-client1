<template>
  <div>
    <vue-pdf-embed :source="state.source" v-if="getFileType() === 'pdf'"/>
    <v-md-preview :text="str" v-if="getFileType() === 'md'"></v-md-preview>
  </div>
</template>

<script setup lang="ts">
import VuePdfEmbed from "vue-pdf-embed";
import { filePreviewApi } from "../api/File";

const str = ref("");
const source = "";
const state = reactive({
  source: source
});

function getQueryVariable(filePath1: string) {
  const query = window.location.search.substring(1);
//将query中的unicode转换为中文
  const a = decodeURI(query).split("&");
  const b = a[0].split("=");
  const filePath = b[1];
  return filePath;
}


//获取地址参数filePath的值
const filePath = ref(getQueryVariable("filePath"));

// 判断文件类型filePath
function getFileType() {
  return filePath.value.substring(filePath.value.lastIndexOf(".") + 1);

}
const loadPdf = async () => {
  await filePreviewApi(filePath.value).then((res) => {
    //url转base64
    if (getFileType() === 'pdf') {
      state.source = "data:application/pdf;base64," + res.data;
    } else if (getFileType() === 'md') {
      str.value = res.data;
    }
  });
};

onMounted(() => {
  loadPdf();
});

</script>

<style scoped>

</style>