/**
 * 统一响应数据结构接口
 */
export interface Result {
  code: number;
  success: boolean;
  message?: string;
  data?: any;
}
