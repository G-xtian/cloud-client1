<template>
  <div class="wl-explorer" @contextmenu.prevent>
    <el-form
        :inline="true"
        size="large"
        class="wl-header-file"
        @submit.native.prevent
    >
      <div style="display: flex">
        <el-input
            v-model="input1"
            class="w-50 m-2"
            size="large"
            placeholder="请输入关键词搜索"
            :prefix-icon="Search"
            :change="searchFile"
        />
        <el-button @click="searchfile"><el-icon><Search /></el-icon></el-button>
      </div>
    </el-form>
    <div class="main">
      <el-tabs
          v-model="activeName"
          type="card"
          class="demo-tabs"
          @tab-click="handleClick"
          v-if="tabsOpen"
      >
        <el-tab-pane class="main_first" label="综合" name="first">
          <div class="first" v-for="(item, index) in datalist" :key="index">
            <div class="first_path" >
              <p :class="{first_p: i === index }" @mouseover="yr(index)" @mouseleave="yc" @click="toDetailsPage(first,index)">{{ item.fileTitle }}</p>
            </div>
            <div class="first_title">
              {{ item.filePath }}
            </div>
            <div class="first_tail">
              <div class="tail_left">
                <el-icon style="color: #1a1a1a"><View /></el-icon>{{ item.fileCount }}
              </div>
              <div class="tail_right">
                {{ getDate(item.modtime) }}
              </div>
            </div>
            <div class="first_divider">
              <el-divider />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane class="main_second" label="最新" name="second" :data="dataList">
          <div class="first" v-for="(item, index) in list" :key="index">
            <div class="first_path" >
              <p :class="{first_p: i === index }" @mouseover="yr(index)" @mouseleave="yc" @click="toDetailsPage(second,index)">{{ item.fileTitle }}</p>
            </div>
            <div class="first_title">
              {{ item.filePath }}
            </div>
            <div class="first_tail">
              <div class="tail_left">
                <el-icon><View /></el-icon>{{ item.fileCount }}
              </div>
              <div class="tail_right">
                {{ getDate(item.modtime) }}
              </div>
            </div>
            <div class="first_divider">
              <el-divider />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane class="main_third" label="最热" name="third" :data="dataList">
          <div class="first" v-for="(item, index) in list" :key="index">
            <div class="first_path" >
              <p :class="{first_p: i === index }" @mouseover="yr(index)" @mouseleave="yc" @click="toDetailsPage(third,index)">{{ item.fileTitle }}</p>
            </div>
            <div class="first_title">
              {{ item.filePath }}
            </div>
            <div class="first_tail">
              <div class="tail_left">
                <el-icon><View /></el-icon>{{ item.fileCount }}
              </div>
              <div class="tail_right">
                {{ getDate(item.modtime) }}
              </div>
            </div>
            <div class="first_divider">
              <el-divider />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="main_details" v-if="detailsOpen">
        <div class="main_details_div1">
          <el-page-header class="main_details_header" @back="goBack">
            <template #content>
              <span class="text-large font-600 mr-3">{{ data.fileTitle }}</span>
            </template>
          </el-page-header>
          <el-divider />
        </div>
        <div class="main_details_content">
          <div style="width: 98%;">正文介绍:<el-divider /></div>
          <div style="width: 98%;">{{ data.fileContent }}<el-divider /></div>
          <div class="content_card">
            <div style="width: 60%;height: 60px;display: flex;flex-direction: column;justify-content: space-around;">
              <div style="width: 100%;">
                {{data.filename}}
              </div>
              <div style="width: 100%;color: #6b778c;font-size: 10px">
                {{ computeSize(data.fileCapacity) }}
              </div>
            </div>
            <div style="cursor: pointer;color: #00abea" @click="uploadFile">
              点击下载
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Search,ArrowDown,RefreshRight} from "@element-plus/icons";
import {Ref, ref} from 'vue';
import {asyncSearchFileListApi,searchFile} from '../api/File';
import type { TabsPaneContext } from 'element-plus';
import {ElMessage} from "element-plus";
import router from "../router";
import axios from "../axios";
const input1 = ref('')
const activeName = ref('first')
const datalist = ref([])
const active = ref('')
const i = ref(-1)
const tabsOpen = ref(true)
const detailsOpen = ref(false)
const list: {
  fileUuid: "",
  filename: "",
  filePath: "",
  fileCapacity: "",
  modtime: "",
  fileTitle: "",
  fileContent: "",
  fileCount: 0
}[] = []
const data = ref({
  fileUuid: "",
  filename: "",
  filePath: "",
  fileCapacity: "",
  modtime: "",
  fileTitle: "",
  fileContent: "",
  fileCount: 0
})
const yr = (index: any) =>{
  i.value = index
}
const yc = () => {
  i.value = -1
}
//初始查询数据
(function(){
  asyncSearchFileListApi().then((res) => {
    for (let j = 0; j < res.data.data.length; j++) {
      list.push(res.data.data[j])
    }
    datalist.value = res.data.data
  });
}())

