
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product, JournalArticle } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Aura 律动 (Harmony)',
    tagline: '静听，风的声音。',
    description: '模拟开阔自然声场的声学艺术品，采用再生砂岩与声学织物打造。',
    longDescription: '体验如呼吸般自然的听觉盛宴。Aura 律动耳机采用独家开放式驱动技术，包裹在适应体温的透气声学织物中。头带由可回收砂岩复合材料手工制成，触感温润微凉。',
    price: 3299,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000',
    features: ['自然降噪算法', '50小时超长续航', '开放式声场设计']
  },
  {
    id: 'p2',
    name: 'Aura 纪元 (Epoch)',
    tagline: '记录瞬间，而非分钟。',
    description: '为身心健康而设计的腕上器物。陶瓷机身配以纯素皮革表带。',
    longDescription: '时间并非数字的线性叠加，而是情感的流淌。Aura 纪元重新定义了智能腕表，采用类似纸张质感的电子墨水混合屏。',
    price: 2499,
    category: 'Wearable',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
    features: ['身心压力监测', '电子墨水混合显示屏', '7天续航能力']
  },
  {
    id: 'p3',
    name: 'Aura 画布 (Canvas)',
    tagline: '捕捉温润。',
    description: '模拟纸张特性的显示器。护眼屏显，细腻如绢，触之有温。',
    longDescription: '屏幕不应是刺眼的灯泡。Aura 画布采用纳米刻蚀 OLED 面板，能有效散射环境光，营造出类似于高级艺术画册的质感。',
    price: 7999,
    category: 'Mobile',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000',
    features: ['纸感 OLED 面板', '人像摄影镜头', '砂岩肌理背板']
  },
  {
    id: 'p4',
    name: 'Aura 纯粹 (Essence)',
    tagline: '重归自然呼吸。',
    description: '雕塑般的空气净化器。运行寂静无声，在净化空间的同时散发微弱的自然木香。',
    longDescription: '洁净的空气是清醒头脑的基石。Aura 纯粹采用苔藓生物滤网结合 HEPA 技术。',
    price: 4599,
    category: 'Home',
    imageUrl: 'https://images.pexels.com/photos/8092420/pexels-photo-8092420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['生物 HEPA 滤网', '节气香氛系统', '静谧夜间模式']
  }
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 1,
    title: "器物的触感心理学",
    date: "2025年4月12日",
    excerpt: "为何在玻璃与塑料的世界里，我们的指尖依然渴望自然的粗粝？",
    image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&q=80&w=1000",
    content: React.createElement(React.Fragment, null,
      React.createElement("p", { className: "mb-6" }, "指尖是人体神经末梢最密集的地方之一。它们被设计用来阅读一个物体的故事——它的年龄、来源、温度。"),
      React.createElement("blockquote", { className: "border-l-2 border-[#1A1A1A] pl-6 italic my-10 font-serif" }, "“触碰即是感知，感知即是存在。”")
    )
  },
  {
    id: 2,
    title: "留白之美",
    date: "2025年3月28日",
    excerpt: "对话建筑师：空间与寂静的艺术。",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1000",
    content: React.createElement(React.Fragment, null,
      React.createElement("p", null, "“空”并非虚无。在日本建筑中，‘间’的概念是指事物之间的距离——这种停顿赋予了整体形状。")
    )
  }
];

export const BRAND_NAME = 'Aura';
