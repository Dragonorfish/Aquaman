# Aquaman

本项目已经部署至 [Vercel](vercel.com)。预览地址 [mapnode.cn](mapnode.cn)及[cnaquaman.com](cnaquaman.com)

部分测试数据已经加载到 [Supbase](https://supabase.com/) （云数据库服务平台）。使用参见 `spatial-analysis` 分支中的 `src/util/supbase.js` 及其相关代码。

## 开发指南

**提交代码之前请使用 Prettier 格式化代码。**

### 安装依赖

```sh
# 使用 pnpm
pnpm install
# 使用 yarn
yarn install
```

### 启动开发环境 localhost:5173

```sh
# 使用 pnpm
pnpm dev
# 使用 yarn
yarn dev
```

### 打包发布环境 /dist

```sh
# 使用 pnpm
pnpm buiid
# 使用 yarn
yarn build
```

### 使用 [Prettier](https://prettier.io) 格式化代码

```sh
# 使用 pnpm
pnpm prettier --write .
# 使用 yarn
yarn prettier --write .
```

### 运行 [Vitest](https://vitest.dev/) 单元测试

```sh
# 使用 pnpm
pnpm test:unit
# 使用 yarn
yarn test:unit
```

### 使用 [ESLint](https://eslint.org/) 检查代码

```sh
# 使用 pnpm
pnpm lint
# 使用 yarn
yarn lint
```

## [VSCode](https://code.visualstudio.com/) 开发插件配置

1. [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并且关闭 Vetur)
2. [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## 依赖项目文档

### Vite 文档

[Vite 中文文档](https://cn.vitejs.dev)

### Vue 文档

[Vue 中文文档](https://cn.vuejs.org)

### Element Plus 文档

[Element Plus 中文文档](https://element-plus.gitee.io/zh-CN/)

### rxjs 文档

[rxjs 中文文档](https://cn.rx.js.org/)

### DataV 文档

[DataV Vue3+TS+Vite 版 中文文档](https://datav-vue3.netlify.app/guide/)

### AntV 文档

蚂蚁数据可视化解决方案。

[AntV 中文文档](https://antv.vision/zh)

- [G2](https://g2.antv.vision/zh) 一套面向常规统计图表，以数据驱动的高交互可视化图形语法，具有高度的易用性和扩展性。
- [S2](https://s2.antv.vision/zh) 是多维交叉分析领域的表格解决方案，数据驱动视图，提供底层核心库、基础组件库、业务场景库，具备自由扩展的能力。
- [L7](https://l7.antv.vision/zh) 基于 WebGL 的开源大规模地理空间数据可视分析引擎。
- [X6](https://x6.antv.vision/zh) 图编辑引擎，提供了一系列开箱即用的交互组件和简单易用的节点定制能力，方便我们快速搭建 DAG 图、ER 图、流程图等应用。
- [G6](https://g6.antv.vision/zh) 图可视化引擎，它在高定制能力的基础上，提供了一系列设计优雅、便于使用的图可视化解决方案。能帮助开发者搭建属于自己的图可视化、图分析、或图编辑器应用。
- ...

### ArcGIS API for JavaScript 文档

[English Doc](https://developers.arcgis.com/javascript/latest/)

### Supabase 文档

- [English Doc](https://supabase.com/docs)
- [supabase-js Doc](https://supabase.com/docs/reference/javascript)

### 高德文档

- [高德 JS API 中文文档](https://lbs.amap.com/api/jsapi-v2/summary)
  - [JS API 示例](https://lbs.amap.com/demo/list/js-api)
- [高德 Web 服务中文文档](https://lbs.amap.com/api/webservice/summary/)

## 参考项目

- [Geeker Admin](https://github.com/HalseySpicy/Geeker-Admin)，基于 Vue3.2、TypeScript、Vite2、Pinia、Element-Plus 开源的一套后台管理模板。其中有很多实现例子的源码可以学习。[在线预览地址](https://admin.spicyboy.cn/#/login)。
- [Variant Form 3](https://vform666.com/vform3.html)，一款高效的 Vue 3 低代码表单。如果有表单设计需求可以看一下这个。
