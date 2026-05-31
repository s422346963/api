/**
 * API调试工具 - JavaScript功能模块
 * 功能：代码编辑器行号管理、代码执行、结果显示
 * 安全特性：完全符合CSP安全策略，不使用eval/Function等动态执行
 */

// 获取DOM元素引用
const codeEditor = document.getElementById("codeEditor");
const lineNumbers = document.getElementById("lineNumbers");
const resultArea = document.getElementById("resultArea");

// 获取按钮元素引用（用于事件绑定）
const btnRun = document.getElementById("btnRun");
const btnClear = document.getElementById("btnClear");
const btnConfig = document.getElementById("btnConfig");

// 配置弹窗相关元素
const configModal = document.getElementById("configModal");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnConfirmConfig = document.getElementById("btnConfirmConfig");
const btnResetConfig = document.getElementById("btnResetConfig");
const callCountInput = document.getElementById("callCount");
const callIntervalInput = document.getElementById("callInterval");
const enableTimedExecutionCheckbox = document.getElementById("enableTimedExecution");
const timedDelayGroup = document.getElementById("timedDelayGroup");
const timedDelayInput = document.getElementById("timedDelay");
const enableProxyCheckbox = document.getElementById("enableProxy");

// 运行配置（默认值）
const defaultConfig = {
  callCount: 1,
  callInterval: 0,
  enableTimedExecution: false,
  timedDelay: "",
  enableProxy: false,
};

// 当前配置
let currentConfig = { ...defaultConfig };

/**
 * 更新行号显示功能
 * 根据代码内容自动计算并显示行号
 */
function updateLineNumbers() {
  const lines = codeEditor.value.split("\n").length;
  let numbersHtml = "";
  for (let i = 1; i <= lines; i++) {
    numbersHtml += i + "\n";
  }
  lineNumbers.textContent = numbersHtml.trim();
}

/**
 * 同步滚动功能
 * 让行号区域跟随代码编辑器滚动
 */
function syncScroll() {
  lineNumbers.scrollTop = codeEditor.scrollTop;
}

/**
 * 解析用户输入的fetch代码，提取URL和配置参数
 * 使用正则表达式提取URL，然后用JSON方式解析第二个参数
 * @param {string} code - 用户输入的fetch代码
 * @returns {Object} 解析后的fetch配置对象 {url, options}
 */
