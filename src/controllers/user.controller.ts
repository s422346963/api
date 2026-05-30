/**
 * 用户控制器 - 处理用户相关的 HTTP 请求和响应
 */
import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { CreateUserDto, UpdateUserDto } from '../types/user';

/**
 * 用户控制器类
 */
export class UserController {
  /**
   * 获取所有用户
   * @param req Express 请求对象
   * @param res Express 响应对象
   */
  static getAllUsers = (req: Request, res: Response): void => {
    try {
      const users = UserModel.findAll();
      res.status(200).json({
        success: true,
        message: '获取用户列表成功',
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取用户列表失败',
        error: (error as Error).message
      });
    }
  };

  /**
   * 根据 ID 获取用户
   * @param req Express 请求对象
   * @param res Express 响应对象
   */
  static getUserById = (req: Request, res: Response): void => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: '无效的用户 ID'
        });
        return;
      }
      const user = UserModel.findById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: '用户不存在'
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: '获取用户成功',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取用户失败',
        error: (error as Error).message
      });
    }
  };

  /**
   * 创建新用户
   * @param req Express 请求对象
   * @param res Express 响应对象
   */
  static createUser = (req: Request, res: Response): void => {
    try {
      const { name, email, age } = req.body;
      // 简单的参数验证
      if (!name || !email) {
        res.status(400).json({
          success: false,
          message: '姓名和邮箱不能为空'
        });
        return;
      }
      const userData: CreateUserDto = {
        name,
        email,
        age: age ? parseInt(age, 10) : undefined
      };
      const newUser = UserModel.create(userData);
      res.status(201).json({
        success: true,
        message: '创建用户成功',
        data: newUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '创建用户失败',
        error: (error as Error).message
      });
    }
  };

  /**
   * 更新用户
   * @param req Express 请求对象
   * @param res Express 响应对象
   */
  static updateUser = (req: Request, res: Response): void => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: '无效的用户 ID'
        });
        return;
      }
      const { name, email, age } = req.body;
      const userData: UpdateUserDto = {};
      if (name !== undefined) userData.name = name;
      if (email !== undefined) userData.email = email;
      if (age !== undefined) userData.age = parseInt(age, 10);
      const updatedUser = UserModel.update(id, userData);
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: '用户不存在'
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: '更新用户成功',
        data: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '更新用户失败',
        error: (error as Error).message
      });
    }
  };

  /**
   * 删除用户
   * @param req Express 请求对象
   * @param res Express 响应对象
   */
  static deleteUser = (req: Request, res: Response): void => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: '无效的用户 ID'
        });
        return;
      }
      const deleted = UserModel.delete(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: '用户不存在'
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: '删除用户成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '删除用户失败',
        error: (error as Error).message
      });
    }
  };
}
