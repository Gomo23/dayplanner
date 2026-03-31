import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { C, SERIF, SANS } from '../theme';

const features = [
  { icon:"🎯", title:"Task Manager",   desc:"Prioritise your day with colour-coded tasks, time slots and categories. See exactly what needs attention.",    accent:C.terracotta, bg:C.terraLight },
  { icon:"💰", title:"Budget Tracker", desc:"Log every rupee in and out. Beautiful charts show your spending patterns. Stay on top of finances effortlessly.",accent:C.honey,      bg:C.honeyLight },
  { icon:"📝", title:"Sticky Notes",   desc:"Pastel-coloured notes for ideas, recipes, gratitude lists — anything. Pin the important ones instantly.",        accent:C.moss,       bg:C.mossLight  },
  { icon:"⬡",  title:"Dashboard",      desc:"Everything at a glance. Progress bar, priorities, budget summary, pinned notes — your day beautifully laid out.",accent:C.sky,        bg:C.skyLight   },
];

const steps = [
  { n:"01", title:"Register",       desc:"Create your account in 30 seconds",     icon:"✨" },
  { n:"02", title:"Add your tasks", desc:"Plan the day, set priorities & times",  icon:"📋" },
  { n:"03", title:"Log expenses",   desc:"Track every transaction as it happens", icon:"💰" },
  { n:"04", title:"Enjoy clarity",  desc:"Dashboard shows the full picture daily",icon:"🌿" },
];

