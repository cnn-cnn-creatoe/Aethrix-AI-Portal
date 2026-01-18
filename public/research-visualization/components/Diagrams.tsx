
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, Cpu, BarChart2 } from 'lucide-react';

// --- SURFACE CODE DIAGRAM ---
export const SurfaceCodeDiagram: React.FC = () => {
  const [errors, setErrors] = useState<number[]>([]);
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { once: true });
  
  const adjacency: Record<number, number[]> = {
    0: [0, 1],
    1: [0, 2],
    2: [1, 3],
    3: [2, 3],
    4: [0, 1, 2, 3],
  };

  const toggleError = (id: number) => {
    setErrors(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const activeStabilizers = [0, 1, 2, 3].filter(stabId => {
    let errorCount = 0;
    Object.entries(adjacency).forEach(([dataId, stabs]) => {
        if (errors.includes(parseInt(dataId)) && stabs.includes(stabId)) {
            errorCount++;
        }
    });
    return errorCount % 2 !== 0;
  });

  return (
    <div ref={containerRef} className="flex flex-col items-center p-8 bg-slate-900/40 rounded-2xl shadow-2xl border border-slate-800 my-8">
      <h3 className="font-serif text-xl mb-4 text-white text-center">交互演示：表面码错误检测</h3>
      <p className="text-sm text-slate-400 mb-8 text-center max-w-md">
        点击灰色的 <strong>数据量子比特</strong> 注入错误。观察彩色 <strong>稳定子</strong> 在检测到奇数个错误时如何点亮。
      </p>
      
      <div className="relative w-72 h-72 bg-slate-950/50 rounded-2xl border border-slate-800 p-6 flex flex-wrap justify-between content-between">
         <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
            <div className="w-2/3 h-2/3 border border-slate-400"></div>
            <div className="absolute w-full h-[1px] bg-slate-400"></div>
            <div className="absolute h-full w-[1px] bg-slate-400"></div>
         </div>

         {[
             {id: 0, x: '50%', y: '20%', type: 'Z', color: 'bg-cyan-500'},
             {id: 1, x: '20%', y: '50%', type: 'X', color: 'bg-amber-500'},
             {id: 2, x: '80%', y: '50%', type: 'X', color: 'bg-amber-500'},
             {id: 3, x: '50%', y: '80%', type: 'Z', color: 'bg-cyan-500'},
         ].map(stab => (
             <motion.div
                key={`stab-${stab.id}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: activeStabilizers.includes(stab.id) ? 1.1 : 1, opacity: activeStabilizers.includes(stab.id) ? 1 : 0.2 } : {}}
                transition={{ type: "spring", stiffness: 200, delay: stab.id * 0.1 }}
                className={`absolute w-12 h-12 -ml-6 -mt-6 flex items-center justify-center text-slate-950 text-sm font-bold rounded-lg shadow-xl transition-all duration-300 ${activeStabilizers.includes(stab.id) ? stab.color + ' ring-4 ring-offset-2 ring-slate-900 ring-offset-slate-950' : 'bg-slate-800'}`}
                style={{ left: stab.x, top: stab.y }}
             >
                 {stab.type}
             </motion.div>
         ))}

         {[
             {id: 0, x: '20%', y: '20%'}, {id: 1, x: '80%', y: '20%'},
             {id: 4, x: '50%', y: '50%'}, 
             {id: 2, x: '20%', y: '80%'}, {id: 3, x: '80%', y: '80%'},
         ].map(q => (
             <motion.button
                key={`data-${q.id}`}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.5 + q.id * 0.05 }}
                onClick={() => toggleError(q.id)}
                className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 z-10 ${errors.includes(q.id) ? 'bg-white border-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-400'}`}
                style={{ left: q.x, top: q.y }}
             >
                {errors.includes(q.id) ? <Activity size={18} /> : <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />}
             </motion.button>
         ))}
      </div>

      <div className="mt-8 flex items-center gap-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white"></div> 错误发生</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-cyan-500"></div> Z-宇称校验</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500"></div> X-宇称校验</div>
      </div>
      
      <div className="mt-6 h-6 text-sm font-serif italic text-slate-400">
        {errors.length === 0 ? "系统运行稳定。" : `检测到 ${activeStabilizers.length} 处宇称违背。`}
      </div>
    </div>
  );
};

// --- TRANSFORMER DECODER DIAGRAM ---
export const TransformerDecoderDiagram: React.FC = () => {
  const [step, setStep] = useState(0);
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
        setStep(s => (s + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div ref={containerRef} className="flex flex-col items-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800 my-8 shadow-2xl">
      <h3 className="font-serif text-xl mb-4 text-white">AlphaQubit 架构演进</h3>
      <p className="text-sm text-slate-400 mb-8 text-center max-w-md">
        模型利用递归 Transformer 处理校验子历史，捕获空间与时间的相关性。
      </p>

      <div className="relative w-full max-w-lg h-60 bg-slate-950 rounded-2xl shadow-inner overflow-hidden mb-8 border border-slate-800 flex items-center justify-center gap-8 p-6">
        
        {/* Input Stage */}
        <div className="flex flex-col items-center gap-3">
            <motion.div 
              animate={step === 0 ? { scale: 1.1, borderColor: '#EAB308' } : { scale: 1, borderColor: '#1e293b' }}
              className={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-500 ${step === 0 ? 'bg-nobel-gold/10' : 'bg-slate-900/50'}`}
            >
                <div className="grid grid-cols-3 gap-1.5">
                    {[...Array(9)].map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${Math.random() > 0.6 ? 'bg-nobel-gold' : 'bg-slate-700'}`}></div>)}
                </div>
            </motion.div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">校验子输入</span>
        </div>

        <motion.div animate={{ opacity: step >= 1 ? 1 : 0.2, scale: step >= 1 ? 1.2 : 1 }} className="text-slate-600">→</motion.div>

        {/* Transformer Stage */}
        <div className="flex flex-col items-center gap-3">
             <motion.div 
               animate={(step === 1 || step === 2) ? { scale: 1.1, borderColor: '#EAB308' } : { scale: 1, borderColor: '#1e293b' }}
               className={`w-28 h-28 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-500 relative overflow-hidden ${(step === 1 || step === 2) ? 'bg-slate-900 text-white shadow-[0_0_30px_rgba(234,179,8,0.1)]' : 'bg-slate-900/50'}`}
             >
                <Cpu size={32} className={(step === 1 || step === 2) ? 'text-nobel-gold animate-pulse' : 'text-slate-700'} />
                {step === 1 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[1px] bg-nobel-gold/50 absolute top-1/3 animate-ping"></div>
                        <div className="w-full h-[1px] bg-nobel-gold/50 absolute top-2/3 animate-ping delay-100"></div>
                    </div>
                )}
             </motion.div>
             <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Transformer 处理</span>
        </div>

        <motion.div animate={{ opacity: step >= 3 ? 1 : 0.2, scale: step >= 3 ? 1.2 : 1 }} className="text-slate-600">→</motion.div>

        {/* Output Stage */}
        <div className="flex flex-col items-center gap-3">
            <motion.div 
              animate={step === 3 ? { scale: 1.1, borderColor: '#10b981' } : { scale: 1, borderColor: '#1e293b' }}
              className={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-500 ${step === 3 ? 'bg-emerald-500/10' : 'bg-slate-900/50'}`}
            >
                {step === 3 ? (
                    <span className="text-3xl font-serif text-emerald-400">纠正</span>
                ) : (
                    <span className="text-3xl font-serif text-slate-800">?</span>
                )}
            </motion.div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">纠正输出</span>
        </div>

      </div>

      <div className="flex gap-3">
          {[0, 1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step === s ? 'w-10 bg-nobel-gold' : 'w-3 bg-slate-800'}`}></div>
          ))}
      </div>
    </div>
  );
};

