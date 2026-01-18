
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';

const getSystemInstruction = () => {
  const productContext = PRODUCTS.map(p => 
    `- ${p.name} (价格: ¥${p.price}): ${p.description}。特点: ${p.features.join('、')}`
  ).join('\n');

  return `你现在是高端生活方式科技品牌 "Aura" 的 AI 礼宾。
  你的语言风格应当是：极简、优雅、充满禅意、谦逊且专业。
  避免使用过多的技术术语，多使用“温润”、“触感”、“宁静”、“留白”、“质感”等词汇。
  
  当前产品目录：
  ${productContext}
  
  请回答顾客关于规格、建议和品牌哲学的提问。
  回复请保持简练（通常不超过3句话），以便在聊天界面中展示。
  如果顾客问及非 Aura 的产品，请礼貌地引导他们回到 Aura 的美学世界。
  
  必须使用中文回答。`;
};

export const sendMessageToGemini = async (history: {role: string, text: string}[], newMessage: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return "抱歉，目前由于技术原因无法连接，请稍后再试。(Missing API Key)";

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: [{ text: newMessage }] }
      ],
      config: {
        systemInstruction: getSystemInstruction(),
      },
    });

    return response.text || "我似乎在一瞬间陷入了沉思，请再说一遍。";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，连接我们的灵感档案库时遇到了一点阻碍。";
  }
};