export default function Landing() {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    const el = ref.current;
    const onScroll = () => setScrollY(el.scrollTop);
    el?.addEventListener('scroll', onScroll);
    return () => el?.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={ref} style={{ height:'100vh', overflowY:'auto', background:C.bg, fontFamily:SANS, color:C.text }}>
      <style>{`
        @keyframes floatA{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-16px) rotate(1deg)}}
        @keyframes floatB{0%,100%{transform:translateY(0) rotate(1deg)}50%{transform:translateY(-12px) rotate(-0.5deg)}}
        @keyframes pulse{0%,100%{opacity:0.5}50%{opacity:1}}
        .lbtn{transition:all 0.22s;cursor:pointer;} .lbtn:hover{transform:translateY(-3px);}
        .fcard{transition:all 0.22s;} .fcard:hover{transform:translateY(-6px)!important;box-shadow:0 20px 48px rgba(100,60,20,0.14)!important;}
        a{text-decoration:none;color:inherit;}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:${C.bg}} ::-webkit-scrollbar-thumb{background:${C.border2};border-radius:4px}
      `}</style>

      <nav style={{ position:'sticky', top:0, zIndex:100, background:scrollY>40?'rgba(250,247,244,0.96)':'transparent', backdropFilter:'blur(16px)', borderBottom:`1px solid ${scrollY>40?C.border:'transparent'}`, padding:'0 3rem', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', transition:'all 0.3s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <div style={{ width:36, height:36, background:`linear-gradient(135deg,${C.terracotta},${C.honey})`, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', color:'#fff', fontWeight:700 }}>✦</div>
          <span style={{ fontSize:'1.15rem', fontWeight:700, color:C.text, fontFamily:SERIF }}>DayPlanner</span>
        </div>
        <div style={{ display:'flex', gap:'0.65rem' }}>
          <Link to="/login"><button className="lbtn" style={{ background:'rgba(255,255,255,0.8)', border:`1.5px solid ${C.border2}`, color:C.text2, padding:'0.5rem 1.3rem', fontSize:'0.78rem', borderRadius:10, fontFamily:SANS }}>Sign in</button></Link>
          <Link to="/register"><button className="lbtn" style={{ background:`linear-gradient(135deg,${C.terracotta},${C.honey})`, border:'none', color:'#fff', padding:'0.5rem 1.4rem', fontSize:'0.78rem', borderRadius:10, fontFamily:SANS, fontWeight:700, boxShadow:`0 4px 18px ${C.terraGlow}` }}>Get started →</button></Link>
        </div>
      </nav>

      <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'4rem 3rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(circle at 20% 30%, rgba(196,98,45,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(196,138,45,0.05) 0%, transparent 55%)`, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:'14%', right:'5%', background:C.paper, borderRadius:18, padding:'1.1rem 1.3rem', boxShadow:`0 12px 40px ${C.shadow2}`, border:`1.5px solid ${C.border}`, animation:'floatA 6s ease-in-out infinite', zIndex:2, minWidth:170 }}>
          <div style={{ fontSize:'0.58rem', color:C.text4, fontWeight:600, letterSpacing:'0.1em', marginBottom:'0.5rem' }}>TODAY'S FOCUS</div>
          <div style={{ fontSize:'0.78rem', color:C.text, fontWeight:600, marginBottom:'0.4rem' }}>7 tasks planned</div>
          <div style={{ background:C.border, borderRadius:20, height:6, overflow:'hidden' }}><div style={{ width:'40%', height:'100%', background:`linear-gradient(90deg,${C.terracotta},${C.honey})`, borderRadius:20 }}/></div>
          <div style={{ fontSize:'0.58rem', color:C.text3, marginTop:'0.35rem' }}>2 of 7 complete</div>
        </div>
        <div style={{ position:'absolute', bottom:'22%', left:'4%', background:C.paper, borderRadius:18, padding:'1.1rem 1.3rem', boxShadow:`0 12px 40px ${C.shadow2}`, border:`1.5px solid ${C.border}`, animation:'floatB 7s ease-in-out infinite 1s', zIndex:2 }}>
          <div style={{ fontSize:'0.58rem', color:C.text4, fontWeight:600, letterSpacing:'0.1em', marginBottom:'0.4rem' }}>BALANCE</div>
          <div style={{ fontSize:'1.3rem', fontWeight:700, color:C.moss, fontFamily:SERIF }}>₹78,701</div>
          <div style={{ fontSize:'0.62rem', color:C.text3, marginTop:'0.2rem' }}>↑ On track this month</div>
        </div>
        <div style={{ position:'absolute', top:'58%', right:'3%', background:C.honeyLight, borderRadius:14, padding:'0.9rem 1rem', border:`1.5px solid ${C.honey}40`, animation:'floatA 8s ease-in-out infinite 2s', zIndex:2 }}>
          <div style={{ fontSize:'0.75rem' }}>📌 Weekend Plans</div>
          <div style={{ fontSize:'0.62rem', color:C.text2, marginTop:'0.2rem' }}>Farmers market · Walk</div>
        </div>
        <div style={{ position:'relative', textAlign:'center', maxWidth:760, opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(22px)', transition:'all 1s cubic-bezier(0.16,1,0.3,1)', zIndex:3 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(196,98,45,0.08)', border:'1px solid rgba(196,98,45,0.2)', padding:'0.4rem 1.1rem', borderRadius:24, marginBottom:'2.2rem', fontSize:'0.65rem', color:C.terracotta, fontWeight:600, letterSpacing:'0.1em' }}>
            <span style={{ animation:'pulse 2.5s infinite', fontSize:'0.5rem' }}>●</span> Your personal planner, beautifully crafted
          </div>
          <h1 style={{ fontSize:'clamp(2.6rem,6.5vw,5rem)', fontWeight:700, lineHeight:1.08, marginBottom:'1.6rem', color:C.text, fontFamily:SERIF, letterSpacing:'-0.03em' }}>
            Plan your day<br/>
            <span style={{ fontStyle:'italic', background:`linear-gradient(135deg,${C.terracotta} 20%,${C.honey} 80%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>with intention.</span>
          </h1>
          <p style={{ fontSize:'clamp(0.9rem,1.8vw,1.05rem)', color:C.text2, lineHeight:1.9, maxWidth:520, margin:'0 auto 2.8rem' }}>
            A warm, personal space for your tasks, money and thoughts — designed to feel like your favourite journal.
          </p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', marginBottom:'4rem' }}>
            <Link to="/register"><button className="lbtn" style={{ background:`linear-gradient(135deg,${C.terracotta},${C.honey})`, border:'none', color:'#fff', padding:'1rem 2.6rem', fontSize:'0.9rem', borderRadius:12, fontFamily:SANS, fontWeight:700, boxShadow:`0 8px 28px ${C.terraGlow}` }}>Start planning free →</button></Link>
            <Link to="/login"><button className="lbtn" style={{ background:'rgba(255,255,255,0.9)', border:`1.5px solid ${C.border2}`, color:C.text2, padding:'1rem 2.2rem', fontSize:'0.9rem', borderRadius:12, fontFamily:SANS }}>Sign in</button></Link>
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:'3rem', flexWrap:'wrap' }}>
            {[['🎯','Tasks & priorities'],['💰','Budget tracking'],['📝','Colourful notes'],['⬡','Full dashboard']].map(([ic,l])=>(
              <div key={l} style={{ textAlign:'center' }}><div style={{ fontSize:'1.5rem', marginBottom:'0.3rem' }}>{ic}</div><div style={{ fontSize:'0.65rem', color:C.text3, letterSpacing:'0.06em' }}>{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:'5rem 3rem', background:C.bg2, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'4rem', alignItems:'start', marginBottom:'4rem' }}>
            <div>
              <div style={{ fontSize:'0.65rem', color:C.terracotta, letterSpacing:'0.2em', marginBottom:'0.75rem', fontWeight:600 }}>WHAT'S INSIDE</div>
              <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:700, color:C.text, fontFamily:SERIF, lineHeight:1.15 }}>Made for real life,<br/><span style={{ fontStyle:'italic', color:C.terracotta }}>for everyone.</span></h2>
            </div>
            <p style={{ fontSize:'1rem', color:C.text2, lineHeight:1.9, alignSelf:'center' }}>Whether you are a busy professional, a student, or just someone who wants to feel more organised — DayPlanner wraps your whole day in one warm, intuitive space.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1.25rem' }}>
            {features.map((f,i)=>(
              <div key={i} className="fcard" style={{ background:C.paper, border:`1.5px solid ${C.border}`, borderRadius:18, padding:'2rem 1.8rem', boxShadow:`0 4px 16px ${C.shadow}` }}>
                <div style={{ width:52, height:52, background:f.bg, borderRadius:15, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:'1.3rem' }}>{f.icon}</div>
                <h3 style={{ fontSize:'1.05rem', fontWeight:700, marginBottom:'0.6rem', color:C.text, fontFamily:SERIF }}>{f.title}</h3>
                <p style={{ fontSize:'0.76rem', color:C.text2, lineHeight:1.82 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:'6rem 3rem', maxWidth:900, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'4rem' }}>
          <div style={{ fontSize:'0.65rem', color:C.terracotta, letterSpacing:'0.2em', marginBottom:'0.75rem', fontWeight:600 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize:'clamp(1.6rem,3.5vw,2.5rem)', fontWeight:700, color:C.text, fontFamily:SERIF }}>Up in <span style={{ fontStyle:'italic', color:C.terracotta }}>minutes.</span></h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'2rem', position:'relative' }}>
          <div style={{ position:'absolute', top:26, left:'12%', right:'12%', height:1, background:`linear-gradient(90deg,${C.border},${C.terracotta}40,${C.border})` }}/>
          {steps.map((s,i)=>(
            <div key={i} style={{ textAlign:'center', position:'relative', zIndex:1 }}>
              <div style={{ width:52, height:52, background:i===0?`linear-gradient(135deg,${C.terracotta},${C.honey})`:C.paper, border:`1.5px solid ${i===0?C.terracotta:C.border}`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem', fontSize:i===0?'1.3rem':'0.8rem', color:i===0?'#fff':C.text3, fontWeight:700, boxShadow:i===0?`0 4px 20px ${C.terraGlow}`:'none' }}>{i===0?s.icon:s.n}</div>
              <div style={{ fontSize:'0.95rem', fontWeight:700, marginBottom:'0.45rem', color:C.text, fontFamily:SERIF }}>{s.title}</div>
              <div style={{ fontSize:'0.72rem', color:C.text2, lineHeight:1.75 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding:'6rem 3rem', background:`linear-gradient(135deg,${C.terraLight},${C.honeyLight})`, borderTop:`1px solid ${C.border}`, textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(circle at 30% 50%, rgba(196,98,45,0.08) 0%, transparent 55%)`, pointerEvents:'none' }}/>
        <div style={{ position:'relative', maxWidth:600, margin:'0 auto' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1.25rem' }}>🌸</div>
          <h2 style={{ fontSize:'clamp(2rem,5vw,3.2rem)', fontWeight:700, color:C.text, fontFamily:SERIF, marginBottom:'1rem', lineHeight:1.15, letterSpacing:'-0.02em' }}>Ready to own your day?</h2>
          <p style={{ fontSize:'0.9rem', color:C.text2, marginBottom:'2.5rem', lineHeight:1.8 }}>Free forever. No credit card. Just you, your goals, and a beautiful planner.</p>
          <Link to="/register"><button className="lbtn" style={{ background:`linear-gradient(135deg,${C.terracotta},${C.honey})`, border:'none', color:'#fff', padding:'1.1rem 3.2rem', fontSize:'0.95rem', borderRadius:14, fontFamily:SANS, fontWeight:700, boxShadow:`0 10px 36px ${C.terraGlow}` }}>Create my planner →</button></Link>
        </div>
      </section>

      <footer style={{ padding:'2rem 3rem', borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem', background:C.bg2 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
          <div style={{ width:28, height:28, background:`linear-gradient(135deg,${C.terracotta},${C.honey})`, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#fff', fontWeight:700 }}>✦</div>
          <span style={{ fontSize:'0.9rem', fontWeight:700, color:C.text, fontFamily:SERIF }}>DayPlanner</span>
        </div>
        <div style={{ fontSize:'0.65rem', color:C.text3 }}>Java · Spring Boot · React · PostgreSQL · Made with warmth · 2026</div>
      </footer>
    </div>
  );
}