// --- PERFORMANCE CHART ---
export const PerformanceMetricDiagram: React.FC = () => {
    const [distance, setDistance] = useState<3 | 5 | 11>(5);
    const containerRef = React.useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });
    
    const data = {
        3: { mwpm: 3.5, alpha: 2.9 },
        5: { mwpm: 3.6, alpha: 2.75 },
        11: { mwpm: 0.0041, alpha: 0.0009 } 
    };

    const currentData = data[distance];
    const maxVal = Math.max(currentData.mwpm, currentData.alpha) * 1.3;
    
    const formatValue = (val: number) => {
        if (val < 0.01) return val.toFixed(4) + '%';
        return val.toFixed(2) + '%';
    }

    return (
        <div ref={containerRef} className="flex flex-col md:flex-row gap-12 items-center p-10 bg-slate-900 text-slate-100 rounded-3xl my-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="flex-1 min-w-[280px] relative z-10">
                <h3 className="font-serif text-2xl mb-3 text-nobel-gold">深度性能对比</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    AlphaQubit 的逻辑错误率 (LER) 始终显著低于标准的“最小权重完美匹配 (MWPM)”解码器。
                </p>
                <div className="flex gap-3 mt-8">
                    {[3, 5, 11].map((d) => (
                        <button 
                            key={d}
                            onClick={() => setDistance(d as any)} 
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 border ${distance === d ? 'bg-nobel-gold text-slate-950 border-nobel-gold shadow-lg shadow-nobel-gold/20' : 'bg-slate-950/50 text-slate-500 border-slate-800 hover:border-slate-600 hover:text-slate-200'}`}
                        >
                            代码距离 {d}
                        </button>
                    ))}
                </div>
                <div className="mt-8 font-mono text-[10px] text-slate-500 flex items-center gap-3 tracking-[0.2em]">
                    <BarChart2 size={16} className="text-nobel-gold" /> 
                    <span>逻辑错误率（越低越好）</span>
                </div>
            </div>
            
            <div className="relative w-72 h-80 bg-slate-950/80 rounded-2xl border border-slate-800/50 p-8 flex justify-around items-end shadow-inner">
                <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none opacity-5">
                   {[...Array(5)].map((_, i) => <div key={i} className="w-full h-[1px] bg-slate-100"></div>)}
                </div>

                {/* MWPM Bar */}
                <div className="w-24 flex flex-col justify-end items-center h-full z-10">
                    <div className="flex-1 w-full flex items-end justify-center relative mb-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            className="absolute -top-7 w-full text-center text-xs font-mono text-slate-400 font-bold bg-slate-900/80 py-1 rounded border border-slate-800"
                        >
                            {formatValue(currentData.mwpm)}
                        </motion.div>
                        <motion.div 
                            className="w-full bg-slate-800 rounded-t-lg border-t border-x border-slate-700"
                            initial={{ height: 0 }}
                            animate={isInView ? { height: `${(currentData.mwpm / maxVal) * 100}%` } : {}}
                            transition={{ type: "spring", stiffness: 60, damping: 20 }}
                        />
                    </div>
                    <div className="h-6 flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">行业标准</div>
                </div>

                {/* AlphaQubit Bar */}
                <div className="w-24 flex flex-col justify-end items-center h-full z-10">
                     <div className="flex-1 w-full flex items-end justify-center relative mb-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            className="absolute -top-7 w-full text-center text-xs font-mono text-nobel-gold font-bold bg-slate-900/80 py-1 rounded border border-nobel-gold/30 shadow-lg"
                        >
                            {formatValue(currentData.alpha)}
                        </motion.div>
                        <motion.div 
                            className="w-full bg-nobel-gold rounded-t-lg shadow-[0_0_30px_rgba(234,179,8,0.3)] relative overflow-hidden"
                            initial={{ height: 0 }}
                            animate={isInView ? { height: Math.max(2, (currentData.alpha / maxVal) * 100) + '%' } : {}}
                            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.1 }}
                        >
                           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/30"></div>
                        </motion.div>
                    </div>
                     <div className="h-6 flex items-center text-[10px] font-bold text-nobel-gold uppercase tracking-widest">AlphaQubit</div>
                </div>
            </div>
        </div>
    )
}
