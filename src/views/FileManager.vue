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
        <el-button type="primary" @click="handleFolder()">
          {{ $t('file.increase') }}
        </el-button>
<!--        <el-button :disabled="disabledEditFolder" @click="handleFolder('edit')">-->
<!--          {{ $t('file.edit') }}-->
<!--        </el-button>-->
        <el-button type="danger" @click="deleteFile" >{{ $t('file.delete') }}</el-button>
        <el-button @click="showUpload" type="primary">{{ $t('file.upload') }}</el-button>
        <!-- solt自定义头部按钮区 -->
        <slot name="header-btn"></slot>
      </el-form-item>
      <el-form-item>
        <el-dropdown trigger="click" @command="handleDropdown">
          <el-button type="primary">
            {{ $t('file.more') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="move">{{ $t('file.move') }}</el-dropdown-item>
              <el-dropdown-item command="copy">{{ $t('file.copy') }}</el-dropdown-item>
              <el-dropdown-item command="download">{{ $t('file.download') }}</el-dropdown-item>
              <el-dropdown-item command="rename">{{ $t('file.rename') }}</el-dropdown-item>
              <el-dropdown-item command="share">{{ $t('file.share') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-form-item>
      <el-form-item>
        <el-button @click="refresh" :title="$t('file.async')" v-has-permission="'cldk_file_refresh'"><el-icon size="20" color="var(--el-color-primary)"><RefreshRight/></el-icon></el-button>
      </el-form-item>
      <el-form-item v-show="uploading.ing">
        <span>正在上传：</span>
        <span class="c-blue u-uploading-name">{{ uploading.name }}</span>
        <span class="c-blue">({{ uploading.percentage }}%)</span>
      </el-form-item>
<!--      <el-form-item class="u-right">-->
<!--        <i-->
<!--          class="iconfont icon-wl-list file-show-type"-->
<!--          v-show="layout.show_list"-->
<!--          @click="layout.show_list = !layout.show_list"-->
<!--        ></i>-->
<!--        <i-->
<!--          class="iconfont icon-wl-grid file-show-type"-->
<!--          v-show="!layout.show_list"-->
<!--          @click="layout.show_list = !layout.show_list"-->
<!--        ></i>-->
<!--      </el-form-item>-->
    </el-form>
    <!--文件路径操作区-->
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
          <img
            slot="prefix"
            class="file-path-img"
            src="./images/folder@3x.png"
            alt="文件夹"
            title="文件夹"
          />
        </el-input>
      </el-form-item>
      <el-form-item class="file-search-box" v-has-permission="'cldk_file_query'">
       <div style="display: flex">
         <el-input
           v-model="paging.fileName"
           placeholder="请输入关键字搜索"
           @keyup.enter.native="searchFile"
         >
         </el-input>
         <el-button><el-icon><Search /></el-icon></el-button>
       </div>
      </el-form-item>
    </el-form>

    <!-- 主内容区 -->
    <el-scrollbar class="wl-main-scroll">
      <!-- 文件列表区 -->
      <div class="wl-main-list">
        <div style="font-size: 10px;margin-bottom: 10px" v-if="currentPath === '/'">全部文件</div>
        <div v-else style="font-size: 10px;margin-bottom: 10px;display: flex">
          <span style="margin-right: 6px;cursor: pointer;color: #409eff" @click="backToLast">返回上一级   |</span>
          <span @click="backOriginPath" style="cursor: pointer;color: #409eff">全部文件</span>
          <div v-for="(item, index) in p" :key="index " style="margin-left: 5px">
            <span :style="{color: index === p.length - 1? 'black' : '#409eff'}"> > {{item}}</span>
          </div>
        </div>
        <!-- 表格型文件列表 -->
        <el-table
          v-show="layout.show_list"
          highlight-current-row
          @selection-change="filrChecked"
          :border="true"
          :data="self_data"
          class="wl-table"
          ref="wl-table"
        >
          <el-table-column type="selection"  />
          <el-table-column
            v-if="showIndex"
            align="center"
            type="index"
            label="序号"
            width="55"
          ></el-table-column>
          <slot name="table-column-top"></slot>
          <el-table-column property="filename" :label="$t('file.name')">
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
          <el-table-column property="fileCapacity" :label="$t('file.size')">
            <template #default="scope">
                <span style="margin-left: 5px" >{{ computeSize(scope.row.fileCapacity) }}</span>
            </template>
          </el-table-column>
          <el-table-column property="modtime" :label="$t('file.updateTime')"/>
          <slot name="table-column-bottom"></slot>

        </el-table>
        <div class="demo-pagination-block" style="margin-top: 20px;margin-left: 20%">
          <el-pagination
            v-model:current-page="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[5, 10, 15, 20]"
            :small="small"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <!-- 列表型文件列表 -->
      </div>
    </el-scrollbar>
    <preview v-if="showPreview" :content="previewContent" @close="closePreview"></preview>
    <!-- 文件上传区 -->
    <template v-if="true">
      <fade-in v-show="layout.upload">
        <h3 class="edit-header">上传文件</h3>
        <el-scrollbar class="scroll">
          <el-form
            size="default"
            ref="template_form"
            label-position="top"
            class="template_form rule-form"
          >
            <el-form-item label="文件路径">
              <div>
                {{currentPath}}
              </div>
            </el-form-item>
            <el-form-item label="导入文件">
              <el-upload
                class="upload-demo"
                drag
                action="11"
                multiple
                name="file"
                :before-upload="handleUpload"
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  拖拽文件到此处 <em>点击上传</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    上传文件得不超过1024MB！
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <!-- 按钮区 -->
        <div class="submit-btn-box">
          <el-button type="primary" >保存</el-button>

          <el-button size="default" @click="layout.upload = false"
          >取消</el-button
          >
        </div>
      </fade-in>
    </template>
    <template v-if="true">
      <fade-in v-show="layout.copy">
        <el-tree
          accordion
          :data="treeData"
          :props="defaultProps"
          show-checkbox
          @check="handleChange"
          :check-strictly="true"/>
        <div class="submit-btn-box">
          <el-button type="primary" @click="copyFile">保存</el-button>

          <el-button size="default" @click="layout.copy = false"
          >取消</el-button
          >
        </div>
      </fade-in>
    </template>
    <template v-if="true">
      <fade-in v-show="layout.move">
        <el-tree
          accordion
          :data="treeData"
          :props="defaultProps"
          show-checkbox
          @check="handleChange"
          :check-strictly="true"/>
        <div class="submit-btn-box">
          <el-button type="primary" @click="moveFile">保存</el-button>

          <el-button size="default" @click="layout.move = false"
          >取消</el-button
          >
        </div>
      </fade-in>
    </template>
    <template v-if="true">
      <fade-in v-show="layout.share" :width="'500'">

        <el-form>
          <el-form-item label="文件名： ">
            <el-input v-model="fileName" ></el-input>
          </el-form-item>
          <el-form-item label="有效期: ">
            <el-input-number model-value="1" :min="1" :max="100" :step="1"></el-input-number>
          </el-form-item>
          <el-form-item label="二维码: ">
            <qrcode-vue :value="sendForm.fileUrl" size:300  ></qrcode-vue>
          </el-form-item>
          <el-form-item label="分享链接: ">
            <el-input :model-value="sendForm.fileUrl" ></el-input>
          </el-form-item>
          <el-form-item label="发送邮箱: ">
            <el-input v-model="sendForm.descEmail" ></el-input>
          </el-form-item>
        </el-form>
        <div class="submit-btn-box">
          <el-button type="primary" @click="shareFile">分享</el-button>

          <el-button size="default" @click="layout.share = false"
          >取消</el-button
          >
        </div>
      </fade-in>
    </template>
  </div>
</template>

<script setup lang="ts">
import {RefreshRight,Search,ArrowDown,UploadFilled} from "@element-plus/icons"
import {
  asyncFileApi,
  filePreviewApi,
  asyncFileListApi,
  fileUploadApi,
  fileCreateApi,
  fileDeleteApi,
  fileDeleteToRecycleApi
} from "../api/file";
import QrcodeVue from 'qrcode.vue'
import { ElMessage, ElMessageBox } from "element-plus";
import { Ref } from "vue";
import Preview from "../components/Preview.vue";
import FadeIn from "../components/fade-In.vue";
import axios from "../axios";
import qs from "qs";

const userUuid = sessionStorage.getItem("userUuid");
const email = ref("");
interface Node {
  fileUuid: string;
  parentUuid?: string | null;
  name: string;
  path: string;
  type: "file" | "folder";
  size?: number;
  modtime: string;
  children?: Node[];
}

const defaultProps = {
  children: "children",
  label: "fileName",
  disabled: "disabled",
};

const treeData: Ref<FileNode[]> = ref([])
// 存储目录历史记录的数组
let directoryHistory: { fileUuid: string; filePath: string }[] = [];


const showShare = ref(false)
const showPreview = ref(false);
const showPreviewMarkdown = ref(false);
const previewContent = ref({
  content: "",
  type: "",
});
const useUpload = ref(true);
const file_checked_data  = ref();
const currentPath = ref("/"); // 当前路径
const self_data: Ref<Node[]> = ref([]);

const file = ref({
  path: {
    type: Boolean,
    default: false,
  },
  pId: {
    type: String,
    default: "00000000-0000-0000-0000-000000000000",
  },
  id: {
    type: String,
    default: "00000000-0000-0000-0000-000000000000",
  },
  key: {
    type: String,
    default: "",
  },
})
const path = ref({
  level: 1,
  index: -1,
  history: [
    {
      path: "", // 文件夹名字
      data: [] as Node[], // 数据
    },
  ],
})

const disabledEditFolder = ref(false); // 编辑文件夹按钮是否禁用
const uploading = ref({
  // 上传状态
  ing: false,
  name: "",
  percentage: 0,
}); // 上传状态
const layout = ref({
  show_list: true, // 文件展示形式
  edit_path: false, // 是否编辑路径
  view: false, // 预览视图
  move: false, // 移动视图
  upload: false, // 上传视图
  copy: false, // 复制视图
  share: false, // 分享视图
}); // 布局

const handleCurrentChange = (val: any) => {
  paging.value.page = val;
  queryFileTotal();
  queryFileData();
};
const handleSizeChange = (val: number) => {
  paging.value.rp = val;
  queryFileData();
};
// 进入目录
const toggleFolder = (row: any) => {
  // 记录当前目录的信息
  directoryHistory.push({
    fileUuid: row.fileUuid,
    filePath: row.filePath,
  });
  // 更改当前路径
  currentPath.value = row.filePath
  // 更改当前路径的uuid
  paging.value.parentUuid = row.fileUuid
  //
  queryFileTotal()
  queryFileData()
}

const searchFile = () => {
  paging.value.page = 1;
  queryFileTotal();
  queryFileData();
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
  directoryHistory.pop();
  // 2. 如果历史记录为空，说明已经在根目录，直接返回
  if (directoryHistory.length === 0) {
    currentPath.value = '/';
    paging.value.parentUuid = '-1'
    queryFileTotal()
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
const authorities: Array<string> = JSON.stringify(sessionStorage.getItem("authorities")).split(",");
authorities.forEach((item: string) => {
  getCurrentInstance()?.appContext.config.globalProperties.$per.push(item);
});


const moveFile = () => {
  console.log(targetPath.value)
  axios.get("/moveFile",{params: {filePath:file_checked_data.value[0].filePath,targetPath:targetPath.value}}).then(res => {
    if (res.status === 200) {
      ElMessage.success("移动成功")
      refresh()
    } else {
      ElMessage.error(res.data.message)
    }
  })
}
const targetPath = ref(""); // 目标路径

const sendForm = ref({
  time: 1,
  fileUrl: "",
  fileUuid: "",
  fromEmail: sessionStorage.getItem("email"),
  descEmail: "",
})
const shareFile = () => {
console.log(sendForm)
  axios.post("/sendShare",qs.stringify({validNumber:sendForm.value.time,shareUrl:sendForm.value.fileUrl,fileUuid:sendForm.value.fileUuid,fromEmail:sendForm.value.fromEmail,userUuid:sessionStorage.getItem("userUuid"),descEmail:sendForm.value.descEmail})).then((res) => {
    ElMessage.success("分享成功");
    if (res.data.code === 200) {
      layout.value.share = false;
      getCurrentInstance()?.appContext.config.globalProperties.$message({
        message: "分享成功",
        type: "success",
      });

    } else {
      getCurrentInstance()?.appContext.config.globalProperties.$message({
        message: "分享失败",
        type: "error",
      });
    }
  })
};
const copyFile = () => {
  console.log(targetPath.value)
  axios.get("/copyFile",{params: {filePath:file_checked_data.value[0].filePath,targetPath:targetPath.value}}).then(res => {
    if (res.data.code === 200) {
      ElMessage.success("复制成功")
      refresh()
    } else {
      ElMessage.error(res.data.message)
    }
  })
}
const handleChange = (val: any) => {
  // 返回选中节点的filePath
  targetPath.value = val.filePath;
}

/**
 * 文件上传
 * @param file 文件
 */
const handleUpload = (file:any) => {
  console.log(file)
  const formData = new FormData();
  formData.append("file", file);
  formData.append("path", currentPath.value);
  fileUploadApi(formData).then((res) => {
    if (res.data.code === 200) {
      // 上传成功
      ElMessage.success("上传成功");
      refresh()

    }

  });
}


const handleDropdown = (val: any) => {

  if (val === "download") {
    // 下载
    download();
  } else if (val === "rename") {
    // 重命名
    rename();
  } else if (val === "move") {
    // 移动
    move();
  } else if (val === "copy") {
    // 复制
    copy();
  } else if (val === "share") {
    // 分享
    share();
  }
}
const download = () => {
  // 下载
  // 判断file_checked_data里面是否有type为folder的数据,如果有,则提示不能下载文件夹
  const folder = file_checked_data.value.find((item: {
      fileType: number; type: any;
  }) => item.fileType === 1);
  if (folder) {
    ElMessage.warning("不能下载文件夹");
    return;
  }
  // 如果没有,判断是否有选中的数据,如果没有,则提示请选择要下载的文件
  if (file_checked_data.value.length === 0) {
    ElMessage.warning("请选择要下载的文件");
    return;
  }
  // 如果有,判断是否有多个选中的数据,如果有,则提示只能下载一个文件
  if (file_checked_data.value.length > 1) {
    ElMessage.warning("只能下载一个文件");
    return;
  }
  // 如果只有一个,则下载

  const { filePath: nodePath } = file_checked_data.value[0]; // 当前节点的路径
  console.log('下载文件的路径',file_checked_data.value[0])
  window.location.href = `/api/download?filePath=${nodePath}`;

}

const deleteFile = () => {
  const folder = file_checked_data.value.find((item: {
    fileType: number; type: any;
  }) => item.fileType === 1);

  // 判断file_checked_data里面是否有type为folder的数据,如果有,则弹出提示框，提醒是否删除
  if (folder) {
    ElMessageBox.confirm("是否删除文件夹", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      // 删除文件夹
      const { filename: nodePath } = folder; // 当前节点的路径
      // folderName等于currentPath.value + "/" + folder.name
      // 如果是根目录,则folderName等于folder.name
      const filePath = currentPath.value === "/" ? nodePath : currentPath.value + "/" + nodePath;
      // 结尾加上/ 代表是文件夹
      const folderName = filePath + "/";

      fileDeleteToRecycleApi(folderName).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success("删除成功");
          refresh();
        }
      });
    }).catch(() => {
      ElMessage.info("已取消删除");
    });
    return;
  }

  // 如果是文件，则弹出删除文件的确认框
  ElMessageBox.confirm("此操作将删除该文件到回收站, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 删除文件
      const { filePath: nodePath } = file_checked_data.value[0]; // 当前节点的路径
      // 去除开头的/，如果没有/，则不去除
      const filePath = nodePath.replace(/^\//, "");
      fileDeleteToRecycleApi(filePath).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success("删除成功");
          refresh();
        } else {
          ElMessage.error(res.data.message);
        }
      });
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });

}

