# devops-fe

## Project setup

``` 
npm install
```

### Compiles and hot-reloads for development

``` 
npm run serve
# or "yarn serve"
# or "npx vue-cli-service serve"
# or "./startup.sh"
```

### Compiles and minifies for production

``` 
npm run build
# or "./build.sh"
```

### Run your tests

``` 
npm run test
```

### Lints and fixes files

``` 
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### TODOs
* 变量拷贝/复制；
* 全局请求loading（组件化）、全局的会话判断（拦截器）；
* 基础：样式（长期）& （vuejs & element）；
* vue事件先后顺序（onfocus & onchange）；
* 防止客户端重复点击（客户端解决方案）；
* 浏览器系统级别通知；
* 权限&页面刷新问题（响应式优化）；
* 代码重构；
* 用户体验优化；
* ...

### 系统级别的 chrome 通知
* 参考 HTML5 Notification
* 除了本地 ip（如：127.0.0.1/localhost）外，需要 https 安全认证
* 必要的话，管理 chrome 浏览器的相关设置（较低或较高版本不支持）：
```
chrome://flags/#enable-native-notifications
chrome://settings/content/notifications
```
### websocket 的处理
如果通过域名访问服务的话，那么需要处理跨域问题，建议用 nginx 代理转发 websocket 请求

### 参考
* https://socket.io/docs/
* https://element.eleme.cn/#/zh-CN/component/