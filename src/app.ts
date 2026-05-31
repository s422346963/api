/**
 * 应用主入口文件
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import swaggerSpec from './config/swagger';
import { PORT, NODE_ENV } from './config/environment';
import { router, API_PREFIX } from './routes';

// 创建 Express 应用
const app = express();

// 中间件配置
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "*"],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      formAction: ["'self'"],
    },
  },
})); // 安全头部（配置CSP允许API调试工具连接外部API）
app.use(cors()); // 跨域资源共享
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码请求体

// 静态文件服务：将 /static 路径映射到 src/static 目录
app.use('/static', express.static(path.join(__dirname, 'static')));

// Swagger UI 路由（仅在开发环境显示）
if (NODE_ENV === 'development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// 路由配置
app.use(API_PREFIX, router);

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - 系统
 *     summary: 欢迎页面
 *     description: 获取 API 基本信息
 *     responses:
 *       200:
 *         description: 成功返回欢迎信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '欢迎使用 TypeScript + Express MVC API',
    version: '1.0.0',
    documentation: NODE_ENV === 'development' ? '/api-docs' : undefined
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '请求的资源不存在'
  });
});

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`环境: ${NODE_ENV}`);
  console.log(`API 前缀: ${API_PREFIX}`);
  if (NODE_ENV === 'development') {
    console.log(`API 文档: http://localhost:${PORT}/api-docs`);
  }
  console.log(`健康检查: http://localhost:${PORT}${API_PREFIX}/health`);
});

export default app;
