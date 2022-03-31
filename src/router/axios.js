import axios from "axios";
import { Toast } from "mint-ui"; // 我用的mint的框架来弹出我的错误返回 大家可以用别的提示（移动端的组件库）
import router from "@/router/index.js";

// 默认超时设置
axios.defaults.timeout = 5000;

// 相对路径设置
axios.defaults.baseURL = "";

//http request 拦截器
axios.interceptors.request.use(
  (config) => {
    // 获取token
    const token = localStorage.getItem("cc_token");
    // 设置参数格式
    if (!config.headers["Content-Type"]) {
      config.headers = {
        "Content-Type": "application/json",
        // application/x-www-form-urlencoded
      };
    }
    // 添加token到headers
    if (token) {
      config.headers.token = token;
    }
    // 鉴权参数设置
    if (config.method === "get") {
      //get请求下 参数在params中，其他请求在data中
      config.params = config.params || {};
      let json = JSON.parse(JSON.stringify(config.params));
      //一些参数处理
    } else {
      config.data = config.data || {};
      //一些参数处理
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

//http response 拦截器
axios.interceptors.response.use(
  (response) => {
    //一些统一code的返回处理
    if (response.data.code === 501) {
      // 登录验证
      //做了个示例跳转项目中登录，并记录下相对路径
      router.push({
        name: "login", //从哪个页面跳转
        query: {
          retUrl: window.location.href.split("#")[1] || "",
          is_new_user_url: 1,
        },
      });
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios