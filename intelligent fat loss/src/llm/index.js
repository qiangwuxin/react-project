/**
 * chat 聊天
 * 
 */
const DEEPSEEK_CHAT_API_URL = 'https://api.deepseek.com/chat/completions'
const KIMI_CHAT_API_URL = 'https://api.moonshot.cn/v1/chat/completions';
const TTS_CHAT_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
// console.log(process.env.VITE_DEEPSEEK_API_KEY)
export const chat = async (
  messages,
  api_url = DEEPSEEK_CHAT_API_URL,
  api_key = import.meta.env.VITE_DEEPSEEK_API_KEY,
  model = 'deepseek-chat'
) => {
  try {
    const response = await fetch(api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      })
    })
    const data = await response.json();
    return {
      code: 0,
      data: {
        role: 'assistant',
        content: data.choices[0].message.content
      }

    }
  } catch (err) {
    return {
      code: 1,
      msg: '出错了...'
    }
  }
}
export const kimiChat = async (messages) => {
  const res = await chat(
    messages,
    KIMI_CHAT_API_URL,
    import.meta.env.VITE_KIMI_API_KEY,
    'moonshot-v1-auto'
  )
  return res;
}
export const generateAvatar = async (text) => {
  const API_URL = "https://qianfan.baidubce.com/v2/images/generations";
  const TOKEN = "bce-v3/ALTAK-C6DOn6Vdo4UkcONgYUTih/e0fa75069a49b4fb7adf4deb28ab7eb1a0183465";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        model: "flux.1-schnell", // 使用 FLUX.1-schnell 模型
        prompt: `奶龙风格卡通头像，简洁明亮，Q版可爱，代表用户特征：${text}`,
      })
    });

    if (!response.ok) {
      // 解析错误信息
      let errorMessage = `API错误: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error?.message) {
          errorMessage += ` - ${errorData.error.message}`;
        }
      } catch (e) {
        errorMessage += " - 无法解析错误响应";
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // 根据通义千问API文档，响应格式为：
    // {
    //   "created": 1692876800,
    //   "data": [
    //     {"url": "https://example.com/image1.jpg"},
    //   ]
    // }
    if (data.data && data.data.length > 0 && data.data[0].url) {
      console.log("头像生成成功:", data.data[0].url);
      return data.data[0].url;
    } else {
      throw new Error("API返回了无效的响应格式");
    }
  } catch (error) {
    console.error("生成头像失败:", error);
    throw new Error(`图片生成失败: ${error.message}`);
  }
};