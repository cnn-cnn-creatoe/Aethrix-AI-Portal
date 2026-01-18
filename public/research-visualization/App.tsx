
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { HeroScene, QuantumComputerScene } from './components/QuantumScene';
import { SurfaceCodeDiagram, TransformerDecoderDiagram, PerformanceMetricDiagram } from './components/Diagrams';
import { ArrowDown, Menu, X, BookOpen } from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const AuthorCard = ({ name, role }: { name: string, role: string }) => {
  return (
    <motion.div 
      variants={fadeInUp}
      className="flex flex-col group items-center p-8 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 w-full max-w-xs hover:border-nobel-gold/50"
    >
      <h3 className="font-serif text-2xl text-slate-50 text-center mb-3">{name}</h3>
      <div className="w-12 h-0.5 bg-nobel-gold mb-4 opacity-60"></div>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed">{role}</p>
    </motion.div>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  // Sections to monitor for scroll-spy
  const sections = ['introduction', 'science', 'impact', 'authors'];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    // Scroll Spy Observer
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Adjust to trigger when section is in the upper middle
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const navLinks = [
    { id: 'introduction', label: '简介' },
    { id: 'science', label: '表面码' },
    { id: 'impact', label: '核心影响' },
    { id: 'authors', label: '研究团队' }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-nobel-gold selection:text-white">
      
      {/* 滚动进度条 */}
      <div 
        className="fixed top-0 left-0 h-1 bg-nobel-gold z-[100] transition-all duration-150 shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* 导航栏 */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-slate-950/90 backdrop-blur-xl shadow-2xl py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-nobel-gold rounded-full flex items-center justify-center text-slate-950 font-serif font-bold text-xl shadow-lg pb-1 group-hover:scale-110 transition-transform">α</div>
            <span className={`font-serif font-bold text-lg tracking-wide transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
              ALPHAQUBIT <span className="font-normal text-slate-500">2024</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide">
            {navLinks.map((link) => (
              <a 
                key={link.id}
                href={`#${link.id}`} 
                onClick={scrollToSection(link.id)} 
                className={`relative py-2 transition-colors duration-300 hover:text-nobel-gold overflow-hidden group ${activeSection === link.id ? 'text-nobel-gold' : 'text-slate-400'}`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-nobel-gold transition-all duration-300 ${activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
            ))}
            <motion.a 
              href="https://doi.org/10.1038/s41586-024-08148-8" 
              target="_blank" 
              rel="noopener noreferrer" 
              whileTap={{ scale: 0.9, opacity: 0.5 }}
              className="px-6 py-2.5 bg-slate-50 text-slate-950 rounded-full hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer font-bold"
            >
              查阅论文
            </motion.a>
          </div>

          <button className="md:hidden text-slate-100 p-2 hover:bg-slate-900 rounded-lg transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-slate-950 flex flex-col items-center justify-center gap-10 text-2xl font-serif"
          >
              <button className="absolute top-8 right-8 text-slate-400" onClick={() => setMenuOpen(false)}>
                <X size={32} />
              </button>
              {navLinks.map((link) => (
                <a 
                  key={link.id}
                  href={`#${link.id}`} 
                  onClick={scrollToSection(link.id)} 
                  className={`transition-colors ${activeSection === link.id ? 'text-nobel-gold' : 'hover:text-nobel-gold text-slate-400'}`}
                >
                  {link.label}
                </a>
              ))}
              <motion.a 
                href="https://doi.org/10.1038/s41586-024-08148-8" 
                target="_blank" 
                rel="noopener noreferrer" 
                whileTap={{ scale: 0.9, opacity: 0.5 }}
                onClick={() => setMenuOpen(false)} 
                className="px-10 py-4 bg-nobel-gold text-slate-950 rounded-full shadow-2xl cursor-pointer font-bold mt-4"
              >
                论文详情
              </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 英雄板块 */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroScene />
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(2,6,23,0.8)_0%,rgba(2,6,23,0.6)_50%,rgba(2,6,23,0.9)_100%)]" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="inline-block mb-4 px-4 py-1 border border-nobel-gold/40 text-nobel-gold text-xs tracking-[0.2em] uppercase font-bold rounded-full backdrop-blur-sm bg-slate-900/30"
          >
            《自然》期刊 • 2024年11月
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-tight md:leading-[1.1] mb-8 text-white drop-shadow-2xl"
          >
            AlphaQubit <br/><span className="italic font-normal text-slate-400 text-3xl md:text-5xl block mt-4">人工智能引领量子纠错</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-12"
          >
            一种基于递归 Transformer 的神经网络，以前所未有的精度学习并解码量子表面码。
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex justify-center"
          >
             <a href="#introduction" onClick={scrollToSection('introduction')} className="group flex flex-col items-center gap-2 text-sm font-medium text-slate-500 hover:text-white transition-colors cursor-pointer">
                <span>探索发现</span>
                <span className="p-3 border border-slate-800 rounded-full group-hover:border-nobel-gold transition-colors bg-slate-900/50 shadow-inner">
                    <ArrowDown size={18} />
                </span>
             </a>
          </motion.div>
        </div>
      </header>

      <main>
        {/* 简介 */}
        <motion.section 
          id="introduction" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="py-32 bg-slate-950 border-y border-slate-900"
        >
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">简介</div>
              <h2 className="font-serif text-4xl mb-6 leading-tight text-white">跨越噪声屏障</h2>
              <div className="w-16 h-1 bg-nobel-gold mb-6"></div>
            </div>
            <div className="md:col-span-8 text-lg text-slate-400 leading-relaxed space-y-6">
              <p>
                <span className="text-6xl float-left mr-4 mt-[-8px] font-serif text-nobel-gold">构</span>建大规模量子计算机的核心在于纠正物理系统中不可避免产生的错误。目前的领先方案是<strong>表面码 (Surface Code)</strong>，它通过在多个物理量子比特之间冗余编码信息来保护量子态。
              </p>
              <p>
                然而，解释这些代码中携带噪声的信号（即“解码”）是一项巨大挑战。串扰和泄漏等复杂噪声效应常使标准算法失效。<strong className="text-slate-100 font-medium">AlphaQubit</strong> 利用机器学习直接从量子处理器中学习复杂的错误模式，实现了远超人类设计算法的精度。
              </p>
            </div>
          </div>
        </motion.section>

        {/* 科学原理: 表面码 */}
        <section id="science" className="py-32 bg-[#020617]">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeInUp}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-slate-300 text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-slate-800">
                            < BookOpen size={14}/> 核心系统
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">量子表面码</h2>
                        <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                           在表面码中，“数据量子比特”负责存储量子信息，而散布其中的“稳定子量子比特”则扮演监视者的角色。它们执行宇称检查（X 型和 Z 型）以检测错误，而不会破坏微妙的量子态。
                        </p>
                        <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                            当数据量子比特发生翻转时，相邻的稳定子会“点亮”。这种点亮模式被称为“校验子 (Syndrome)”。解码器的任务就是观察校验子并推断发生了哪些错误。
                        </p>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="relative"
                    >
                        <div className="absolute inset-0 bg-nobel-gold/5 blur-[100px] rounded-full"></div>
                        <SurfaceCodeDiagram />
                    </motion.div>
                </div>
            </div>
        </section>

        {/* 科学原理: Transformer */}
        <section className="py-32 bg-slate-950 text-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="w-[500px] h-[500px] rounded-full bg-slate-800 blur-[150px] absolute top-[-200px] left-[-200px]"></div>
                <div className="w-[500px] h-[500px] rounded-full bg-nobel-gold/10 blur-[150px] absolute bottom-[-200px] right-[-200px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                     <motion.div 
                       initial={{ opacity: 0, x: -30 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.8 }}
                       className="order-2 lg:order-1"
                     >
                        <TransformerDecoderDiagram />
                     </motion.div>
                     <motion.div 
                       initial="hidden"
                       whileInView="visible"
                       viewport={{ once: true }}
                       variants={fadeInUp}
                       className="order-1 lg:order-2"
                     >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-nobel-gold text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-slate-700">
                            核心创新
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">神经解码技术</h2>
                        <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                            传统解码器假设错误是简单且独立的。但真实硬件环境要复杂得多。AlphaQubit 将解码视为一个序列预测问题，采用了<strong>递归 Transformer (Recurrent Transformer)</strong> 架构。
                        </p>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            它摄取稳定子测量的历史记录，并利用“软”模拟信息——即概率而非简单的 0 和 1——对逻辑错误做出高度准确的预测。
                        </p>
                     </motion.div>
                </div>
            </div>
        </section>

        {/* 结果展示 */}
        <section className="py-32 bg-[#020617]">
            <div className="container mx-auto px-6">
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className="max-w-4xl mx-auto text-center mb-16"
                >
                    <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">性能超越行业标准</h2>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        AlphaQubit 在 Google 的 Sycamore 处理器及高精度模拟器上进行了测试。它始终优于行业标准的“最小权重完美匹配 (MWPM)”算法，实际上让量子计算机的表现比其实际硬件水平更“洁净”。
                    </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="max-w-4xl mx-auto"
                >
                    <PerformanceMetricDiagram />
                </motion.div>
            </div>
        </section>

        {/* 影响 */}
        <section id="impact" className="py-32 bg-slate-950 border-t border-slate-900">
             <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2 }}
                  className="md:col-span-5 relative"
                >
                    <div className="aspect-square bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-800 shadow-2xl">
                        <QuantumComputerScene />
                        <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-slate-500 font-serif italic">Sycamore 处理器冷冻环境模拟</div>
                    </div>
                </motion.div>
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className="md:col-span-7 flex flex-col justify-center"
                >
                    <div className="inline-block mb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">深远影响</div>
                    <h2 className="font-serif text-4xl mb-6 text-white">迈向容错计算时代</h2>
                    <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                        即使代码距离 (Code Distance) 增加到 11，AlphaQubit 依然能保持其优势。它能够处理包括串扰和泄漏在内的真实噪声——这些效应通常会让传统解码器彻底失效。
                    </p>
                    <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                        通过直接从数据中学习，机器学习解码器可以适应每个量子处理器的独特个性，从而有可能降低实现实用量子计算所需的硬件门槛。
                    </p>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl border-l-4 border-l-nobel-gold shadow-xl"
                    >
                        <p className="font-serif italic text-xl text-slate-100 mb-4 leading-relaxed">
                            “我们的工作展示了机器学习通过直接从数据中学习，能够超越人类设计的算法，凸显了机器学习作为量子计算机解码强有力竞争者的潜力。”
                        </p>
                        <span className="text-sm font-bold text-slate-500 tracking-wider uppercase">— Bausch 等人，《自然》(2024)</span>
                    </motion.div>
                </motion.div>
             </div>
        </section>

        {/* 作者团队 */}
        <section id="authors" className="py-32 bg-[#020617] border-t border-slate-900">
           <div className="container mx-auto px-6">
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className="text-center mb-16"
                >
                    <div className="inline-block mb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">研究团队</div>
                    <h2 className="font-serif text-3xl md:text-5xl mb-4 text-white">主要贡献者</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">Google DeepMind 与 Google Quantum AI 的深度协作结晶。</p>
                </motion.div>
                
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={staggerContainer}
                  className="flex flex-col md:flex-row gap-8 justify-center items-center flex-wrap"
                >
                    <AuthorCard name="Johannes Bausch" role="Google DeepMind" />
                    <AuthorCard name="Andrew W. Senior" role="Google DeepMind" />
                    <AuthorCard name="Francisco J. H. Heras" role="Google DeepMind" />
                    <AuthorCard name="Thomas Edlich" role="Google DeepMind" />
                    <AuthorCard name="Alex Davies" role="Google DeepMind" />
                    <AuthorCard name="Michael Newman" role="Google Quantum AI" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 }}
                  className="text-center mt-12"
                >
                    <p className="text-slate-500 italic">以及在硬件、理论和工程方面做出贡献的众多团队成员。</p>
                </motion.div>
           </div>
        </section>

      </main>

      <footer className="bg-slate-950 text-slate-500 py-20 border-t border-slate-900">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
                <div className="text-white font-serif font-bold text-2xl mb-2 flex items-center gap-2">
                    <div className="w-6 h-6 bg-nobel-gold rounded-full flex items-center justify-center text-slate-950 text-xs">α</div>
                    AlphaQubit
                </div>
                <p className="text-sm">可视化探索《学习量子处理器的高精度错误解码》</p>
            </div>
        </div>
        <div className="text-center mt-12 text-xs text-slate-600">
            基于 2024 年发表于《自然》的研究成果。由 AI 辅助生成。
        </div>
      </footer>
    </div>
  );
};

export default App;