const handleClick = (tab: TabsPaneContext, event: Event) => {
  const sort = tab.props.name
  if (sort === "first"){
    firstSort()
  }else if (sort === "second"){
    secondSort()
  }else if (sort === "third"){
    thirdSort()
  }
}
//综合文件排序
const firstSort = () => {
}
//最新文件排序
const secondSort = () => {
  list.sort( (t1,t2) => new Date(t2.modtime).getTime() - new Date(t1.modtime).getTime())
}
//最热文件排序
const thirdSort = () => {
  list.sort( (t1,t2) => t2.fileCount - t1.fileCount)
}
//搜索文件
const searchfile = () => {
  if (input1.value != ''){
    const formData = new FormData();
    formData.append("searchName", input1.value)
    searchFile(formData).then((res) => {
      console.log('返回数据',res.data.data)
      const  count = list.length
      for (let j = 0; j < count; j++) {
        list.pop()
      }
      for (let j = 0; j < res.data.data.length; j++) {
        list.push(res.data.data[j])
      }
      datalist.value = []
      datalist.value = res.data.data
    })
  }else {
    ElMessage.error("关键词为空")
  }
}
//转换时间timestamp转换成正常
const getDate = (time: any) => {
  const now = new Date(time),
        y = now.getFullYear(),
        m = now.getMonth() + 1,
        d = now.getDate(),
        h = now.getHours() - 8,
        n = now.getMinutes(),
        s = now.getSeconds();
  return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + h + ":" + n + ":" + s;
}
//页面跳转
const toDetailsPage = (type: string,index: any) => {
  tabsOpen.value = false
  detailsOpen.value = true
  if (type === "frist"){
    data.value.fileUuid = datalist.value[index]["fileUuid"]
    data.value.filename = datalist.value[index]["filename"]
    data.value.filePath = datalist.value[index]["filePath"]
    data.value.fileCapacity = datalist.value[index]["fileCapacity"]
    data.value.modtime = datalist.value[index]["modtime"]
    data.value.fileTitle = datalist.value[index]["fileTitle"]
    data.value.fileContent = datalist.value[index]["fileContent"]
    data.value.fileCount = datalist.value[index]["fileCount"]
    axios.get("/updateCount",{params: {fileUuid:datalist.value[index]["fileUuid"]}}).then(res => {
      console.log('添加访问量',res)
    })
  }else {
    data.value.fileUuid = list[index].fileUuid
    data.value.filename = list[index].filename
    data.value.filePath = list[index].filePath
    data.value.fileCapacity = list[index].fileCapacity
    data.value.modtime = list[index].modtime
    data.value.fileTitle = list[index].fileTitle
    data.value.fileContent = list[index].fileContent
    data.value.fileCount = list[index].fileCount
    axios.get("/updateCount",{params: {fileUuid:list[index].fileUuid}}).then(res => {
      console.log('添加访问量',res)
    })
  }
}
//页面返回
const goBack = () => {
  tabsOpen.value = true
  detailsOpen.value = false
}
//计算文件大小
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
//下载文件
const uploadFile = () => {
  window.location.href = `/api/searchDownload?filename=${data.value.filename}`;
}
</script>

<style scoped lang="scss">
@import "../assets/css/index.css";
@import "../assets/css/clear.css";
@import "../assets/icons/iconfont.css";
p{
  color: #000000;
}
.first_p{
  color: #FC5552;
}
.el-form-item el-form-item--default asterisk-left file-search{
  width: 600px !important;
}
.wl-explorer{
  display: flex;
  align-content: center;
  flex-direction: column;
  align-items: center;
}
.wl-explorer .wl-header-file[data-v-d2b94ce3]{
  width: 95%;
}
.main{
  width: 95%;
  height: 100%;
  border: 0.5px solid #f6f6f6;
  border-radius: 4px;
  box-shadow: 5px 5px 15px #C4C4C4;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.first{
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-top: 5px;
}
.first_path{
  cursor: pointer;
  font-size: 17px;
  margin-left: 10px;
}
.first_title{
  color: #575757;
  margin-left: 10px;
  font-size: 14px;
}
.first_tail{
  width: 95%;
  display: flex;
  font-size: 9px;
  margin-left: 10px;
  flex-direction: row;
  justify-content: space-between;
}
.first_divider{
  height: 5px;
  margin: 0 !important;
}
.el-divider--horizontal{
  margin: 0 !important;
}
.main_details{
  display: flex;
  flex-direction: column;
}
.main_details_div1{

}
.main_details_header{
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 15px;
}
.main_details_content{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.content_card{
  width: 500px;
  height: 110px;
  border: 0.5px solid #fab9b9;
  border-radius: 4px;
  margin-top: 50px;
  display: flex;
  flex-direction: row;
  align-content: space-around;
  justify-content: space-around;
  align-items: center;

}
</style>