/**
 * Swagger 配置文件
 */
import swaggerJsdoc from 'swagger-jsdoc';
import { PORT } from './environment';

// Swagger 选项配置
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TypeScript + Express MVC API 文档',
      version: '1.0.0',
      description: '一个基于 TypeScript 和 Express 的后端 API 服务器，采用 MVC 架构模式',
      contact: {
        name: 'API 支持'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: '开发环境服务器'
      }
    ],
    tags: [
      {
        name: '用户管理',
        description: '用户相关的操作接口'
      },
      {
        name: '系统',
        description: '系统相关接口'
      }
    ],
    components: {
      schemas: {
        // 用户模型
        User: {
          type: 'object',
          required: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
          properties: {
            id: {
              type: 'integer',
              description: '用户 ID',
              example: 1
            },
            name: {
              type: 'string',
              description: '用户姓名',
              example: '张三'
            },
            email: {
              type: 'string',
              format: 'email',
              description: '用户邮箱',
              example: 'zhangsan@example.com'
            },
            age: {
              type: 'integer',
              description: '用户年龄',
              example: 25
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '创建时间'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '更新时间'
            }
          }
        },
        // 创建用户请求体
        CreateUser: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: {
              type: 'string',
              description: '用户姓名',
              example: '张三'
            },
            email: {
              type: 'string',
              format: 'email',
              description: '用户邮箱',
              example: 'zhangsan@example.com'
            },
            age: {
              type: 'integer',
              description: '用户年龄（可选）',
              example: 25
            }
          }
        },
        // 更新用户请求体
        UpdateUser: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: '用户姓名',
              example: '李四'
            },
            email: {
              type: 'string',
              format: 'email',
              description: '用户邮箱',
              example: 'lisi@example.com'
            },
            age: {
              type: 'integer',
              description: '用户年龄',
              example: 30
            }
          }
        },
        // 通用响应
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: '请求是否成功'
            },
            message: {
              type: 'string',
              description: '响应消息'
            },
            data: {
              description: '响应数据'
            }
          }
        },
        // 错误响应
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: '错误消息'
            },
            error: {
              type: 'string',
              description: '错误详情（开发环境）'
            }
          }
        }
      }
    }
  },
  // API 文件路径
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/app.ts'
  ]
};

// 生成 Swagger 文档
const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
