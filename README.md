# TypeScript + Express MVC API

一个基于 TypeScript 和 Express 的后端 API 服务器，采用 MVC 架构模式，包含用户管理的增删改查（CRUD）示例。

## 项目结构

```
api/
├── src/
│   ├── config/          # 配置文件目录
│   │   ├── environment.ts    # 环境变量配置
│   │   └── swagger.ts        # Swagger 文档配置
│   ├── controllers/     # 控制器目录
│   │   └── user.controller.ts # 用户控制器
│   ├── models/          # 模型目录
│   │   └── user.model.ts      # 用户模型
│   ├── routes/          # 路由目录
│   │   ├── index.ts           # 主路由
│   │   └── user.routes.ts     # 用户路由
│   ├── types/           # 类型定义目录
│   │   └── user.ts            # 用户类型定义
│   └── app.ts           # 应用主入口
├── .env                 # 环境变量文件
├── .gitignore           # Git 忽略文件
├── package.json         # 项目依赖配置
├── tsconfig.json        # TypeScript 配置
└── README.md            # 项目说明文档
```

## MVC 架构说明

- **Model (模型)**: `src/models/user.model.ts` - 负责数据存储和业务逻辑
- **View (视图)**: 本项目为 API 服务，无视图层
- **Controller (控制器)**: `src/controllers/user.controller.ts` - 处理 HTTP 请求和响应
- **Routes (路由)**: `src/routes/user.routes.ts` - 定义 API 路由

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 运行生产版本

```bash
npm start
```

## API 接口文档

### Swagger UI 文档

启动服务器后，访问以下地址查看交互式 API 文档：

```
http://localhost:3000/api-docs
```

在 Swagger UI 中可以：
- 查看所有 API 接口的详细说明
- 直接在页面上测试 API 接口
- 查看请求和响应的示例数据
- 下载 OpenAPI 规范文件

默认 API 前缀为 `/api/v1`

### 用户管理接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/v1/users` | 获取所有用户 |
| GET | `/api/v1/users/:id` | 根据 ID 获取用户 |
| POST | `/api/v1/users` | 创建新用户 |
| PUT | `/api/v1/users/:id` | 更新用户信息 |
| DELETE | `/api/v1/users/:id` | 删除用户 |

### 其他接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/` | 欢迎页面 |
| GET | `/api/v1/health` | 健康检查 |

## 使用示例

### 创建用户

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 25
  }'
```

### 获取所有用户

```bash
curl http://localhost:3000/api/v1/users
```

### 获取单个用户

```bash
curl http://localhost:3000/api/v1/users/1
```

### 更新用户

```bash
curl -X PUT http://localhost:3000/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "李四",
    "age": 30
  }'
```

### 删除用户

```bash
curl -X DELETE http://localhost:3000/api/v1/users/1
```

## 环境变量

在 `.env` 文件中配置环境变量：

```env
PORT=3000
NODE_ENV=development
API_PREFIX=/api/v1
```

## 技术栈

- **Node.js** - JavaScript 运行时
- **Express** - Web 应用框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **CORS** - 跨域资源共享中间件
- **Helmet** - 安全相关的 HTTP 头中间件
- **dotenv** - 环境变量管理
- **swagger-jsdoc** - 基于 JSDoc 注释生成 Swagger 文档
- **swagger-ui-express** - 提供 Swagger UI 界面
- **nodemon** - 开发模式自动重启工具
- **ts-node** - TypeScript 直接执行工具

## 注意事项

- 当前项目使用内存存储数据，服务器重启后数据会丢失
- 实际项目中应该替换为真实的数据库（如 MongoDB、PostgreSQL、MySQL 等）
- 建议添加输入验证库（如 Joi、Zod）进行更严格的数据验证
- 建议添加日志系统（如 winston、pino）
