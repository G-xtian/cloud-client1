<template>
  <div class="flex flex-wrap min-h-screen w-full content-center justify-center bg-gray-200 py-10">
    <div class="flex shadow-md">
      <div class="flex flex-wrap content-center justify-center rounded-l-md bg-white" style="width: 32rem; height: 36rem;">
        <div class="w-72">
          <h1 class="text-xl font-semibold">注册</h1>
            <form class="w-96" @submit.prevent="register">

              <div class="mt-4">
                <div class="mb-3">
                  <label class="mb-2 block text-xs font-semibold" for="username">
                    用户名
                  </label>
                  <input
                      class="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                      id="userName" type="text" v-model="userName" placeholder="请输入用户名">
                </div>
                <div class="mb-3">
                  <label class="block text-gray-700 font-bold mb-2" for="email">
                    邮箱
                  </label>
                  <input
                      class="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                    id="email" type="text" v-model="email" placeholder="请输入邮箱">
                </div>
                <div class="mb-3">
                  <label class="block text-gray-700 font-bold mb-2" for="password">
                    密码
                  </label>
                  <input
                      class="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                    id="password" type="password" v-model="password" placeholder="请输入密码">
                </div>
                <div class="mb-3">
                  <label class="block text-gray-700 font-bold mb-2" for="confirmPassword">
                    确认密码
                  </label>
                  <input
                      class="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                    id="confirmPassword" type="password" v-model="confirmPassword" placeholder="请输入确认密码">
                </div>
                <div class="mb-3">
                  <label class="block text-gray-700 font-bold mb-2" for="mobile">
                    手机号码
                  </label>
                  <input
                      class="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                    id="mobile" type="text" v-model="mobile" placeholder="请输入手机号码">
                </div>
                <div class="mb-3">
                  <label class="block text-gray-700 font-bold mb-2" for="code">
                    验证码
                  </label>
                  <div class="flex">
                    <input
                        class="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                      id="code" type="text" v-model="code" placeholder="请输入验证码">
                    <button
                        class="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                      @click.prevent="sendCode" :disabled="isCounting">{{ buttonText }}
                    </button>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <button
                      class="mb-1.5 block w-full text-center text-white bg-purple-700 hover:bg-purple-900 px-2 py-1.5 rounded-md"
                    >
                    注册
                  </button>
                </div>
                <div class="text-center">
                  <span class="text-xs text-gray-400 font-semibold">已有帐号？</span>
                  <button class="text-xs font-semibold text-purple-700" @click.prevent="register1">登录</button>
                </div>

              </div>
            </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { registerApi, sendCodeApi, verifyCodeApi } from "../api/User";
import { ElMessage } from "element-plus";
import router from "../router";
import {useRouter} from "vue-router";

const router1 = useRouter();
const email = ref("");
const userName = ref("");
const password = ref("");
const confirmPassword = ref("");
const mobile = ref("");
const code = ref("");
const isCounting = ref(false);
const countDown = ref(60);


// 输入框校验
const validate = () => {
  if (!email.value) {
    ElMessage.error("请输入邮箱");
    return false;
  }
  if (!userName.value) {
    ElMessage.error("请输入用户名");
    return false;
  }
  if (!password.value) {
    ElMessage.error("请输入密码");
    return false;
  }
  if (!confirmPassword.value) {
    ElMessage.error("请输入确认密码");
    return false;
  }
  if (password.value !== confirmPassword.value) {
    ElMessage.error("两次输入的密码不一致");
    return false;
  }
  // 手机号码校验
  if (!/^1[3456789]\d{9}$/.test(mobile.value)) {
    ElMessage.error("请输入正确的手机号码");
    return false;
  }
  //邮箱校验
  if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email.value)) {
    ElMessage.error("请输入正确的邮箱");
    return false;
  }
  return true;
};

//跳转到登录页面
const register1 = () => {
  router1.push('/login')
}

const sendCode = () => {
  if (!validate()) {
    return;
  }
  // 3. 发送验证码 后台参数为@RequestParam("phone") String memPhone
  sendCodeApi(mobile.value).then((res) => {
    if (res.data.code === 200) {
      ElMessage.success("验证码发送成功");
      isCounting.value = true;
      const timer = setInterval(() => {
        if (countDown.value <= 0) {
          isCounting.value = false;
          countDown.value = 60;
          clearInterval(timer);
        } else {
          countDown.value--;
        }
      }, 1000);
    } else {
      ElMessage.error(res.data.message);
    }
  });
  console.log("发送验证码请求");
};


const register = () => {
  // 验证验证码请求  后台参数为@RequestParam("phone") String memPhone, @RequestParam("code") String code
  // 1. 校验手机号码
  if (!/^1[3456789]\d{9}$/.test(mobile.value)) {
    ElMessage.error("请输入正确的手机号码");
    return;
  }
  // 2. 校验验证码
  if (!/^\d{6}$/.test(code.value)) {
    ElMessage.error("请输入正确的验证码");
    return;
  }
  verifyCodeApi(mobile.value, code.value).then((res) => {
    if (res.data.code === 200) {
      // 注册请求
      registerApi(userName.value, password.value, mobile.value,email.value).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success(res.data.data);
          router.push("/login");
        } else {
          ElMessage.error(res.data.data);
        }
      });
    } else {
      ElMessage.error(res.data.message);
    }
  });
};

const buttonText = computed(() => {
  if (isCounting.value) {
    return `${countDown.value}秒后重试`;
  } else {
    return "发送";
  }
});
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
.w-72[data-v-c7806062] {
  width: 23rem;
  /* margin-left: -5em; */
}
</style>
