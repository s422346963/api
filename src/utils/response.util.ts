import { Result } from "../types/common";

/**
 * 响应工具类 - 提供统一的响应生成方法
 */
export class R {
  /**
   * 生成成功响应
   * @param data 返回数据
   * @param message 成功消息
   * @param code 状态码，默认 200
   * @returns 响应对象
   */
  static ok(data?: any, message?: string, code: number = 200): Result {
    return {
      code,
      success: true,
      message,
      data,
    };
  }

  /**
   * 生成失败响应
   * @param message 失败消息
   * @param code 状态码，默认 500
   * @param data 可选的错误数据
   * @returns 响应对象
   */
  static fail(
    message: string = "操作失败",
    code: number = 500,
    data?: any,
  ): Result {
    return {
      code,
      success: false,
      message,
      data,
    };
  }

  /**
   * 生成客户端错误响应（400系列）
   * @param message 错误消息
   * @param code 状态码，默认 400
   * @returns 响应对象
   */
  static badRequest(
    message: string = "请求参数错误",
    code: number = 400,
  ): Result {
    return this.fail(message, code);
  }

  /**
   * 生成未找到响应（404）
   * @param message 错误消息
   * @returns 响应对象
   */
  static notFound(message: string = "不存在"): Result {
    return this.fail(message, 404);
  }

  /**
   * 生成未授权响应（401）
   * @param message 错误消息
   * @returns 响应对象
   */
  static unauthorized(message: string = "未授权访问"): Result {
    return this.fail(message, 401);
  }
}