const rename = () => {
  // 重命名
  if (file_checked_data.value === null || file_checked_data.value === undefined) {
    ElMessage.warning("请选择要重命名的文件");
    return;
  }
  const number = file_checked_data.value.length;
  if (number > 1) {
    ElMessage.warning("只能重命名一个文件或者文件夹");
    return;
  }
  ElMessageBox.prompt("请输入新的文件名", "重命名", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.]+$/,
    inputErrorMessage: "文件名只能包含中文、英文、数字和下划线",
  })
    .then(({ value }) => {
      console.log("value", value);
      console.log("file_checked_data.value", file_checked_data.value[0].filePath  );
      axios.put("/rename", qs.stringify({name: value ,filePath:file_checked_data.value[0].filePath})).then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          // 重命名成功
          ElMessage.success("重命名成功");
          refresh();
        } else {
          ElMessage.error(res.data.message);
        }
      });
    })
    .catch(() => {
      ElMessage.info("已取消重命名");
    });
}
const previewFile = (row:any) => {
  // 如果是文件,则预览文件
  if (row.fileType === 0) {
    // 如果有row.filePath第一个字符是/,则去掉
    const path = row.filePath[0] === "/" ? row.filePath.substring(1) : row.filePath;

    //如果是pdf文件,则直接预览
    if (row.fileType === 0 && row.filename.endsWith(".pdf")) {
      window.open(`/preview?filePath=${path}`);
      return;
    }
    if (row.fileType === 0 && row.filename.endsWith(".md")) {
      window.open(`/preview?filePath=${path}`);
      return;
    }
    filePreviewApi(path).then((res) => {
      const type = res.config.params.path
        .substring(res.config.params.path.lastIndexOf(".") + 1)
        .toLowerCase();
      console.log(res)
      previewContent.value.type = type;
      previewContent.value.content = res.data;

      showPreview.value = true;
    });
  }
};