function parseFetchCode(code) {
  //先替换所有的单引号为双引号
  code = code.replace(/'/g, '"');

  // 提取fetch函数调用的第一个参数（URL）
  const urlMatch = code.match(/fetch\(\s*['"`]\s*([^'"`]+?)\s*['"`]/);
  const url = urlMatch ? urlMatch[1].trim() : "";

  // 初始化默认配置对象
  const defaultOptions = {
    method: "GET",
    headers: {},
    body: null,
  };

  // 如果未提取到URL，返回默认配置
  if (!url) {
    return { url, options: defaultOptions };
  }

  // 提取fetch的第二个参数（配置对象）
  // 匹配第一个逗号后的所有内容，尝试提取大括号包裹的JSON对象
  const firstCommaIndex = code.indexOf(',', urlMatch.index + urlMatch[0].length);
  
  if (firstCommaIndex === -1) {
    // 没有第二个参数，返回默认配置
    return { url, options: defaultOptions };
  }

  // 从第一个逗号后开始查找配置对象
  const afterComma = code.substring(firstCommaIndex + 1);
  
  // 查找配置对象的开始大括号
  const braceStartIndex = afterComma.indexOf('{');
  if (braceStartIndex === -1) {
    return { url, options: defaultOptions };
  }

  // 查找匹配的结束大括号（处理嵌套大括号）
  let braceCount = 0;
  let braceEndIndex = -1;
  let inString = false;
  let stringChar = '';
  let escapeNext = false;

  for (let i = braceStartIndex; i < afterComma.length; i++) {
    const char = afterComma[i];

    // 处理转义字符
    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    // 处理字符串内的字符
    if (inString) {
      if (char === '\\') {
        escapeNext = true;
      } else if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    // 处理字符串开始
    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      continue;
    }

    // 处理大括号计数
    if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      if (braceCount === 0) {
        braceEndIndex = i;
        break;
      }
    }
  }

  // 如果未找到匹配的结束大括号，返回默认配置
  if (braceEndIndex === -1) {
    console.error("未找到匹配的配置对象结束位置");
    return { url, options: defaultOptions };
  }

  // 提取配置对象的JSON字符串
  const optionsJsonStr = afterComma.substring(braceStartIndex, braceEndIndex + 1);

  // 尝试将配置对象解析为JSON
  try {
    const options = JSON.parse(optionsJsonStr);
    
    // 确保method字段存在
    if (!options.method) {
      options.method = "GET";
    } else {
      options.method = options.method.toUpperCase();
    }

    // 确保headers字段存在
    if (!options.headers) {
      options.headers = {};
    }

    // body字段保持原样（可能是JSON字符串或null）
    if (options.body === undefined) {
      options.body = null;
    }

    return { url, options };
  } catch (error) {
    console.error("解析配置对象JSON失败:", error);
    console.error("原始JSON字符串:", optionsJsonStr);
    return { url, options: defaultOptions };
  }
}

/**
 * HTML转义函数，将特殊字符转换为实体引用
 * @param {string} str - 要转义的字符串
 * @returns {string} 转义后的字符串
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 根据状态码获取对应的颜色
 * @param {number} status - HTTP状态码
 * @returns {string} 颜色值
 */
function getStatusColor(status) {
  if (status >= 200 && status < 300) return "#059669";  // 2xx - 成功
  if (status >= 300 && status < 400) return "#3b82f6";  // 3xx - 重定向
  if (status >= 400 && status < 500) return "#f59e0b";  // 4xx - 客户端错误
  if (status >= 500) return "#dc2626";                  // 5xx - 服务器错误
  return "#6b7280";                                      // 其他
}

/**
 * 创建统一格式的错误信息对象
 * @param {Error} error - 错误对象
 * @returns {Object} 格式化后的错误信息
 */
function createErrorInfo(error) {
  return {
    ok: false,
    status: "ERR",
    error: true,
    message: error.message,
    name: error.name,
    type: "FetchError",
    timestamp: new Date().toISOString(),
    data: null,
  };
}

/**
 * 从响应数据中提取结果摘要
 * @param {*} data - 响应数据
 * @returns {string} 结果摘要字符串
 */
function extractResultSummary(data) {
  if (data.error) {
    return data.message;
  } else if (typeof data.data === "object") {
    return JSON.stringify(data.data);
  } else {
    return String(data.data);
  }
}

/**
 * 格式化延时显示
 * @param {number} seconds - 秒数
 * @returns {string} 格式化的时间字符串
 */
function formatDelay(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  let result = '';
  if (hours > 0) {
    result += `${hours}小时`;
  }
  if (minutes > 0) {
    result += `${minutes}分钟`;
  }
  result += `${secs}秒`;
  
  return result;
}

/**
 * 格式化单行结果显示
 * @param {*} data - 响应数据
 * @returns {string} 单行HTML字符串
 */
function formatResultLine(data) {
  const timestamp = new Date().toISOString();
  const status = data.status || "ERR";
  const color = data.status ? getStatusColor(data.status) : "#dc2626";
  const success = data.ok ? "✓" : "✗";

  // 提取完整结果摘要
  const resultSummary = extractResultSummary(data);

  // 对title属性进行HTML转义，防止引号破坏结构
  const escapedTitle = escapeHtml(resultSummary);
  // 对显示内容也进行HTML转义，防止被当作HTML解析
  const escapedContent = escapeHtml(resultSummary);

  return `
    <div class="result-line">
      <span style="color: ${color}; font-weight: 600; min-width: 60px; margin-right: 12px; white-space: nowrap;">
        ${success} 【${status}】
      </span>
      <span style="color: #6b7280; min-width: 200px; margin-right: 12px; white-space: nowrap;">
        ${timestamp}
      </span>
      <span style="color: #1f2937; white-space: nowrap;" title="${escapedTitle}">
        ${escapedContent}
      </span>
    </div>
  `;
}

/**
 * 添加HTML内容到结果区域
 * @param {string} html - 要添加的HTML字符串
 */
function appendHtmlToResult(html) {
  // 移除占位提示
  const placeholder = resultArea.querySelector('.placeholder-text');
  if (placeholder) {
    placeholder.remove();
  }

  // 创建新的元素并添加
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  resultArea.appendChild(tempDiv.firstElementChild);

  // 滚动到底部
  resultArea.scrollTop = resultArea.scrollHeight;
}

/**
 * 追加单条结果到DOM
 * @param {*} data - 响应数据
 */
function appendResult(data) {
  appendHtmlToResult(formatResultLine(data));
}


/**
 * 清空运行结果
 * 仅重置结果显示区域，保留代码编辑器内容
 */
function clearAll() {
  resultArea.innerHTML =
    '<span class="placeholder-text">运行结果将在这里显示...</span>';
}

/**
 * 更新定时时间输入框的显示状态
 * @param {boolean} show - 是否显示
 */
function toggleTimedDelayGroup(show) {
  timedDelayGroup.style.display = show ? 'block' : 'none';
}

/**
 * 打开配置弹窗
 */
function openConfigModal() {
  // 将当前配置值填充到输入框
  callCountInput.value = currentConfig.callCount;
  callIntervalInput.value = currentConfig.callInterval;
  enableTimedExecutionCheckbox.checked = currentConfig.enableTimedExecution;
  timedDelayInput.value = currentConfig.timedDelay;
  enableProxyCheckbox.checked = currentConfig.enableProxy;
  
  // 根据定时执行状态显示/隐藏定时时间输入框
  toggleTimedDelayGroup(currentConfig.enableTimedExecution);
  configModal.classList.add("active");
}

/**
 * 关闭配置弹窗
 */
function closeConfigModal() {
  configModal.classList.remove("active");
}

/**
 * 确认配置
 */
function confirmConfig() {
  const count = parseInt(callCountInput.value, 10);
  const interval = parseInt(callIntervalInput.value, 10);
  const enableTimed = enableTimedExecutionCheckbox.checked;
  const timedDelay = timedDelayInput.value;
  const enableProxy = enableProxyCheckbox.checked;

  // 验证输入值
  if (isNaN(count) || count < 1 || count > 1000) {
    callCountInput.focus();
    callCountInput.style.borderColor = "#dc2626";
    return;
  }
  if (isNaN(interval) || interval < 0 || interval > 60000) {
    callIntervalInput.focus();
    callIntervalInput.style.borderColor = "#dc2626";
    return;
  }
  // 如果开启了定时执行，验证是否选择了时间
  if (enableTimed && !timedDelay) {
    timedDelayInput.focus();
    timedDelayInput.style.borderColor = "#dc2626";
    return;
  }

  // 恢复边框颜色
  resetInputBorders();

  // 保存配置
  currentConfig.callCount = count;
  currentConfig.callInterval = interval;
  currentConfig.enableTimedExecution = enableTimed;
  currentConfig.timedDelay = timedDelay;
  currentConfig.enableProxy = enableProxy;

  // 关闭弹窗
  closeConfigModal();
}

/**
 * 重置所有输入框的边框颜色
 */
function resetInputBorders() {
  callCountInput.style.borderColor = "";
  callIntervalInput.style.borderColor = "";
  timedDelayInput.style.borderColor = "";
}

/**
 * 重置配置为默认值
 */
function resetConfig() {
  callCountInput.value = defaultConfig.callCount;
  callIntervalInput.value = defaultConfig.callInterval;
  enableTimedExecutionCheckbox.checked = defaultConfig.enableTimedExecution;
  timedDelayInput.value = defaultConfig.timedDelay;
  enableProxyCheckbox.checked = defaultConfig.enableProxy;
  resetInputBorders();
  toggleTimedDelayGroup(false);
}

/**
 * 通过代理执行请求
 * @param {string} url - 请求URL
 * @param {Object} options - 请求配置
 * @returns {Promise} 请求结果
 */
function executeRequestWithProxy(url, options) {
  const startTime = performance.now();
  
  // 构建代理请求体
  const proxyBody = {
    url: url,
    method: options.method,
    headers: options.headers,
    body: options.body,
  };

  // 通过本地代理发送请求
  return fetch('/api/url/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(proxyBody),
  })
  .then(response => response.json())
  .then(proxyResponse => {
    const endTime = performance.now();
    
    // 转换代理响应为统一格式
    return {
      status: proxyResponse.status || proxyResponse.statusCode || 500,
      statusText: proxyResponse.statusText || '',
      ok: !proxyResponse.error && proxyResponse.status >= 200 && proxyResponse.status < 300,
      redirected: false,
      type: 'proxy',
      url: url,
      headers: proxyResponse.headers || {},
      data: proxyResponse.data,
      timing: {
        duration: Math.round(endTime - startTime),
        unit: 'ms',
      },
      _viaProxy: true, // 标记通过代理请求
    };
  });
}

/**
 * 执行单次请求
 * @param {string} url - 请求URL
 * @param {Object} options - 请求配置
 * @param {boolean} useProxy - 是否使用代理
 * @returns {Promise} 请求结果
 */
function executeSingleRequest(url, options, useProxy = false) {
  // 如果启用代理，使用代理模式
  if (useProxy) {
    return executeRequestWithProxy(url, options);
  }
  // 使用原生fetch API发送请求（完全符合CSP）
  const fetchOptions = {
    method: options.method,
    headers: options.headers,
  };

  // 只有POST/PUT/PATCH方法才添加body
  if (
    options.body &&
    ["POST", "PUT", "PATCH"].includes(options.method.toUpperCase())
  ) {
    fetchOptions.body = options.body;
  }

  // 发送fetch请求并计时
  const startTime = performance.now();

  return fetch(url, fetchOptions)
    .then((response) => {
      // 获取响应头信息
      const responseHeaders = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // 根据Content-Type决定如何解析响应体
      const contentType = response.headers.get("content-type") || "";
      const endTime = performance.now();

      let parsePromise;
      if (contentType.includes("json")) {
        parsePromise = response.json();
      } else if (contentType.includes("text")) {
        parsePromise = response.text();
      } else {
        parsePromise = response.text().catch(() => "[无法读取响应内容]");
      }

      return parsePromise.then((responseData) => {
        // 构建完整的响应结果对象
        return {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          redirected: response.redirected,
          type: response.type,
          url: response.url,
          headers: responseHeaders,
          data: responseData,
          timing: {
            duration: Math.round(endTime - startTime),
            unit: "ms",
          },
        };
      });
    });
}

/**
 * 输出当前运行配置信息到结果区域
 * @param {Object} config - 配置对象
 */
function appendConfigInfo(config) {
  // 创建配置信息HTML
  let configHtml = `
    <div class="result-line" style="background-color: #f3f4f6; padding: 8px 12px; border-radius: 4px;">
      <span style="font-weight: 600; color: #374151;">【运行配置】</span>
      <span style="margin-left: 12px; color: #4b5563;">调用次数: ${config.callCount}次</span>
      <span style="margin-left: 12px; color: #4b5563;">间隔时间: ${config.callInterval}ms</span>
  `;

  // 添加定时执行信息
  if (config.enableTimedExecution) {
    configHtml += `<span style="margin-left: 12px; color: #4b5563;">定时执行: ${config.timedDelay}</span>`;
  }
  
  // 添加代理模式信息
  if (config.enableProxy) {
    configHtml += `<span style="margin-left: 12px; color: #7c3aed; font-weight: 500;">🔄 代理模式: 已启用</span>`;
  }

  configHtml += `</div>`;
  appendHtmlToResult(configHtml);
}

/**
 * 执行用户输入的fetch代码（安全版本）
 * 通过代码解析器提取参数，使用原生fetch API执行请求
 * 完全符合CSP安全策略，不依赖eval或Function构造器
 * 支持按配置的次数和间隔重复执行
 */
async function runCode() {
  // 获取用户输入的代码
  const code = codeEditor.value;

  // 验证代码是否为空
  if (!code.trim()) {
    const errorData = {
      ok: false,
      error: true,
      message: "请先输入fetch代码",
    };
    appendResult(errorData);
    return;
  }

  // 使用安全的代码解析器提取fetch参数
  const { url, options } = parseFetchCode(code);
  // 验证是否成功提取到URL
  if (!url) {
    const errorData = {
      ok: false,
      error: true,
      message: "无法从代码中提取有效的URL",
    };
    appendResult(errorData);
    return;
  }

  const { callCount, callInterval, enableTimedExecution, timedDelay, enableProxy } = currentConfig;
  
  // 输出配置信息
  appendConfigInfo(currentConfig);

  // 定义实际执行的函数
  const doExecute = async () => {
    // 如果只需要执行一次，直接执行
    if (callCount === 1) {
      try {
        const result = await executeSingleRequest(url, options, enableProxy);
        appendResult(result);
        console.log("✅ Fetch请求执行成功:", result);
      } catch (error) {
        console.error("❌ Fetch请求执行失败:", error);
        appendResult(createErrorInfo(error));
      }
      return;
    }

    // 多次执行 - 并行发起，按间隔调度
    let currentIndex = 0;

    function executeNext() {
      if (currentIndex >= callCount) {
        return;
      }

      const currentCall = currentIndex + 1;
      console.log(`✅ 第 ${currentCall}/${callCount} 次请求:`);
      executeSingleRequest(url, options, enableProxy)
        .then((result) => {
          appendResult(result);
        })
        .catch((error) => {
          console.error(`❌ 第 ${currentCall}/${callCount} 次请求失败:`, error);
          appendResult(createErrorInfo(error));
        });

      currentIndex++;

      // 如果不是最后一次，等待间隔时间后执行下一次
      if (currentIndex < callCount && callInterval > 0) {
        setTimeout(executeNext, callInterval);
      } else if (currentIndex < callCount) {
        // 间隔为0，立即执行下一次
        executeNext();
      }
    }

    // 开始执行
    executeNext();
  };

  // 根据配置决定是否定时执行
  if (enableTimedExecution) {
    executeWithTimer(timedDelay, doExecute);
  } else {
    doExecute();
  }

}

/**
 * 解析时间字符串并计算延时
 * @param {string} timeStr - 时间字符串 HH:MM:SS
 * @returns {number} 延时毫秒数
 */
function calculateDelayFromTime(timeStr) {
  const timeParts = timeStr.split(':').map(Number);
  let hours = 0, minutes = 0, seconds = 0;
  
  if (timeParts.length >= 2) {
    hours = timeParts[0];
    minutes = timeParts[1];
    if (timeParts.length >= 3) {
      seconds = timeParts[2];
    }
  }
  
  const now = new Date();
  const targetTime = new Date(now.getTime());
  targetTime.setHours(hours, minutes, seconds, 0);
  
  // 如果目标时间已经过了，设置为明天
  if (targetTime <= now) {
    targetTime.setDate(targetTime.getDate() + 1);
  }
  
  return targetTime - now;
}

/**
 * 执行定时任务
 * @param {string} timeStr - 时间字符串
 * @param {Function} callback - 回调函数
 */
function executeWithTimer(timeStr, callback) {
  const delayMs = calculateDelayFromTime(timeStr);
  const delaySeconds = delayMs / 1000;
  
  // 显示倒计时信息
  const countdownHtml = `
    <div class="result-line" style="background-color: #fffbeb; padding: 8px 12px; border-radius: 4px;">
      <span style="font-weight: 600; color: #d97706;">⏰ 定时执行中</span>
      <span style="margin-left: 12px; color: #92400e;">将在 <span id="countdown">${formatDelay(delaySeconds)}</span> 后开始执行...</span>
    </div>
  `;
  appendHtmlToResult(countdownHtml);
  
  // 获取倒计时元素
  const countdownEl = resultArea.querySelector('#countdown');
  let remainingSeconds = delaySeconds;
  
  // 倒计时逻辑
  const countdownInterval = setInterval(() => {
    remainingSeconds -= 0.1;
    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
    } else if (countdownEl) {
      countdownEl.textContent = formatDelay(remainingSeconds);
    }
  }, 100);
  
  // 定时执行
  setTimeout(() => {
    clearInterval(countdownInterval);
    // 更新倒计时信息为开始执行
    if (countdownEl) {
      const countdownLine = countdownEl.closest('.result-line');
      if (countdownLine) {
        countdownLine.innerHTML = `
          <span style="font-weight: 600; color: #059669;">▶️ 开始执行</span>
          <span style="margin-left: 12px; color: #047857;">定时时间已到，开始执行请求...</span>
        `;
      }
    }
    callback();
  }, delayMs);
}

// 监听代码编辑器的输入事件，实时更新行号
codeEditor.addEventListener("input", updateLineNumbers);

// 监听滚动事件，同步行号滚动位置
codeEditor.addEventListener("scroll", syncScroll);

// 绑定运行按钮的点击事件（符合CSP安全策略）
btnRun.addEventListener("click", runCode);

// 绑定清空按钮的点击事件（符合CSP安全策略）
btnClear.addEventListener("click", clearAll);

// 绑定配置按钮的点击事件
btnConfig.addEventListener("click", openConfigModal);

// 绑定关闭弹窗按钮
btnCloseModal.addEventListener("click", closeConfigModal);

// 点击遮罩层关闭弹窗
configModal.addEventListener("click", function (e) {
  if (e.target === configModal) {
    closeConfigModal();
  }
});

// 绑定确认配置按钮
btnConfirmConfig.addEventListener("click", confirmConfig);

// 绑定重置配置按钮
btnResetConfig.addEventListener("click", resetConfig);

// 绑定定时执行复选框变化事件
enableTimedExecutionCheckbox.addEventListener("change", function () {
  toggleTimedDelayGroup(this.checked);
});

// 页面加载完成后初始化行号显示
updateLineNumbers();