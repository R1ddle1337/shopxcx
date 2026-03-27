<p align="center">
  <a href="https://tdesign.tencent.com/miniprogram/overview" target="_blank">
    <img alt="TDesign Logo" width="180" src="https://tdesign.gtimg.com/site/TDesign.png">
  </a>
</p>

# 鲜蔬果园小程序

基于 `Tencent/tdesign-miniprogram-starter-retail` 改造成的果蔬店铺小程序示例，当前仓库用于前端页面演示、交互联调和本地 mock 数据验证。

## 技术栈

- 微信原生小程序：`JavaScript` + `WXML` + `WXSS`
- UI 组件库：`tdesign-miniprogram@1.9.5`
- 包管理：`npm`
- 代码规范：`ESLint` + `Prettier` + `Husky` + `lint-staged`
- 数据模式：前端 `services/*` + `model/*` 本地 mock

## 本地运行

1. `npm install`
2. 使用微信开发者工具打开项目目录
3. 在开发者工具中执行“构建 npm”
4. `project.config.json` 中填入你自己的小程序 `AppID`

## 项目结构

- `pages/`：页面层，包含首页、分类、菜篮、订单、售后、个人中心
- `components/`：通用组件
- `model/`：本地 mock 数据源
- `services/`：数据获取与提交入口，当前默认走 mock
- `assets/produce/`：果蔬主题本地插画资源
- `config/index.js`：全局配置，`useMock: true` 表示启用本地模拟数据

## 如何自定义商品和价格

当前没有后台管理系统，商品和价格直接维护在前端 mock 中：

- 商品详情与 SKU：`model/good.js`
- 商品列表：`model/goods.js`
- 分类：`model/category.js`
- 搜索词与搜索结果：`model/search.js`
- 菜篮示例：`model/cart.js`

修改方式：

- 新增商品：在 `model/good.js` 的 `allGoods` 数组新增一项
- 改价格：修改商品的 `minSalePrice`、`maxSalePrice`，以及各 SKU 的 `salePrice` / `linePrice`
- 改库存：修改 SKU 的 `stockQuantity`

## 后台在哪里

当前仓库 **不包含真实后台**。`services/*` 里大多数方法会在 `config.useMock === true` 时读取 `model/*` 的本地数据；关闭 mock 后，现状只会返回占位值 `real api`，还没有真正的服务端实现。

如果要接入正式后台，优先改这些入口：

- 商品：`services/good/*`
- 菜篮：`services/cart/cart.js`
- 用户：`services/usercenter/*`
- 订单与支付：`services/order/*`

## 用户注册、下单、付款现状

### 用户注册

当前 **没有注册系统**。用户信息来自 `model/usercenter.js` 的 mock 数据，仅用于页面展示。

### 用户下单

当前链路是可演示的：

1. 首页/列表进入商品详情
2. 选择 SKU 后加入菜篮或立即购买
3. 进入结算页
4. 提交订单

结算与订单数据来自：

- `services/order/orderConfirm.js`
- `model/order/orderConfirm.js`
- `model/order/mockData.js`

### 付款

当前 **不是真实微信支付**。`pages/order/order-confirm/pay.js` 中的 `wechatPayOrder()` 会直接走支付成功分支，用来演示支付结果页与订单流转。

如果要上线真实支付，至少需要补齐：

- 小程序登录换取用户标识
- 服务端创建订单
- 服务端生成微信支付参数
- 前端调用 `wx.requestPayment`
- 服务端处理支付回调与订单状态更新

## 开发建议

- 做演示版：继续维护 `model/*` 即可
- 做可运营版本：先补服务端和管理后台，再把 `services/*` 从 mock 切到真实 API
- 不要把 `AppID`、密钥、商户号等敏感配置提交到 GitHub
