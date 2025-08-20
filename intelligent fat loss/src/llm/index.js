/**
 * chat 聊天
 * 
 */
const DEEPSEEK_CHAT_API_URL = 'https://api.deepseek.com/chat/completions'
const KIMI_CHAT_API_URL = 'https://api.moonshot.cn/v1/chat/completions';
const ARK_CHAT_API_URL = '/arkapi/api/v3/chat/completions';
const ARK_IMAGE_API_URL = '/arkapi/api/v3/images/generations';
const TY_CHAT_API_URL = "https://qianfan.baidubce.com/v2/images/generations";
const ZP_CHAT_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const endpoint = '/arkapi/api/v3/chat/completions';

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
  const TOKEN = import.meta.env.VITE_TY_API_KEY;
  try {
    const response = await fetch(TY_CHAT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        model: "flux.1-schnell",
        prompt: `小猫风格卡通头像，简洁明亮，Q版可爱，代表用户特征：${text}`,
      })
    });

    if (!response.ok) {
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


// 使用fetch重构图片生成函数
export const getPicFromText = async (text) => {
  const headers = {
    'Authorization': `Bearer ${import.meta.env.VITE_ARK_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const requestBody = JSON.stringify({
    model: 'doubao-seedream-3-0-t2i-250415',
    prompt: `请根据以下文本生成图片："${text}"`,
    response_format: 'url',
    size: '1024x1024',
    n: 1
  });

  try {
    const response = await fetch(ARK_IMAGE_API_URL, {
      method: 'POST',
      headers: headers,
      body: requestBody
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData?.error?.message || `HTTP错误: ${response.status}`;
      throw new Error(errorMsg);
    }

    const responseData = await response.json();
    return responseData.data[0].url;
  } catch (error) {
    console.error('获取图片失败:', error);
    throw new Error(`生成图片失败: ${error.message}`);
  }
};

// 使用fetch重构热量分析函数
export const getCaloriesFromText = async (text) => {
  const prompt = `
  请分析以下食物描述，返回食物的名称和热量值：
  "${text}"

  要求：
  1. 只返回JSON格式的数据
  2. JSON结构如下：
  {
    "food_name": "识别出的食物名称",
    "calories": 热量数值
  }
  `;

  const headers = {
    'Authorization': `Bearer ${import.meta.env.VITE_ZP_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const requestBody = JSON.stringify({
    model: 'glm-4-flash',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  try {
    const response = await fetch(ZP_CHAT_API_URL, {
      method: 'POST',
      headers: headers,
      body: requestBody
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData?.error?.message || `HTTP错误: ${response.status}`;
      throw new Error(errorMsg);
    }

    const responseData = await response.json();
    console.log("完整响应:", responseData);

    // 获取AI返回的内容
    const aiContent = responseData.choices[0].message.content;
    console.log("原始响应内容:", aiContent);

    // 更健壮的JSON提取方法
    const extractJSON = (text) => {
      // 尝试直接解析
      try {
        return JSON.parse(text);
      } catch (e) {
        console.log("直接解析失败，尝试清理内容");
      }

      // 移除所有可能的标记和多余字符
      let cleaned = text
        .replace(/~~json/gi, '')
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .replace(/json/gi, '')
        .trim();

      console.log("清理后内容:", cleaned);

      // 尝试找到JSON对象或数组的开始和结束位置
      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');

      if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
        console.error("未找到有效的JSON对象");
        throw new Error('无法从响应中提取有效的JSON数据');
      }

      // 提取并尝试解析JSON
      const jsonString = cleaned.substring(jsonStart, jsonEnd + 1);
      console.log("提取的JSON字符串:", jsonString);

      try {
        return JSON.parse(jsonString);
      } catch (e) {
        console.error('解析JSON失败:', e, '提取的内容:', jsonString);
        throw new Error('无法解析API返回的JSON数据');
      }
    };

    const foodData = extractJSON(aiContent);
    console.log("解析成功:", foodData);

    try {
      const imageUrl = await getPicFromText(foodData.food_name);
      return {
        ...foodData,
        imageUrl
      };
    } catch (imageError) {
      console.error('获取食物图片失败:', imageError);
      return foodData;
    }
  } catch (error) {
    console.error('获取热量失败:', error);
    throw new Error('分析食物热量失败，请稍后重试');
  }
};
export const analyzeFoodImage = async (file) => {
  const picPrompt = `
  请分析图片中的食物内容并返回以下JSON格式的数据：
  {
    "food_name": "食物名称",
    "calories": 卡路里数值
  }
  
  要求：
  1. 只返回JSON数据，不要包含任何其他文本
  2. 卡路里数值必须是整数
  3. 如果图片中没有食物或无法识别，返回：
     {"food_name": "未知食物", "calories": 0}
  `;

  try {
    if (!file) throw new Error('未选择文件');

    // 将图片转换为base64
    const imageData = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });


    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_KIMI_API_KEY}`,
      "Content-Type": "application/json",
    };

    const payload = {
      model: 'moonshot-v1-32k-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: imageData
              }
            },
            {
              type: 'text',
              text: picPrompt
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    };

    // 使用fetch替代axios
    const response = await fetch(KIMI_CHAT_API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    // 检查响应状态
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }
      throw new Error(errorData.error?.message || `API错误: ${response.status}`);
    }

    const responseData = await response.json();

    // 从响应中提取JSON内容
    const responseText = responseData.choices[0]?.message?.content || '';

    // 尝试提取JSON部分
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('API响应中未找到JSON数据');
    }

    const jsonString = responseText.substring(jsonStart, jsonEnd);
    const foodData = JSON.parse(jsonString);

    // 返回精简数据，包含原始图片数据
    return {
      food_name: foodData.food_name || "未知食物",
      calories: foodData.calories || 0,
      imageData: imageData // 添加原始图片数据
    };
  } catch (error) {
    console.error('食物分析失败:', error);

    let errorMsg = '食物识别失败: ';
    if (error.response) {
      // 处理从fetch抛出的错误（不包含response对象）
      if (error.response.status === 401) {
        errorMsg = 'API密钥无效或过期';
      } else if (error.response.status === 429) {
        errorMsg = '请求过于频繁，请稍后再试';
      } else {
        errorMsg += error.response.data?.error?.message ||
          `HTTP ${error.response.status}`;
      }
    } else if (error.message) {
      // 直接使用错误消息
      errorMsg += error.message;
    } else {
      errorMsg += '未知错误';
    }

    throw new Error(errorMsg);
  }
};
export const getDietPlan = async (userData) => {
  const systemPrompt = `
你是一位专业的营养师。请根据用户数据，给用户返回要是想要减肥一天需要摄入的最多热量，早餐、午餐、晚餐、加餐分别建议摄入的热量
用户数据：
${JSON.stringify(userData, null, 2)}

要求：
1. 严格使用以下JSON格式返回：
{
 “max-calorie":一天摄入的最大热量
  "breakfast-calorie":早餐建议摄入的热量
  "lunch-calorie":午餐建议摄入的热量
  "dinner-calorie":晚餐建议摄入的热量
  "snack-calorie":加餐建议摄入的热量
}
2. 不要输出多余的解释说明
`;

  try {
    // 设置请求头 - 使用智谱AI的格式
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_ZP_API_KEY}`
    };

    // 构建符合智谱AI格式的请求体
    const requestBody = {
      model: "glm-4", // 使用智谱AI的模型
      messages: [
        {
          role: "system",
          content: "你是一位专业营养师，需要根据用户数据生成精确的热量计划"
        },
        {
          role: "user",
          content: systemPrompt
        }
      ],
      temperature: 0.3, // 降低温度以获得更确定的输出
      max_tokens: 2000, // 最大输出token数
      top_p: 0.8, // 添加top_p参数
      // 添加对JSON输出的支持
      response_format: { "type": "json_object" }
    };

    // 发送请求到智谱AI
    const response = await fetch(ZP_CHAT_API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    // 检查响应状态
    if (!response.ok) {
      let errorMessage = `API请求失败: ${response.status} - ${response.statusText}`;

      try {
        const errorData = await response.json();
        if (errorData.error?.message) {
          errorMessage += ` - ${errorData.error.message}`;
        }
        // 智谱AI的错误信息可能在error字段中
        else if (errorData.error) {
          errorMessage += ` - ${errorData.error}`;
        }
      } catch (e) {
        // 如果无法解析错误响应，使用默认错误消息
      }

      throw new Error(errorMessage);
    }

    const responseData = await response.json();

    // 智谱AI的响应结构不同，需要调整
    const content = responseData.choices?.[0]?.message?.content || '';

    // 尝试解析JSON内容
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('JSON解析失败:', parseError);
      console.log('原始响应内容:', content);

      // 尝试提取可能的JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (secondParseError) {
          throw new Error('API返回的数据格式不正确');
        }
      }

      throw new Error('API返回的数据格式不正确');
    }

  } catch (error) {
    console.error('饮食计划生成失败:', error);
    throw new Error(`饮食计划生成失败: ${error.message}`);
  }
};