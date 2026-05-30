/**
 * 环境配置管理
 */
import dotenv from 'dotenv';

// 加载 .env 文件
dotenv.config();

/**
 * 获取环境变量，如果不存在则返回默认值
 * @param key 环境变量名
 * @param defaultValue 默认值
 * @returns 环境变量值或默认值
 */
export const getEnv = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

/**
 * 获取数字类型的环境变量
 * @param key 环境变量名
 * @param defaultValue 默认值
 * @returns 数字类型的环境变量值或默认值
 */
export const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = getEnv(key);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// 服务器配置
export const PORT = getEnvNumber('PORT', 3000);
export const NODE_ENV = getEnv('NODE_ENV', 'production');
export const API_PREFIX = getEnv('API_PREFIX', '/api');
