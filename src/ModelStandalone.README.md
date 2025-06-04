# 模型管理组件 (ModelStandalone.vue)

这是一个独立的Vue组件，用于模型管理功能。该组件包含了完整的CRUD操作，可以直接导入到其他项目中使用。

## 功能特点

- 模型数据的展示与分页
- 新增模型
- 编辑模型信息
- 删除模型
- 按UUID关键词搜索

## 依赖项

该组件依赖以下库：

```
lodash-es: 用于深拷贝对象
moment: 用于日期格式化
ant-design-vue: UI组件库，提供表格、输入框、按钮等组件
axios: 用于API请求
```

## 使用方法

1. 将`ModelStandalone.vue`文件复制到您的项目中
2. 确保您的项目中已安装所需依赖
3. 在需要使用的地方导入该组件

```vue
<template>
  <div>
    <ModelStandalone />
  </div>
</template>

<script setup>
import ModelStandalone from './path/to/ModelStandalone.vue';
</script>
```

## API接口说明

该组件已内置了所有必要的API请求函数，无需额外导入。组件会自动从sessionStorage中获取用户信息，如果不存在则使用默认值。

组件使用以下API端点：

- 获取模型列表: `/api/companys/{companyid}/roles/{roleid}/login_users/{userid}/windows/1/docs/1/action_docs/1/datas/clmodel`
- 搜索模型: 同上，添加where参数
- 添加模型: POST请求到同一端点
- 更新模型: PUT请求到同一端点
- 删除模型: DELETE请求到`{基础URL}/{id}`

## 自定义配置

如果您需要修改组件的默认行为，可以编辑以下部分：

- 表格列定义: 修改`columns`变量
- 分页设置: 修改`pagination`对象
- API路径: 修改`baseUrl`和`WhereUrl`函数

## 注意事项

- 该组件假设后端API结构与原项目一致
- 用户信息从sessionStorage中的"user"键获取
- 如果您的项目使用不同的认证方式，请相应修改`userInfomation`函数