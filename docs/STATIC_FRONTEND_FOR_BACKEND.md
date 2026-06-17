# Blockscout 新前端静态化接入说明

## 背景结论

`blockscout/blockscout` 和 `blockscout/frontend` 是同源生态，但不是同一个前端形态。

`blockscout/blockscout` 是 Blockscout 的后端/indexer/Phoenix 应用，历史上包含旧 UI。

`blockscout/frontend` 是后来拆出来的新前端，官方默认部署方式是单独运行一个 Next.js 前端服务，然后连接 Blockscout 后端 API。

也就是说，官方默认结构是：

```text
浏览器 -> Next.js frontend 服务 -> Blockscout backend API
```

如果我们的诉求是服务器上绝对不再额外运行 Node/Next 进程，那么需要把 `blockscout/frontend` 改造成类似 Vue/Vite 项目的纯静态前端：

```text
浏览器 -> 静态前端文件 -> Blockscout backend API
```

这种方式可行，但不是简单把当前 Next 项目 build 后扔给后端即可。前端需要去掉 SSR/API routes 依赖，后端需要接管静态资源托管和前端路由 fallback。

## 后端需要承担的职责

后端需要把自己变成：

```text
API 服务 + 静态文件服务器 + 前端路由兜底器
```

推荐路由分流规则：

```text
/api/*               -> Blockscout 后端 API
/socket/*            -> Blockscout 后端 websocket
/auth/*              -> Blockscout 后端认证
真实存在的静态资源      -> 直接返回静态文件
其它页面路径           -> 返回新版前端 index.html
```

例如这些页面路径都应该返回新版前端入口文件：

```text
/tx/0x...
/address/0x...
/block/123456
/token/0x...
/accounts
/verified-contracts
```

浏览器拿到 `index.html` 后，由前端应用根据当前 URL 渲染对应页面，再请求后端 API 获取数据。

## 什么是静态前端路由 fallback

纯前端应用里，很多页面路径并不对应真实文件。

例如用户访问：

```text
/tx/0xabc123
```

服务器上通常并不存在：

```text
/tx/0xabc123.html
```

如果服务器按静态文件查找，会返回 404。

所以需要 fallback：

```text
如果请求的静态文件存在，返回静态文件；
如果不存在，并且不是 API/socket/auth 请求，就返回 index.html。
```

Nginx 中常见配置类似：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

如果由 Phoenix 后端实现，概念上就是在页面路由最后加一个 catch-all：

```elixir
get "/*path", FrontendController, :index
```

`FrontendController.index` 返回新版前端的 `index.html`。

注意：这只是概念示例，真实实现需要结合 Blockscout 当前 router、Plug.Static、旧 UI 路由和 API 路由顺序调整。

## Blockscout 后端是否天然支持

不能直接认为天然支持。

`blockscout/blockscout` 后端本身确实可能已经有这些路径：

```text
/tx/:hash
/address/:hash
/block/:height
```

但这些通常是旧 UI 页面路由，不等于新版 `blockscout/frontend` 静态前端路由。

如果旧 UI 路由还在，用户访问：

```text
/tx/0xabc
```

后端可能会返回旧 UI 页面，而不是新版前端的 `index.html`。

所以后端需要明确处理旧 UI 和新版前端的优先级：

```text
API/socket/auth 优先走后端；
静态资源优先返回真实文件；
新版前端页面 fallback 要接管 /tx、/address、/block 等页面路径；
旧 UI 页面路由需要禁用、下沉，或避免抢占新版前端路径。
```

## 后端具体要做什么

### 1. 托管新版前端静态产物

前端静态构建产物可以放到后端镜像或部署目录中，例如：

```text
priv/static/frontend/
```

目录中可能包含：

```text
index.html
envs.js
assets/*
_next/static/*
favicon.ico
```

具体目录结构取决于前端最终采用 Next 静态导出、Vite，还是其它构建方式。

### 2. 保留后端 API 路由

这些路径不能 fallback 到 `index.html`：

```text
/api
/socket
/auth
```

否则前端请求 API 时会拿到 HTML，浏览器里会出现 JSON 解析失败、接口 200 但内容是 HTML 等问题。

### 3. 添加页面兜底路由

对于非 API、非 websocket、非认证、非真实静态资源的请求，返回新版前端 `index.html`。

这保证用户直接刷新下面这些页面时不会 404：

```text
/tx/0x...
/address/0x...
/block/123
/token/0x...
```

### 4. 处理旧 UI 路由冲突

这是最关键的点。

Blockscout 后端原本可能已经有旧 UI 页面路由。如果不处理，新版静态前端接不到页面路径。

需要确认：

