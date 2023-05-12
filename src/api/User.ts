import axios from "../axios";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const loginApi =(userName:string, password:string, captcha?:string, showCaptcha: boolean) => axios.post('/login',{
    userName,
    password,
    captcha,
    showCaptcha
})

/**
 * @description: 发送验证码
 */
export const sendCodeApi = (phone : string) => axios.get('/sendCode', {
    params: {
        phone
    }

})

/**
 * @description: 验证验证码
 */
export const verifyCodeApi = (phone : string, code : string) => axios.get('/checkCode', {
    params: {
        phone,
        code
    }
})

/**
 * @description: 注册
 */
export const registerApi = (userName : string, password:string, mobile : string,email:string) => axios.post('/register', {
    userName,
    password,
    mobile,
    email
})

// 获取验证码
export const createCodeApi = () => axios.get('/getCode', {
    responseType: 'arraybuffer'
})
