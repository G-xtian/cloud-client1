<template>
  <div class="wl-explorer" @contextmenu.prevent>
    <!-- 头部按钮区 -->
    <el-form
      class="wl-header-btn"
      :inline="true"
      size="default"
      @submit.native.prevent
    >
      <el-form-item>
        <el-button type="danger" @click="deleteFile">删除</el-button>

        <el-button @click="recovery" type="primary">恢复</el-button>
        <!-- solt自定义头部按钮区 -->
        <slot name="header-btn"></slot>
      </el-form-item>
      <el-form-item>
        <el-dropdown trigger="click" @command="handleDropdown">
          <el-button type="primary">
            更多操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="move">移动</el-dropdown-item>
              <el-dropdown-item command="copy">复制</el-dropdown-item>
              <el-dropdown-item command="download">下载</el-dropdown-item>
              <el-dropdown-item command="rename">重命名</el-dropdown-item>
              <el-dropdown-item command="share">分享</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-form-item>
      <el-form-item>
        <el-button @click="refresh" :title="$t('file.async')"><el-icon size="20" color="var(--el-color-primary)"><RefreshRight/></el-icon></el-button>
      </el-form-item>
    </el-form>
    <!-- 主内容区 -->
    <el-form
      :inline="true"
      size="default"
      class="wl-header-file"
      @submit.native.prevent
    >
      <el-form-item class="file-path-box">
        <el-input
          class="u-full"
          ref="file-path-ipt"
          :model-value="currentPath"
        >
        </el-input>
      </el-form-item>
      <el-form-item class="file-search-box">
        <div style="display: flex">
          <el-input
            placeholder="请输入关键字搜索"
          >
          </el-input>
          <el-button><el-icon><Search /></el-icon></el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-scrollbar class="wl-main-scroll">
      <!-- 文件列表区 -->
        <!-- 表格型文件列表 -->
      <div class="wl-main-list">
        <div style="font-size: 10px;margin-bottom: 10px" v-if="currentPath === '/'">全部文件</div>
        <div v-else style="font-size: 10px;margin-bottom: 10px;display: flex">
          <span style="margin-right: 6px;cursor: pointer;color: #409eff" @click="backToLast">返回上一级   |</span>
          <span @click="backOriginPath" style="cursor: pointer;color: #409eff">全部文件</span>
          <div v-for="(item, index) in p" :key="index" style="margin-left: 5px">
            <span :style="{color: index === p.length - 1 ? 'black' : '#409eff'}">> {{item}}</span>
          </div>
        </div>
        <el-table
          highlight-current-row
          @selection-change="filrChecked"
          :border="true"
          :data="self_data"
          class="wl-table"
          ref="wl-table"
        >
          <el-table-column type="selection"  />
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="55"
          ></el-table-column>
          <slot name="table-column-top"></slot>
          <el-table-column property="filename" label="文件名">
            <template #default="scope">
              <div style="display: flex" @click=" scope.row.fileType === 1 ? toggleFolder(scope.row) : previewFile(scope.row)">
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
import {Search,ArrowDown,RefreshRight} from "@element-plus/icons";
import { asyncFileApi, fileDeleteToRecycleApi, queryFileInfoList } from "../api/File";
import axios from "../axios";
import * as qs from "qs";
import { ElMessage, ElMessageBox } from "element-plus";
const self_data = ref([])

const currentPath = ref('/')
const file_checked_data = ref()
const paging = ref({
  page: 1,
  rp: 10,
  fileName: "",
  parentUuid: "-1",
})

// 存储目录历史记录的数组
const directoryHistory: { fileUuid: string; filePath: string }[] = [];

