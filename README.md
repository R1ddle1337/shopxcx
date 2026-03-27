<p align="center">
  <a href="https://tdesign.tencent.com/miniprogram/overview" target="_blank">
    <img alt="TDesign Logo" width="180" src="https://tdesign.gtimg.com/site/TDesign.png">
  </a>
</p>

# 鲜蔬果园小程序

基于 `Tencent/tdesign-miniprogram-starter-retail` 改造成的果蔬店铺小程序，当前仓库已经补了一套本地真实 API，可用于小程序页面联调、商品管理、菜篮与下单链路验证。

## 技术栈

- 微信原生小程序：`JavaScript` + `WXML` + `WXSS`
- UI 组件库：`tdesign-miniprogram@1.9.5`
- 包管理：`npm`
- 代码规范：`ESLint` + `Prettier` + `Husky` + `lint-staged`
- 数据模式：小程序前端 + 本地 Node API

## 本地运行

1. `npm install`
2. 启动本地 API：`npm run api:start`
3. 使用微信开发者工具打开项目目录
4. 在开发者工具中执行“构建 npm”
5. `project.config.json` 中填入你自己的小程序 `AppID`
6. 开发者工具里关闭“校验合法域名”或把你的正式域名替换到 `config/index.js`

## 项目结构

- `pages/`：页面层，包含首页、分类、菜篮、订单、售后、个人中心
- `components/`：通用组件
- `model/`：仍保留的次级 mock 数据
- `services/`：前端服务层，主链路已切到本地 API
- `backend/src/`：本地真实 API
- `backend/data/app.json`：运行后生成的本地业务数据文件
- `assets/produce/`：果蔬主题本地插画资源
- `config/index.js`：全局配置，`realApiScopes` 控制哪些模块走真实 API

## 如何自定义商品和价格

当前主链路已经有本地后台，商品和价格优先从本地 API 读取。

可改入口：

- 本地数据文件：`backend/data/app.json`
- 商品种子：`backend/src/seed.js`
- 商品列表接口：`GET /api/admin/goods`
- 新增商品接口：`POST /api/admin/goods`
- 修改商品/价格接口：`PATCH /api/admin/goods/:spuId`

如果只是想快速改一版数据，最简单的方式是：

- 先运行一次 `npm run api:start`
- 停掉服务后修改 `backend/data/app.json`
- 重启 API 让小程序重新读取

## 后台在哪里

当前仓库已经包含一个本地真实 API，在 `backend/src/server.js`。

当前已切真实 API 的主链路：

- 商品：`services/good/*`
- 菜篮：`services/cart/cart.js`
- 用户：`services/usercenter/*`
- 订单与支付：`services/order/*`
- 地址：`services/address/*`

仍保留 mock 的次级模块：

- 评论
- 活动/促销
- 优惠券
- 售后细页

## 用户注册、下单、付款现状

### 用户注册

当前采用 **本地访客会话**，`app.js` 会给小程序写入默认用户 `u-1000`。这保证了本地下单、菜篮、地址、订单能真实落数据。

如果你要正式上线，下一步要补：

- 微信登录换 `openid`
- 手机号绑定
- 正式注册/登录接口

### 用户下单

当前链路已经能本地真实落单：

1. 首页/列表进入商品详情
2. 选择 SKU 后加入菜篮或立即购买
3. 进入结算页
4. 提交订单

结算与订单数据会写入 `backend/data/app.json`，再次打开订单页仍可看到。

### 付款

当前 **建单是真实的，本地支付仍是模拟成功**。`pages/order/order-confirm/pay.js` 里还没有接正式 `wx.requestPayment`，所以现阶段适合联调订单流，不适合直接上线收款。

如果要上线真实支付，至少需要补齐：

- 小程序登录换取用户标识
- 服务端创建订单
- 服务端生成微信支付参数
- 前端调用 `wx.requestPayment`
- 服务端处理支付回调与订单状态更新

## 开发建议

- 当前阶段适合做本地真实联调和业务开发
- 如果要正式商用，下一步优先补正式登录、正式支付、HTTPS 域名和商家后台 UI
- 不要把 `AppID`、密钥、商户号等敏感配置提交到 GitHub
