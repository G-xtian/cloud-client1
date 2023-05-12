<template>
  <!--     <div class="container">-->
  <nav class="td">
    <el-menu
      active-text-color="#ffd04b"
      class="el-menu-vertical-demo"
      default-active="1"
      text-color="#000"
      router
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon>
            <Suitcase />
          </el-icon>
          <a><span>{{ $t("menu.serviceManager") }}</span></a>
        </template>
          <el-menu-item index="/index/FilePage">
            <el-icon>
              <Goods />
            </el-icon>
            <span>{{ $t("menu.fileAll") }}</span>
          </el-menu-item>
          <el-menu-item index="/index/RecyclePage">
            <el-icon>
              <Basketball />
            </el-icon>
            <span>{{ $t("menu.recyle") }}</span>
          </el-menu-item>
          <el-menu-item index="/index/share">
            <el-icon>
              <Help />
            </el-icon>
            <span>{{ $t("menu.myShare") }}</span>
          </el-menu-item>
<!--          <el-menu-item index="/index/receive">-->
<!--            <el-icon>-->
<!--              <Calendar />-->
<!--            </el-icon>-->
<!--            <span>{{ $t("menu.receiveShare") }}</span>-->
<!--          </el-menu-item>-->
          <el-menu-item index="/index/collection">
            <el-icon>
              <OfficeBuilding />
            </el-icon>
            <span>{{ $t("menu.myCollection") }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <Suitcase />
            </el-icon>
            <a><span>资源宝库</span></a>
          </template>
            <el-menu-item index="/index/FileSharing">
              <el-icon>
                <Goods />
              </el-icon>
              <span>共享资源</span>
            </el-menu-item>
            <el-menu-item index="/index/search">
              <el-icon>
                <Basketball />
              </el-icon>
              <span>搜索资源</span>
            </el-menu-item>
          </el-sub-menu>
    </el-menu>
    <!-- <RouterLink class="btn" to="/index/FilePage">文件管理</RouterLink> -->
  </nav>
  <RouterView></RouterView>
  <!--     </div>-->
</template>
<script setup lang="ts">
import {Suitcase, Document, Goods, Basketball, Help, Calendar, OfficeBuilding} from "@element-plus/icons";
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: aliceblue;
}

.tr {
  width: 200px;
  flex-basis: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: beige;
  align-items: center;
}

.second {
  background-color: aqua;
}

.td {
  display: flex;
  flex-basis: 100px;
  flex-direction: column;

}
</style>


