/**
 * 用户模型 - 处理用户数据的存储和操作
 */
import { User, CreateUserDto, UpdateUserDto } from '../types/user';

/**
 * 用户模型类
 */
export class UserModel {
  // 模拟数据库存储（实际项目中替换为真实数据库）
  private static users: User[] = [];
  private static nextId = 1;

  /**
   * 获取所有用户
   * @returns 用户列表
   */
  static findAll(): User[] {
    return [...this.users];
  }

  /**
   * 根据 ID 查找用户
   * @param id 用户 ID
   * @returns 用户对象或 null
   */
  static findById(id: number): User | null {
    return this.users.find(user => user.id === id) || null;
  }

  /**
   * 创建新用户
   * @param userData 用户数据
   * @returns 新创建的用户
   */
  static create(userData: CreateUserDto): User {
    const now = new Date();
    const newUser: User = {
      id: this.nextId++,
      name: userData.name,
      email: userData.email,
      age: userData.age,
      createdAt: now,
      updatedAt: now
    };
    this.users.push(newUser);
    return newUser;
  }

  /**
   * 更新用户信息
   * @param id 用户 ID
   * @param userData 要更新的数据
   * @returns 更新后的用户或 null
   */
  static update(id: number, userData: UpdateUserDto): User | null {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      return null;
    }
    const updatedUser = {
      ...this.users[index],
      ...userData,
      updatedAt: new Date()
    };
    this.users[index] = updatedUser;
    return updatedUser;
  }

  /**
   * 删除用户
   * @param id 用户 ID
   * @returns 是否删除成功
   */
  static delete(id: number): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }
}
