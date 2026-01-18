
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { Ticket, Globe, Zap, Music, MapPin, Menu, X, Calendar, Camera, Sparkles, Heart, Star } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ArtistCard from './components/ArtistCard';
import AIChat from './components/AIChat';
import { Artist } from './types';

// 更新为更具代表性的动漫角色图像链接
const LINEUP: Artist[] = [
  { 
    id: '02', 
    name: '02 / Zero Two', 
    genre: '《DARLING in the FRANXX》', 
    day: '10.24 FRI', 
    image: 'https://images.pexels.com/photos/15455296/pexels-photo-15455296.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: '身披红色的神秘少女，拥有“搭档杀手”之称。她性格奔放且执着，渴望变成人类。在荧光节现场，她将作为次元守护者现身！'
  },
  { 
    id: 'rikka', 
    name: '小鸟游六花', 
    genre: '《中二病也要谈恋爱！》', 
    day: '10.24 FRI', 
    image: 'https://images.pexels.com/photos/15501865/pexels-photo-15501865.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: '邪王真眼的使者！佩戴眼罩的重度中二病少女，始终寻找着“不可视境界线”。小心，她可能会在现场发动黑炎龙之力哦！'
  },
  { 
    id: 'rem', 
    name: '雷姆 / Rem', 
    genre: '《Re:从零开始的异世界生活》', 
    day: '10.25 SAT', 
    image: 'https://images.pexels.com/photos/15455301/pexels-photo-15455301.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: '罗兹瓦尔宅邸的女仆，拥有鬼族血统的温柔少女。她的笑容是异世界最温暖的阳光。快来领取属于她的专属应援礼。'
  },
  { 
    id: 'mai', 
    name: '樱岛麻衣', 
    genre: '《兔女郎学姐》系列', 
    day: '10.25 SAT', 
    image: 'https://images.pexels.com/photos/15501863/pexels-photo-15501863.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: '超人气明星学姐。因“青春期综合征”曾变得无人可见，但她那份坚韧与成熟的魅力依然璀璨。她是全场最受瞩目的女王。'
  },
  { 
    id: 'marin', 
    name: '喜多川海梦', 
    genre: '《更衣人偶坠入爱河》', 
    day: '10.26 SUN', 
    image: 'https://images.pexels.com/photos/15455291/pexels-photo-15455291.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: '活泼开朗、热衷于 Cosplay 的辣妹！她对爱好的赤诚之心能感染每一个人。漫展现场她将展示多套华丽的 Cos 战袍！'
  },
  { 
    id: 'violet', 
    name: '薇尔莉特', 
    genre: '《薇尔莉特·伊芙加登》', 
    day: '10.26 SUN', 
    image: 'https://images.pexels.com/photos/15501867/pexels-photo-15501867.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: '曾经的兵器，现在的自动手记人偶。她在寻找“爱”的真意。在次元体验区，她将亲自为您书写跨越时空的信件。'
  },
];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [purchasingIndex, setPurchasingIndex] = useState<number | null>(null);
  const [purchasedIndex, setPurchasedIndex] = useState<number | null>(null);

  // 优化滚动逻辑：减小偏移量，确保标题对齐
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90; // 适配紧凑后的导航栏
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const navigateArtist = (direction: 'next' | 'prev') => {
    if (!selectedArtist) return;
    const currentIndex = LINEUP.findIndex(a => a.id === selectedArtist.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % LINEUP.length;
    } else {
      nextIndex = (currentIndex - 1 + LINEUP.length) % LINEUP.length;
    }
    setSelectedArtist(LINEUP[nextIndex]);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) navigateArtist('next');
    else if (info.offset.x > threshold) navigateArtist('prev');
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-[#ff7eb9] selection:text-white cursor-auto md:cursor-none overflow-x-hidden bg-[#0a0514]">
      <CustomCursor />
      <FluidBackground />
      <AIChat />
      
      {/* 顶部导航 - Logo 修改为中文 */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-6 mix-blend-difference">
        <div className="font-heading text-2xl md:text-3xl font-black tracking-tighter text-[#ff7eb9] cursor-default z-50 italic">
          荧光 <span className="text-white">动漫节</span>
        </div>
        
        <div className="hidden md:flex gap-10 text-sm font-bold tracking-[0.2em] uppercase">
          {[{ label: '次元嘉宾', id: 'lineup' }, { label: '次元体验', id: 'experience' }, { label: '购票通道', id: 'tickets' }].map((item) => (
            <button key={item.id} onClick={() => scrollToSection(item.id)} className="hover:text-[#ff7eb9] transition-colors text-white cursor-pointer bg-transparent" data-hover="true">
              {item.label}
            </button>
          ))}
        </div>
        
        <button onClick={() => scrollToSection('tickets')} className="hidden md:inline-block border-2 border-[#ff7eb9] text-[#ff7eb9] px-8 py-2 text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#ff7eb9] hover:text-white transition-all duration-300 cursor-pointer rounded-full backdrop-blur-md" data-hover="true">
          获取入场券
        </button>

        <button className="md:hidden text-white z-50 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
           {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 z-30 bg-[#1a0b2e] flex flex-col items-center justify-center gap-10 md:hidden">
            {[{ label: '次元嘉宾', id: 'lineup' }, { label: '次元体验', id: 'experience' }, { label: '购票通道', id: 'tickets' }].map((item) => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-4xl font-black text-white hover:text-[#ff7eb9] italic uppercase">{item.label}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - 缩减间距，更精简 */}
      <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-10">
        <motion.div style={{ y, opacity }} className="z-10 text-center flex flex-col items-center w-full max-w-6xl">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="mb-4 flex flex-col items-center">
            <div className="bg-[#ff7eb9] text-white px-6 py-2 font-black text-base skew-x-[-12deg] mb-2 shadow-[8px_8px_0px_#7afbff]">
              2025.10.24 - 10.26
            </div>
            <div className="text-[#7afbff] font-mono tracking-[0.4em] text-xs uppercase">TOKYO NEON DISTRICT</div>
          </motion.div>

          <div className="relative py-1 px-4 w-full flex justify-center">
            <GradientText text="荧光动漫节" className="text-[14vw] md:text-[10vw] font-black italic drop-shadow-[0_10px_30px_rgba(255,126,185,0.4)]" />
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-lg md:text-2xl font-medium max-w-2xl mx-auto text-white/80 leading-relaxed mt-6 mb-20">
            这是一场连接 <span className="text-[#ff7eb9] font-black">现实</span> 与 <span className="text-[#7afbff] font-black">幻想</span> 的次元风暴
          </motion.p>
        </motion.div>

        {/* 底部跑马灯 */}
        <div className="absolute bottom-0 left-0 w-full py-8 bg-[#ff7eb9] text-white z-20 overflow-hidden skew-y-[-2deg] translate-y-4 shadow-[0_-10px_40px_rgba(255,126,185,0.4)] border-t-2 border-[#7afbff]">
          <motion.div className="flex w-fit" animate={{ x: "-50%" }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
            {[0, 1].map((k) => (
              <div key={k} className="flex whitespace-nowrap shrink-0">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-2xl md:text-4xl font-black px-12 flex items-center gap-8">
                    ANIME FEST 2025 <Sparkles className="text-[#7afbff]" size={32} /> 次元觉醒 ● 应援无限 ● 圣地巡礼 ●
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* 嘉宾区域 */}
      <section id="lineup" className="relative z-10 py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-20 relative">
             <h2 className="text-7xl md:text-[10rem] font-black italic text-white/5 absolute -top-12 left-0 leading-none pointer-events-none">GUESTS</h2>
             <h2 className="text-5xl md:text-7xl font-black italic relative z-10 text-white flex items-center gap-6">
               次元 <span className="text-[#ff7eb9]">嘉宾</span> <Star className="text-[#7afbff] fill-[#7afbff]" />
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LINEUP.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} onClick={() => setSelectedArtist(artist)} />
            ))}
          </div>
        </div>
      </section>

      {/* 体验区域 */}
      <section id="experience" className="relative z-10 py-32 bg-white/[0.01] backdrop-blur-3xl overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-5xl md:text-7xl font-black italic mb-10">次元 <br/> <span className="text-[#7afbff]">体验</span></h2>
              <p className="text-lg md:text-xl text-white/50 mb-12 leading-relaxed">
                在这里，你不仅是观众，更是主角。穿上你的战袍，步入这场前所未有的二次元狂欢。
              </p>
              
              <div className="space-y-10">
                {[
                  { icon: Camera, title: 'COSPLAY 幻境', desc: '顶级摄影师团队驻场，记录你的次元变身时刻。' },
                  { icon: Globe, title: '次元夜市', desc: '来自秋叶原的限定周边与动漫主题美食。' },
                  { icon: Heart, title: '应援之魂', desc: '全息光棒应援区，感受万人同频的燃点。' },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-8 group">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#ff7eb9] to-[#7afbff] shadow-[5px_5px_15px_rgba(255,126,185,0.3)] group-hover:scale-110 transition-transform">
                      <f.icon size={28} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black mb-2 italic">{f.title}</h4>
                      <p className="text-base text-white/40">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 h-[400px] md:h-[600px] relative">
               <div className="absolute inset-0 bg-[#ff7eb9]/10 blur-[100px]" />
               <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-2 border-white/10 group shadow-xl">
                 <img src="https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000&auto=format&fit=crop" className="h-full w-full object-cover transition-transform duration-[4s] group-hover:scale-110" alt="体验区" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0d0221] via-transparent to-transparent" />
                 <div className="absolute bottom-10 left-10">
                   <div className="text-8xl font-black text-white/5 italic select-none">ZONE S</div>
                   <div className="text-2xl font-black italic text-[#7afbff] mt-2">主舞台 · 次元突破</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 购票区域 */}
      <section id="tickets" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-6xl md:text-[8rem] font-black italic opacity-5 mb-16 pointer-events-none uppercase">Ticket Office</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: '单日入门票', price: '¥380', color: 'border-white/10' },
              { name: '三日连票', price: '¥880', color: 'border-[#7afbff] shadow-[0_0_30px_rgba(122,251,255,0.1)]' },
              { name: 'VIP 限定票', price: '¥1680', color: 'border-[#ff7eb9] shadow-[0_0_30px_rgba(255,126,185,0.1)]' },
            ].map((t, i) => (
              <motion.div key={i} whileHover={{ y: -15 }} className={`p-10 border-2 rounded-[2.5rem] bg-[#1a0b2e]/40 backdrop-blur-xl flex flex-col items-center transition-all duration-500 ${t.color}`}>
                <h3 className="text-2xl font-black mb-4 italic">{t.name}</h3>
                <div className="text-6xl font-black mb-8 text-[#ff7eb9] drop-shadow-[0_0_10px_rgba(255,126,185,0.3)]">{t.price}</div>
                <ul className="space-y-4 text-white/40 mb-10 text-base text-left w-full">
                  <li className="flex items-center gap-2"><Star size={14} className="text-[#7afbff]" /> 全展馆通行权限</li>
                  <li className="flex items-center gap-2"><Star size={14} className="text-[#7afbff]" /> 限定应援礼包</li>
                  {i > 0 && <li className="text-[#7afbff] flex items-center gap-2"><Star size={14} /> 嘉宾握手会资格</li>}
                  {i > 1 && <li className="text-[#ff7eb9] flex items-center gap-2"><Star size={14} /> 专属前排席位</li>}
                </ul>
                <button onClick={() => setPurchasedIndex(i)} className="w-full py-4 rounded-full bg-white text-black font-black text-lg hover:bg-[#ff7eb9] hover:text-white transition-all transform active:scale-95">
                  {purchasedIndex === i ? '传送门已开启' : '立即抢购'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="relative z-10 border-t border-white/5 py-24 bg-[#050110]">
        <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <div className="font-heading text-4xl font-black text-[#ff7eb9] italic mb-4">LUMINA</div>
            <p className="text-white/20 italic text-lg text-center md:text-left">在这异次元的终点，我们终将重逢。</p>
          </div>
          <div className="flex gap-8 font-black italic uppercase text-lg">
            <a href="#" className="hover:text-[#7afbff] transition-colors">Bilibili</a>
            <a href="#" className="hover:text-[#ff7eb9] transition-colors">Weibo</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>

      {/* 角色详情 */}
      <AnimatePresence>
        {selectedArtist && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedArtist(null)} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0d0221]/98 backdrop-blur-3xl">
            <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} onClick={(e) => e.stopPropagation()} drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={handleDragEnd} className="relative w-full max-w-5xl bg-[#1a0b2e] border-2 border-white/10 overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(255,126,185,0.2)] rounded-[3rem]">
              <button onClick={() => setSelectedArtist(null)} className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/5 hover:bg-[#ff7eb9] transition-all"><X size={28} /></button>
              <div className="w-full md:w-1/2 h-[350px] md:h-auto relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img key={selectedArtist.id} src={selectedArtist.image} className="absolute inset-0 w-full h-full object-cover" initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-transparent" />
              </div>
              <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                <motion.div key={selectedArtist.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                  <div className="bg-[#7afbff] text-black px-4 py-1 inline-block font-black skew-x-[-12deg] mb-6 shadow-[4px_4px_0px_#ff7eb9]">{selectedArtist.day}</div>
                  <h3 className="text-5xl md:text-6xl font-black italic mb-4 leading-tight">{selectedArtist.name}</h3>
                  <p className="text-xl text-[#ff7eb9] font-black italic mb-8 tracking-widest uppercase">{selectedArtist.genre}</p>
                  <p className="text-white/50 leading-relaxed text-lg font-light mb-12">{selectedArtist.description}</p>
                </motion.div>
                <div className="flex gap-3">
                   {LINEUP.map((a) => (
                     <button key={a.id} onClick={() => setSelectedArtist(a)} className={`h-2 transition-all rounded-full ${selectedArtist.id === a.id ? 'w-12 bg-[#ff7eb9]' : 'w-4 bg-white/10'}`} />
                   ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