const move = () => {
  if (file_checked_data.value === undefined) {
    ElMessage.warning("请选择要移动的文件");
    return;
  }
  // 判断是否是文件夹
  if (file_checked_data.value[0].fileType === 1) {
    ElMessage.error("暂时不能移动文件夹");
    return;
  }
  if (useUpload.value) {
    layout.value.move = true;
    emit("closeFade");
  } else {
    emit("showUpload");
  }
}

const copy = () => {
  if (file_checked_data.value === null || file_checked_data.value === undefined) {
    ElMessage.warning("请选择要复制的文件");
    return;
  }
  // 判断是否是文件夹
  if (file_checked_data.value[0].fileType === 1) {
    ElMessage.error("暂时不能复制文件夹");
    return;
  }
  if (useUpload.value) {
    layout.value.copy = true;
    emit("closeFade");
  } else {
    emit("showUpload");
  }
}

const fileName = ref("");
const fileUrl = ref("");
const share = () => {
  //分享
  //判断是否是文件夹
  if (file_checked_data.value[0].fileType === 1) {
    ElMessage.error("暂时不能分享文件夹");
    return;
  }
  // 判断选中的个数
  if (file_checked_data.value.length > 1) {
    ElMessage.error("暂时只能分享一个文件");
    return;
  }
  const filePath = file_checked_data.value[0].filePath;
  axios.get("/getFileUrl",{params:{filePath}}).then((res) => {
    console.log('地址',res)
    fileName.value = file_checked_data.value[0].filename;
    fileUrl.value = res.data;
    sendForm.value.fileUrl = res.data
    sendForm.value.fileUuid = file_checked_data.value[0].fileUuid
    showShare.value = true;

  });

  if (useUpload.value) {
    layout.value.share = true;
    emit("closeFade");
  } else {
    emit("showUpload");
  }

}

