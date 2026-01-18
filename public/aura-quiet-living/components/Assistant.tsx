
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '您好，欢迎来到 Aura。我是您的专属管家。在此静谧的空间里，有什么我可以为您效劳的吗？', timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendMessageToGemini(history, userMsg.text);
      const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-[#FAF9F6] border border-[#1A1A1A]/10 shadow-2xl w-[90vw] sm:w-[400px] h-[600px] mb-6 flex flex-col overflow-hidden animate-fade-in-up">
          <div className="bg-[#1A1A1A] p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <span className="font-serif italic text-[#FAF9F6] text-xl tracking-widest">礼宾室</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-6 text-sm leading-relaxed tracking-wider font-light ${
                    msg.role === 'user' ? 'bg-[#1A1A1A] text-white' : 'bg-white border border-[#1A1A1A]/5 text-[#5D5A53]'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isThinking && <div className="text-xs text-[#1A1A1A]/30 italic animate-pulse">管家正在思考...</div>}
          </div>

          <div className="p-6 bg-[#FAF9F6] border-t border-[#1A1A1A]/5">
            <div className="flex gap-4">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="请留言..." 
                className="flex-1 bg-transparent border-b border-[#1A1A1A]/10 focus:border-[#1A1A1A] py-2 text-sm outline-none transition-colors"
              />
              <button onClick={handleSend} className="text-[#1A1A1A] hover:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="bg-[#1A1A1A] text-white w-16 h-16 flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-700">
        {isOpen ? '✕' : <span className="font-serif italic text-xl">Aura</span>}
      </button>
    </div>
  );
};

export default Assistant;
