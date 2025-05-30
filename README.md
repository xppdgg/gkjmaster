## phase1
1. 点击时传感器和摄像头时注意提示（解决，直接设置无法点击标签栏）
2. 点击左侧树的摄像头和传感器才有用（解决）
3. 树联动(解决)
4. 页面每次进行分页读取(解决)
5. 表格中有些列的名字改掉(解决)
6. 页面路由导航刷新显示(解决)
<!-- 7. 进来界面时不需要有角色 -->
8. 刷新之后保存用户登录状态(解决)


## phase2(页面展示)
1. clmodel 模型 (crud完成)
2. clwkcamera 摄像头 (crud完成)
3. clwksensor 传感器 (crud完成)
4. table_all表格 (crud完成)
5. cldataconf 系统设置 (crud完成)
6. uuid UUID表 (crud完成)
7. 数据
8. 图片
# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
