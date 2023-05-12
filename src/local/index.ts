import { createI18n } from "vue-i18n";
import zh from "./zh";
import en from "./en";
import enLocale from "element-plus/lib/locale/lang/en";
import zhLocale from "element-plus/lib/locale/lang/zh-cn";

const messages = {
  zh: {
    ...zh,
    ...zhLocale
  },
  en: {
    ...en,
    ...enLocale
  }
};

// 获取浏览器语言
const navLang = (navigator.language || "en").toLocaleLowerCase();


// 语言包
const i18n = createI18n({
  locale: localStorage.getItem("lang") || navLang.split("-")[0] || "en",
  fallbackLocale: "en", // set fallback locale
  messages, // set locale messages
  legacy: false // you must specify 'legacy: false' option
});

export default i18n;