```text
/tx/*
/address/*
/block/*
/token/*
```

这些路径最终返回的是新版前端 `index.html`，而不是旧 UI HTML。

### 5. 同源部署，减少 CORS 问题

推荐最终对外表现为同一个域名：

```text
https://explorer.example.com/          -> 新版前端页面
https://explorer.example.com/api/...   -> Blockscout 后端 API
https://explorer.example.com/socket    -> Blockscout websocket
```

这样浏览器视角是同源，CORS、cookie、认证相关问题会少很多。

## 前端也需要配合改造

后端托管静态文件只是部署层面的工作。当前 `blockscout/frontend` 仍然是 Next.js 服务型前端，前端也需要改造。

主要包括：

```text
移除 getServerSideProps / getInitialProps 依赖；
移除或替换 pages/api/*；
关闭 /node-api/proxy，改成浏览器直接请求后端 API；
把运行时环境变量改成 envs.js / window.__envs；
处理动态路由刷新；
确认前端 bundle 能在 /tx/:hash、/address/:hash 等路径下正常启动。
```

当前项目里需要重点关注：

```text
nextjs/getServerSideProps/*
pages/api/*
lib/api/buildUrl.ts
lib/api/isNeedProxy.ts
configs/app/utils.ts
pages/_app.tsx
next.config.js
```

## 容易踩坑的地方

### 1. API 被 fallback 到 index.html

现象：

```text
接口状态码是 200，但返回内容是 HTML；
前端报 JSON parse error；
Network 里看到 /api/... 返回了 index.html。
```

原因：

```text
fallback 规则太宽，把 /api 也兜底到了前端页面。
```

解决：

```text
/api、/socket、/auth 必须在 fallback 之前优先匹配后端。
```

### 2. 旧 UI 抢走新版前端路由

现象：

```text
/tx/0x... 打开的是旧页面；
/address/0x... 打开的是旧页面；
首页可能是新版，但详情页变成旧版。
```

原因：

```text
Blockscout 后端旧 UI 页面路由优先级高于新版前端 fallback。
```

解决：

```text
禁用旧 UI 页面路由，或让新版前端 fallback 接管页面路径。
```

### 3. 静态资源也被 fallback

现象：

```text
JS/CSS 加载失败；
浏览器报 MIME type 错误；
请求 .js 文件返回了 text/html。
```

原因：

```text
静态资源路径没有优先按真实文件返回。
```

解决：

```text
先匹配真实静态文件，再做 index.html fallback。
```

### 4. 前端还在请求 /node-api/proxy

现象：

```text
/node-api/proxy/... 404；
接口请求没有到真正后端 API。
```

原因：

```text
前端仍开启 NEXT_PUBLIC_USE_NEXT_JS_PROXY。
```

解决：

```text
纯静态部署下应关闭 Next proxy，让浏览器直接请求后端 API，或由后端/Nginx 实现等价 proxy。
```

### 5. 动态页面刷新 404

现象：

```text
从首页点进交易页正常；
刷新 /tx/0x... 后 404。
```

原因：

```text
没有页面 fallback。
```

解决：

```text
非 API、非静态资源路径返回 index.html。
```

### 6. 环境变量仍依赖 Node 运行时

现象：

```text
静态部署后配置不生效；
换环境必须重新构建；
浏览器里 API 地址为空或错误。
```

原因：

```text
原本依赖 Next/Node 的 process.env。
```

解决：

```text
使用 envs.js 或 config.json 在运行时注入 window.__envs。
```

## 建议的落地顺序

建议先做 POC，不要直接全量迁移。

第一阶段只验证核心链路：

```text
首页 /
交易详情 /tx/:hash
地址详情 /address/:hash
区块详情 /block/:height
```

验证目标：

```text
页面可直接访问；
刷新页面不 404；
前端可以请求后端 API；
API 没有 CORS 问题；
旧 UI 不会抢路由；
静态资源 MIME type 正常；
生产环境不需要启动 Node/Next 进程。
```

POC 跑通后，再铺开到其它页面和功能。

## 总结

如果目标是：

```text
页面能打开；
前端请求后端 API；
浏览器里正常查区块、交易、地址；
服务器上不额外运行 Node/Next 进程。
```

那么方案是可行的。

但它需要前后端共同改造：

```text
前端：从 Next SSR 服务型应用改成静态前端应用；
后端：托管静态文件，并为页面路径提供 index.html fallback；
后端：保留 /api、/socket、/auth 等服务端路径；
后端：避免旧 UI 路由抢占新版前端页面路径。
```

关键不是两个项目是否同源，而是新版前端当前不是后端内置旧 UI。要不跑 Node/Next，就必须明确实现静态托管和路由兜底。
