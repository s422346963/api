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

/**
 * @swagger
 * /api/url/proxy:
 *   post:
 *     tags:
 *       - URL 工具
 *     summary: API 代理
 *     description: 通过代理访问外部 API，解决 CORS 问题
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
 *                 description: 目标 API URL
 *                 example: https://jsonplaceholder.typicode.com/posts/1
 *               method:
 *                 type: string
 *                 description: HTTP 方法
 *                 example: GET
 *               headers:
 *                 type: object
 *                 description: 请求头
 *               body:
 *                 type: string
 *                 description: 请求体
 *     responses:
 *       200:
 *         description: 成功代理请求
 */
router.post('/proxy', UrlController.proxyRequest);

export default router;
