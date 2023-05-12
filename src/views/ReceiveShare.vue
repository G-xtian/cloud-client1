<template>
  <div class="wl-explorer" @contextmenu.prevent>
    <el-scrollbar class="wl-main-scroll">
      <!-- 文件列表区 -->
      <!-- 表格型文件列表 -->
      <div class="wl-main-list">

        <el-table
          highlight-current-row
          :border="true"
          :data="self_data"
          class="wl-table"
          ref="wl-table"
        >
          <slot name="table-column-top"></slot>
          <el-table-column property="filename" label="文件名">
            <template #default="scope">
              <div style="display: flex">
                <div class="namecol-iconbox">
                  <img
                    :src="fileTypeIcon(scope.row.filename)"
                    class="name-col-icon"
                    alt="文件类型图标"
                  />
                </div>
                <span style="margin-left: 5px;cursor: pointer">{{ scope.row.filename }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="fileCapacity" label="大小">
            <template #default="scope">
              <span style="margin-left: 5px" >{{ computeSize(scope.row.fileCapacity) }}</span>
            </template>
          </el-table-column>
          <el-table-column property="modtime" label="修改时间"/>
          <slot name="table-column-bottom"></slot>
        </el-table>
      </div>

      <!-- 列表型文件列表 -->
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">

import axios from "../axios";

const self_data = ref([]);
const queryShare = () => {
  axios.get("/getMyReceiveShare",{params:{email:sessionStorage.getItem("email")}}).then((res) => {
    console.log(res.data.data);
    self_data.value = res.data.data;
  });
}
// 根据文件类型显示图标
const fileTypeIcon = (row:string) => {
  const suffix = row.split(".")[1];
  let _path = "";
  // 文件夹
  if (suffix === "") {
    return new URL('./images/folder@3x.png', import.meta.url).href;
  }
  // 其他根据后缀类型
  const _suffix = row.split('.').pop()?.toLowerCase() || '';
  if (!_suffix) {
    return new URL('./images/folder@3x.png', import.meta.url).href;
  }
  if (["jpg", "jpeg", "png", "gif", "bmp"].includes(_suffix)) {
    // 图片
    _path = './images/file_img@3x.png'
  } else if (["zip", "rar", "7z"].includes(_suffix)) {
    _path = './images/file_zip@3x.png'
  } else if (
    ["avi", "mp4", "rmvb", "flv", "mov", "m2v", "mkv"].includes(_suffix)
  ) {
    _path = './images/file_video@3x.png'
  } else if (["mp3", "wav", "wmv", "wma"].includes(_suffix)) {
    _path = './images/file_mp3@3x.png'
  } else if (["xls", "xlsx","csv"].includes(_suffix)) {
    _path = './images/file_excel@3x.png'
  } else if (["doc", "docx"].includes(_suffix)) {
    _path = './images/file_docx@3x.png'
  } else if ("pdf" == _suffix) {
    _path = './images/file_pdf@3x.png'
  } else if ("ppt" == _suffix) {
    _path = './images/file_ppt@3x.png'
  } else if (["txt","sql"].includes(_suffix)) {
    _path = './images/file_txt@3x.png'
  } else {
    _path = './images/folder@3x.png'
  }
  return new URL(_path, import.meta.url).href;
};

// 计算文件大小
const computeSize = (size: number) => {

  if (size == undefined) {
    return "0B";
  }
  if (size < 1024) {
    return size + "B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + "KB";
  } else if (size < 1024 * 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + "MB";
  } else {
    return (size / 1024 / 1024 / 1024).toFixed(2) + "GB";
  }
};

onMounted(() => {
  queryShare();
});
</script>

<style scoped>
@import "../assets/css/index.css";
@import "../assets/css/clear.css";
@import "../assets/icons/iconfont.css";
</style>