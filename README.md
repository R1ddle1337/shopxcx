# 鲜蔬果园小程序

这是一个基于微信原生小程序改造的果蔬店项目，前端负责商品浏览、菜篮、下单和用户中心，仓库内自带一个本地 Node API 供联调和数据维护。

## 技术栈

- 小程序前端：`JavaScript` + `WXML` + `WXSS`
- UI 组件：`tdesign-miniprogram`
- 本地后端：`Node.js http`
- 代码规范：`ESLint` + `Prettier` + `Husky`

## 项目结构

- `pages/`：首页、分类、商品、菜篮、订单、用户中心
- `components/`：通用业务组件
- `services/`：前端请求层
- `model/`：保留的 mock 数据
- `backend/src/`：本地 API 与种子数据
- `backend/data/app.json`：运行后生成的实际业务数据
- `config/index.js`：接口地址、mock 开关、真实接口作用域

## 本地开发

```bash
npm install
npm run api:start
```

然后用微信开发者工具打开项目目录，执行“构建 npm”，再编译小程序。

`config/index.js` 当前将 `goods`、`cart`、`usercenter`、`order`、`address` 设为真实接口。首页之前加载不出来，不是页面坏了，而是这些模块依赖的本地 API 没启动或不可达。现在商品相关页面已加自动回退 mock，但要完整联调下单流程，仍建议先启动本地 API。

## 商品与价格维护

最直接的维护方式：

- 先执行一次 `npm run api:start`
- 修改 `backend/data/app.json`
- 重启本地 API

初始化种子数据在 `backend/src/seed.js`。如需做后台管理，可继续接 `GET/POST/PATCH /api/admin/goods`。

## 部署流程

1. 在本机 `project.config.json` 填入你自己的小程序 `AppID`，不要提交到 GitHub。
2. 将 `backend/src/server.js` 部署到你自己的服务器，改成正式域名和持久化存储。
3. 把 `config/index.js` 中的 `apiBaseUrl` 改为正式 `HTTPS` 接口地址。
4. 在微信公众平台配置“request 合法域名”，确保和正式接口域名一致。
5. 在微信开发者工具重新编译、上传代码，提交审核并发布。
6. 若要正式收款，还需要补齐微信登录、商户号、统一下单、`wx.requestPayment`、支付回调。

## 注意事项

- `AppID`、密钥、商户号不要提交到仓库。
- 需要重置本地数据时可执行 `npm run api:start:reset`。
- 当前仓库适合开发和联调，真正商用前仍要补齐正式登录、支付和后台管理。
