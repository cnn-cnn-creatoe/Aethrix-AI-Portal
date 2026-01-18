
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '哟呼~！欢迎来到荧光动漫节！02和雷姆她们都在等你了哦~ 我是 Lumi-chan，有什么想问的吗？ ( *︾▽︾)' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => { scrollToBottom(); }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { role: 'user', text: input }]);
    setInput('');
    setIsLoading(true);
    const response = await sendMessageToGemini(input);
    setMessages(p => [...p, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.8 }} className="mb-6 w-[85vw] md:w-[400px] bg-[#1a0b2e]/98 backdrop-blur-3xl border-4 border-[#ff7eb9] rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(255,126,185,0.4)]">
            <div className="bg-gradient-to-r from-[#ff7eb9] to-[#7afbff] p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-[#ff7eb9] shadow-inner">L</div>
                <h3 className="font-black text-white italic tracking-widest text-lg uppercase">LUMI-CHAN</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors bg-white/10 p-1 rounded-lg"><X size={24} /></button>
            </div>

            <div ref={chatContainerRef} className="h-96 overflow-y-auto p-8 space-y-6 bg-white/[0.02]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl text-lg font-medium shadow-sm ${msg.role === 'user' ? 'bg-[#ff7eb9] text-white rounded-tr-none' : 'bg-white/10 text-white/90 rounded-tl-none border border-white/10'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && <div className="flex gap-2 p-4 bg-white/5 rounded-2xl w-fit"><motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="w-2 h-2 bg-[#ff7eb9] rounded-full" /> <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-[#7afbff] rounded-full" /></div>}
            </div>

            <div className="p-6 border-t border-white/5">
              <div className="flex gap-4 items-center">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="跟我聊聊二次元吧~" className="flex-1 bg-white/5 text-white rounded-2xl px-6 py-4 focus:outline-none border border-white/10 placeholder:text-white/20" />
                <button onClick={handleSend} disabled={isLoading} className="bg-[#ff7eb9] p-4 rounded-2xl hover:scale-110 active:scale-90 transition-all shadow-lg"><Send size={24} color="white" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)} className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#ff7eb9] to-[#7afbff] flex items-center justify-center shadow-[0_15px_50px_rgba(255,126,185,0.5)] z-50 border-4 border-white">
        <Sparkles size={36} color="white" />
      </motion.button>
    </div>
  );
};

export default AIChat;