const handleDropdown = () => {
  console.log('handleDropdown')
}
const filrChecked = (val: string[] | any[]) => {
  file_checked_data.value = val;
}
const recovery = () => {
  const folder = file_checked_data.value.find((item: {
    fileType: number; type: any;
  }) => item.fileType === 1);


  if (folder) {
    //弹出恢复弹窗，提示用户是否恢复
    ElMessageBox.confirm("是否恢复文件夹", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      // 恢复文件夹
      const { filePath: nodePath } = folder; // 当前节点的路径
      const filePath = currentPath.value === "/" ? nodePath : currentPath.value + "/" + nodePath;
      // 结尾加上/ 代表是文件夹
      axios.get("/recoverFile", {params:{filePath:nodePath}}).then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          ElMessage.success("恢复成功");
          // 刷新页面
          queryFileData();
        } else {
          ElMessage.error("恢复失败");
        }
      });
    }).catch(() => {
      ElMessage.info("已取消删除");
    });
    return;
  }

  // 恢复文件
  //弹出恢复弹窗，提示用户是否恢复
  ElMessageBox.confirm("是否恢复文件", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    // 恢复文件
    const { filePath: nodePath } = file_checked_data.value[0]; // 当前节点的路径
    // 结尾加上/ 代表是文件夹
    console.log(nodePath);
    axios.get("/recoverFile", {params:{filePath:nodePath}}).then((res) => {
      console.log(res);
      if (res.data.code === 200) {
        ElMessage.success("恢复成功");
        // 刷新页面
        queryFileData();
      } else {
        ElMessage.error("恢复失败");
      }
    });

  }).catch(() => {
    ElMessage.info("已取消删除");
  });
  return;

}
const deleteFile = () => {
  // 如果选中的是文件
  if (file_checked_data.value[0].fileType === 0) {
    //弹出删除弹窗，提示用户是否删除
    ElMessageBox.confirm("是否删除文件", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      // 删除文件
      const { filePath: nodePath } = file_checked_data.value[0]; // 当前节点的路径
      // 结尾加上/ 代表是文件夹
      axios.get("/deleteFolder", {params:{folderName:nodePath}}).then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          ElMessage.success("删除成功");
          // 刷新页面
          refresh()
        } else {
          ElMessage.error("删除失败");
        }
      });
    }).catch(() => {
      ElMessage.info("已取消删除");
    });
    return;
  }
  const folder = file_checked_data.value.find((item: {
    fileType: number; type: any;
  }) => item.fileType === 1);
  if (folder) {
//弹出删除弹窗，提示用户是否删除
    ElMessageBox.confirm("是否删除文件夹", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      // 删除文件夹
      const { filePath: nodePath } = folder; // 当前节点的路径
      const folderName = currentPath.value === "/" ? nodePath : currentPath.value + "/" + nodePath;
      // 结尾加上/ 代表是文件夹
      axios.get("/deleteFolder", {params:{folderName:folderName}}).then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          ElMessage.success("删除成功");
          // 刷新页面
          refresh();
        } else {
          ElMessage.error("删除失败");
        }
      });
    }).catch(() => {
      ElMessage.info("已取消删除");
    });
    return;
  }
}
// 进入目录
const toggleFolder = (row: any) => {
  if (row.fileType === 1) {
    //提示用户不能进入文件夹
    ElMessage.error("不能进入文件夹");
    return;
  }
  // 记录当前目录的信息
  directoryHistory.push({
    fileUuid: row.fileUuid,
    filePath: row.filePath,
  });
  console.log(directoryHistory)
  // 更改当前路径
  currentPath.value = row.filePath
  // 更改当前路径的uuid
  paging.value.parentUuid = row.fileUuid
  // 重新请求数据
  queryFileData()
}


const refresh = () => {
  asyncFileApi().then((res) => {
    if (res.status === 200) {
      ElMessage.success(res.data);
      // 重新当前目录的数据
      queryFileData();
    } else {
      ElMessage.error(res.data);
    }
  });
};

//返回上一级
const backToLast = () => {
// 如果历史记录为空，说明已经在根目录，直接返回
  if (directoryHistory.length === 0) {
    currentPath.value = '/';
    return;
  }
  // 如果历史记录不为空，说明不在根目录，可以返回上一级
  // 1. 删除最后一个元素
  // q: 为什么要删除最后一个元素？
  // a: 因为最后一个元素就是当前目录，我们要返回上一级，所以要删除当前目录
  directoryHistory.pop();
  // 2. 如果历史记录为空，说明已经在根目录，直接返回
  if (directoryHistory.length === 0) {
    currentPath.value = '/';
    paging.value.parentUuid = '-1'
    // q: 为什么要重新请求数据？
    // a: 因为我们已经返回到根目录了，所以要重新请求数据
    queryFileData()
    return;
  }
  // 3. 如果历史记录不为空，说明不在根目录，可以返回上一级
  // 3.1 获取最后一个元素
  const lastHistory = directoryHistory[directoryHistory.length - 1];
  // 3.2 更改当前路径
  currentPath.value = lastHistory.filePath;
  // 3.3 更改当前路径的uuid
  paging.value.parentUuid = lastHistory.fileUuid;
  // 3.4 重新请求数据
  queryFileData()

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

const queryFileData = () => {
  axios.post("/queryRecycleFileInfoList",qs.stringify(paging.value)).then((res) => {
    console.log("queryFileData",res)
    const data = res.data.data;
    self_data.value = data;
    //去除self_data.value中fileName结尾的/
    self_data.value.forEach((item:any) => {
      item.filename = item.filename.replace(/\/$/,'')
    })
    //按照文件夹在前，文件在后的顺序排序self_data.value.fileType 0文件 1文件夹
    self_data.value.sort((a:any,b:any) => {
      return b.fileType - a.fileType
    })
  })
}

onMounted(() => {
  queryFileData()
})
</script>


<style>
@import "../assets/css/index.css";
@import "../assets/css/clear.css";
@import "../assets/icons/iconfont.css";
</style>