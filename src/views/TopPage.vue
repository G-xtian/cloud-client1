<template class="html">
  <div class="tr">
    <div class="class-img">
      <img class="class-icon" alt="logo" src="../assets/logo_zh.png" />

    </div>

    <el-dropdown class="class-dropdown">
        <div class="info">
          <span class="el-dropdown-link">
          <el-icon class="el-icon--right">
              <UserFilled />
          </el-icon>
          {{ username }}
          </span>
        </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>{{ $t("login.modifyPassword") }}</el-dropdown-item>
          <el-dropdown-item>{{ $t("login.personInfo") }}</el-dropdown-item>
          <el-dropdown-item @click="logout">{{ $t("login.logout") }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup lang="ts">
import { UserFilled } from "@element-plus/icons";
import {useRouter} from "vue-router"
import {useI18n} from "vue-i18n";
const {locale} = useI18n();
const router = useRouter();

const username = sessionStorage.getItem('username')

const logout = () => {
  sessionStorage.removeItem('username')
  router.push('/login')
}
</script>
<style scoped>
.html{
  height: 100%;
  margin: 0;
  padding: 0;
}
.tr {
  width: 100%;
  height: 40px;
  /* flex-basis: 50px; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: #b0b0b4 solid 1px;
}
.class-img{

}
.class-icon{
  height: 60px;
  width: 115px;
  margin-top: -10px;
  margin-left: 20px;
}
.class-dropdown{
  flex-basis: 200px;
  margin-top: 5px;
}
.el-dropdown-link{
}
.info{
  height: 100%;
  display: flex;
  align-content: center;
  align-items: center;
}
</style>