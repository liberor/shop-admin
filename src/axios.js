import axios from "axios";
import { ElNotification } from 'element-plus'
import { useCookies } from '@vueuse/integrations/useCookies'
import {router} from "@/router";
import useLoginStore from "@/store/useLoginStore"
const service = axios.create({
    baseURL : "/api"
})
const cookie = useCookies()
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = cookie.get("admin-token")
    if (token){
        config.headers["token"] = token
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.request.responseType == "blob" ? response.data : response.data.data;
  }, function (err) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const msg = err.response.data.msg || "bad request"
    if(msg == "非法token，请先登录！"){
      const LoginStore = useLoginStore()
      cookie.remove("admin-token")
      LoginStore.set_user_info({})
      router.push("/login")
    }
    ElNotification({
        message: msg,
        type: 'error',
        duration: 3000,
        offset : 100,
        dangerouslyUseHTMLString:true
    })
    return Promise.reject(err);
  });
export default service