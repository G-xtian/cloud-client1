<template>
  <div class="sidebar">
    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :collapse="isCollapse" @select="handleSelect">
      <el-menu-item index="/home">首页</el-menu-item>
      <el-menu-item index="/files">文件</el-menu-item>
      <el-menu-item index="/settings">设置</el-menu-item>
    </el-menu>
  </div>
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const router = useRouter();
    const isCollapse = ref(false);

    function handleSelect(index: string) {
      router.push(index);
    }

    return {
      isCollapse,
      handleSelect,
    };
  },
});
</script>

<style scoped>
.sidebar {
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>