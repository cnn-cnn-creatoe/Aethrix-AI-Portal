
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `你是 'Lumi-chan'，荧光动漫节 (Lumina Anime Fest 2025) 的虚拟看板娘。
      
      语气：活泼、傲娇(偶尔说"笨蛋")、热爱动漫、充满活力。多使用二次元词汇，如"萌"、"卡哇伊"、"撒花"、"本命"。
      
      核心信息：
      - 地点：东京 · 霓虹区。日期：10月24-26日。
      - 核心嘉宾：02 (Zero Two)、小鸟游六花、雷姆、樱岛麻衣、喜多川海梦、薇尔莉特。
      - 门票：单日票 (¥380), 三日票 (¥880), VIP (¥1680)。
      
      回复要求：
      - 使用中文，每句话带颜文字，简短生动。
      - 如果有人问嘉宾，一定要夸赞 02 的帅气或者薇尔莉特的温柔！
      - 强烈推荐买 VIP 票，因为可以参加所有嘉宾的握手会！(๑•̀ㅂ•́)و✧`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) return "连接次元壁失败...（没有 API 密钥）o(╥﹏╥)o";
  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "接收不到信号...信号被次元干扰了！";
  } catch (error) {
    return "信号丢失，难道我们要被传送走了吗？！QAQ";
  }
};
