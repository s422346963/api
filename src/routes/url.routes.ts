/**
 * URL 路由配置
 */
import { Router } from 'express';
import { UrlController } from '../controllers/url.controller';

const router = Router();

/**
 * @swagger
 * /api/url/icon:
 *   post:
 *     tags:
 *       - URL 工具
 *     summary: 获取网站信息
 *     description: 根据输入的 URL 获取网站标题、描述和 favicon 图标
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 description: 网站 URL
 *                 example: https://www.baidu.com
 *     responses:
 *       200:
 *         description: 成功获取网站信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: 请求是否成功
 *                   example: true
 *                 title:
 *                   type: string
 *                   description: 网站标题
 *                   example: 百度一下，你就知道
 *                 description:
 *                   type: string
 *                   description: 网站描述
 *                   example: 全球领先的中文搜索引擎
 *                 url:
 *                   type: string
 *                   description: favicon 图标 URL
 *                   example: https://www.baidu.com/favicon.ico
 *                 message:
 *                   type: string
 *                   description: 响应消息
 *                   example: ''
 */
router.post('/icon', UrlController.getWebsiteInfo);

export default router;
