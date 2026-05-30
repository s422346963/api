/**
 * 用户路由配置
 */
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - 用户管理
 *     summary: 获取所有用户
 *     description: 获取系统中所有用户的列表
 *     responses:
 *       200:
 *         description: 成功获取用户列表
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 */
router.get('/', UserController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - 用户管理
 *     summary: 根据 ID 获取用户
 *     description: 通过用户 ID 获取单个用户的详细信息
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 用户 ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 */
router.get('/:id', UserController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - 用户管理
 *     summary: 创建新用户
 *     description: 在系统中创建一个新用户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: 成功创建用户
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 */
router.post('/', UserController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - 用户管理
 *     summary: 更新用户信息
 *     description: 根据用户 ID 更新用户的信息
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 用户 ID
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: 成功更新用户
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 */
router.put('/:id', UserController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - 用户管理
 *     summary: 删除用户
 *     description: 根据用户 ID 删除系统中的用户
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 用户 ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 成功删除用户
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/:id', UserController.deleteUser);

export default router;
