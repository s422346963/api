/**
 * URL 控制器 - 处理 URL 相关的 HTTP 请求和响应
 */
import { Request, Response } from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import { URL } from "url";
import { R } from "../utils/response.util";

/**
 * URL 控制器类
 */
export class UrlController {
  /**
   * 获取网站图标和信息
   * @param req Express 请求对象
   * @param res Express 响应对象
   */
  static getWebsiteInfo = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { url } = req.body;

      // 验证 URL 参数
      if (!url) {
        res.status(400).json(R.badRequest());
        return;
      }

      // 确保 URL 有协议前缀
      let targetUrl = url;
      if (
        !targetUrl.startsWith("http://") &&
        !targetUrl.startsWith("https://")
      ) {
        targetUrl = "https://" + targetUrl;
      }

      // 解析 URL
      const parsedUrl = new URL(targetUrl);
      const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;

      // 获取网页内容
      const response = await axios.get(targetUrl, {
        timeout: 10000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // 获取标题
      let title = $("title").text() || "";
      title = title.trim();

      // 获取描述
      let description = "";
      const metaDescription = $('meta[name="description"]').attr("content");
      if (metaDescription) {
        description = metaDescription.trim();
      } else {
        const ogDescription = $('meta[property="og:description"]').attr(
          "content",
        );
        if (ogDescription) {
          description = ogDescription.trim();
        }
      }

      // 获取 favicon
      let faviconUrl = "";

      // 查找 link rel="icon" 或 rel="shortcut icon"
      const iconLinks = $(
        'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]',
      );

      if (iconLinks.length > 0) {
        const firstIcon = iconLinks.first();
        const href = firstIcon.attr("href");
        if (href) {
          if (href.startsWith("http://") || href.startsWith("https://")) {
            faviconUrl = href;
          } else if (href.startsWith("//")) {
            faviconUrl = parsedUrl.protocol + href;
          } else if (href.startsWith("/")) {
            faviconUrl = baseUrl + href;
          } else {
            faviconUrl = baseUrl + "/" + href;
          }
        }
      }

      // 如果没有找到 favicon，尝试默认路径
      if (!faviconUrl) {
        faviconUrl = baseUrl + "/favicon.ico";
      }

      res.status(200).json({
        status: true,
        title: title,
        description: description,
        url: faviconUrl,
        message: "",
      });
    } catch (error) {
      console.error("获取网站信息失败:", error);
      res
        .status(500)
        .json(R.fail("获取网站信息失败" + (error as Error).message));
    }
  };
}
