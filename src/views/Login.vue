<template>
<!--  <div class="float-right">-->
<!--    <el-button type="text" @click="changeLanguage('zh')">中文</el-button>-->
<!--    <el-button type="text" @click="changeLanguage('en')">English</el-button>-->
<!--  </div>-->
  <div class="flex flex-wrap min-h-screen w-full content-center justify-center bg-gray-200 py-10">
    <!-- Login component -->
    <div class="flex shadow-md">
      <!-- Login form -->
      <div class="flex flex-wrap content-center justify-center rounded-l-md bg-white" style="width: 24rem; height: 32rem;">
        <div class="w-72">
          <!-- Heading -->
          <h1 class="text-xl font-semibold">{{$t('login.back')}}</h1>

          <!-- Form -->
          <form class="mt-4">
            <div class="mb-3">
              <label class="mb-2 block text-xs font-semibold">{{ $t('login.userName') }}</label>
              <input type="text" placeholder="请输入用户名" class="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500" v-model="username"/>
            </div>

            <div class="mb-3">
              <label class="mb-2 block text-xs font-semibold">{{ $t('login.password') }}</label>
              <input type="password" placeholder="请输入密码" class="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500" v-model="password"/>
            </div>

            <!--验证码-->
            <el-form-item v-show="showCaptcha">
              <el-input v-model="captcha" placeholder="验证码" clearable maxlength="4"/>
              <a href="javascript:void(0)" @click="createCode()">
                <img :src="verifitycode" style="width:100%;" alt="图片加载失败"/>
              </a>
            </el-form-item>

            <div class="mb-3 flex flex-wrap content-center">
              <input id="remember" type="checkbox" class="mr-1 checked:bg-purple-700" /> <label for="remember" class="mr-auto text-xs font-semibold">{{$t('login.remember')}}</label>
              <a href="#" class="text-xs font-semibold text-purple-700">{{$t('login.forget')}}</a>
            </div>

            <div class="mb-3">
              <button class="mb-1.5 block w-full text-center text-white bg-purple-700 hover:bg-purple-900 px-2 py-1.5 rounded-md" @click.prevent="login">{{$t('login.loginBtn')}}</button>
            </div>
          </form>



          <!-- Footer -->
          <div class="text-center">
            <span class="text-xs text-gray-400 font-semibold">{{$t('login.account')}}</span>
            <button class="text-xs font-semibold text-purple-700" @click.prevent="register">{{$t('login.register')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import {loginApi,createCodeApi} from "../api/User";
import {useRouter} from "vue-router"
import {useI18n} from "vue-i18n";
import {usePermissionsStore} from "../store";
const store = usePermissionsStore()
import {ElMessage} from "element-plus";
const {locale} = useI18n();
const router = useRouter();
const username = $ref('')
const password = $ref('')
const captcha = $ref('')
const verifitycode = ref('')
let showCaptcha = ref(false)
const errorCount = ref(0)

const login = () => {
  if (username === '') {
    ElMessage.error('用户名不能为空')
    return
  }
  if (password === '') {
    ElMessage.error('密码不能为空')
    return
  }
  if (showCaptcha.value && captcha === '') {
    ElMessage.error('验证码不能为空')
    return
  }
  loginApi(username, password, captcha,showCaptcha.value).then((res) => {
    if (res.data.code === 200) {
      ElMessage.success('登录成功')
      // 把user信息传递到topbar
      sessionStorage.setItem("authorities",res.data.data.authorities)
      sessionStorage.setItem('username', res.data.data.userName)
      sessionStorage.setItem("userUuid",res.data.data.userUuid)
      sessionStorage.setItem("email",res.data.data.email)
      router.push("/index/home")
    } else {
      // q:ElMessage是什么
      ElMessage.error(res.data.message)
      if (res.data.code === 500) {
        errorCount.value++
        if (errorCount.value >= 3) {
          nextTick(() => {
            showCaptcha.value = true;
            createCode();
          });
        }
      }
    }
  })
}


//跳转到注册页面
const register = () => {
  router.push('/register')
}

// 切换语言
const changeLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem('lang', lang)
}

const createCode = () => {
  createCodeApi().then((res) => {
    return (
      "data:image/png;base64," + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
    )
  })
      .then((res) => {
        verifitycode.value = res
      })
}

watch(() => showCaptcha.value, (val) => {
  console.log(val)
})
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>