const closePreview = () => {
  showPreview.value = false;
  showPreviewMarkdown.value = false;
  previewContent.value = {
    type: "",
    content: "",
  };
};

const p = computed(() => {
  const history = currentPath.value.split("/").slice(0)
  // 去除最后一个空字符串
  history.pop()
  return history;
});

// 回到根目录
const backOriginPath = () => {
  // 返回根目录
  currentPath.value = "/";
  // 重新请求数据
  paging.value.parentUuid = "-1";
  // 清空历史记录
  directoryHistory = []
  queryFileData();

};
// 文件同步
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

// 获取文件列表
onMounted(() => {
  queryFileTotal();
  queryFileData();
});


const handleFolder = () => {
  // 弹出新建文件夹的弹窗
  ElMessageBox.prompt("请输入文件夹名称", "新建文件夹", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
    inputErrorMessage: "文件夹名称只能包含中文、英文、数字和下划线",
  })
    .then(({ value }) => {
      // 新建文件夹
      // 当前路径拼接新建文件夹的名字
      // 如果是根目录，就不需要拼接/
      const folderName = currentPath.value === "/" ? value : (currentPath.value + value)
      fileCreateApi(folderName).then((res) => {
        if (res.data.code === 200) {
          // 新建文件夹成功
          ElMessage.success("新建文件夹成功");
          // 文件同步完成后，刷新页面
          asyncFileApi().then((res) => {
            if (res.status === 200) {
              ElMessage.success(res.data);
              // 刷新页面
              refresh();
            } else {
              ElMessage.error(res.data);
            }
          });
        }
      });
    })
    .catch(() => {
      ElMessage.info("已取消新建文件夹");
    });

};

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
  } else if (["txt","sql","md"].includes(_suffix)) {
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

const emit = defineEmits(["showUpload","upload","closeFade"]);
const showUpload = () => {
  if (useUpload.value) {
    layout.value.upload = true;
    emit("closeFade");
  } else {
    emit("showUpload");
  }
};

const filrChecked = (val: string[] | any[]) => {
  console.log('val',val)
  file_checked_data.value = val;
}

const paging = ref({
  page: 1,
  rp: 10,
  fileName: "",
  parentUuid: "-1",

})
const total = ref(0);
const queryFileData = () => {
  // q: 为什么参数要用stringfy()? 因为axios会自动将对象转换为json字符串
  // 但是如果参数是数组，会将数组转换为json字符串，而不是数组
  axios.post("/queryFileInfoList",qs.stringify(paging.value)).then((res) => {
    console.log('FileManager',res)
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

  axios.get("/getFileInfo").then((res) => {
    //按照文件夹在前，文件在后的顺序排序self_data.value.fileType 0文件 1文件夹
    res.data.data.sort((a:any,b:any) => {
      return b.fileType - a.fileType
    })

    const res1 = buildFileTree(res.data.data);
    treeData.value = res1
    setC(treeData.value)
    // 递归判断有children的length大的排在前，小的排在后
    setDisabled(treeData.value)

  })
}

// 查询总数
const queryFileTotal = () => {
  axios.post("/queryFileInfoTotal",qs.stringify(paging.value)).then((res) => {
    console.log(res.data.data)
    total.value = res.data.data;
  })
}
// 递归判断有children的length大的排在前，小的排在后

const setC = (data:any) => {
  data.forEach((item:any) => {
    if(item.children){
      item.children.sort((a:any,b:any) => {
        return b.children.length - a.children.length
      })
      setC(item.children)
    }
  })
}
// 递归设置disabled
// q:为什么要设置disabled
// a:因为el-tree的节点是根据children的length来判断是否有子节点的，如果没有子节点，那么就不会有展开的按钮，但是我们的文件夹是可以上传文件的，所以需要设置disabled为false
const setDisabled = (data:any) => {
  data.forEach((item:any) => {
    if(item.fileType == 0){
      item.disabled = true
    }
    if(item.children){
      setDisabled(item.children)
    }
  })
}

interface FileNode {
  fileUuid: string;
  filename: string;
  fileType: number;
  fileCapacity: number;
  filePath: string;
  modtime: string;
  parentUuid: string;
  remarks: string;
  userUuid: string;
  disabled?: boolean;
  children?: FileNode[];
}
function buildFileTree(files: FileNode[]): FileNode[] {
  // 1. 找到根节点
  const roots = files.filter((file) => file.parentUuid === "-1");
  // 2. 找到子节点
  const children = files.filter((file) => file.parentUuid !== "-1");
  // 3. 递归
  const findChildren = (roots: FileNode[]) => {
    roots.forEach((root) => {
      root.children = children.filter(
        (child) => child.parentUuid === root.fileUuid
      );
      findChildren(root.children || []);
    });
  };
  findChildren(roots);
  return roots;
}

</script>




<style scoped lang="scss">
@import "../assets/css/index.css";
@import "../assets/css/clear.css";
@import "../assets/icons/iconfont.css";

</style>


