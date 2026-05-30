/**
 * 主路由配置 - 组合所有路由模块
 */
import { Router } from 'express';
import userRoutes from './user.routes';
import urlRoutes from './url.routes';
import { API_PREFIX } from '../config/environment';
import { R } from '../utils/response.util';

const router = Router();

// 用户路由
router.use('/users', userRoutes);

// URL 路由
router.use('/url', urlRoutes);

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags:
 *       - 系统
 *     summary: 健康检查
 *     description: 检查服务器是否正常运行
 *     responses:
 *       200:
 *         description: 服务器运行正常
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       description: 服务器当前时间
 */
router.get('/health', (req, res) => {
  res.status(200).json(R.ok(new Date().toISOString(), "服务器运行正常"));
});

export { router, API_PREFIX };
