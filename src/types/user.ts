/**
 * 用户接口定义
 */
export interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建用户时的数据类型（不需要 id、createdAt、updatedAt）
 */
export interface CreateUserDto {
  name: string;
  email: string;
  age?: number;
}

/**
 * 更新用户时的数据类型（所有字段可选）
 */
export interface UpdateUserDto {
  name?: string;
  email?: string;
  age?: number;
}
