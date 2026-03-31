import React, { useEffect, useState } from 'react';
import { tasksAPI } from '../api/client';
import toast from 'react-hot-toast';
import { C, SERIF, SANS, PC, inp } from '../theme';

const CATS = ['Work','Personal','Health','Errands','Learning','Social','Meeting'];

function Tag({ children, color, bg }) {
  return <span style={{ fontSize:'0.62rem', color, background:bg, padding:'0.18rem 0.55rem', borderRadius:20, fontWeight:600, letterSpacing:'0.04em' }}>{children}</span>;
}

export default function Tasks() {
  const [tasks,  setTasks]  = useState([]);
  const [filter, setFilter] = useState('all');
  const [showForm, setShow] = useState(false);
  const [form, setForm]     = useState({ title:'', description:'', priority:'MEDIUM', category:'', taskTime:'' });

  useEffect(() => { tasksAPI.getAll().then(r=>setTasks(r.data)).catch(()=>{}); }, []);

  const done    = tasks.filter(t=>t.done).length;
  const pct     = tasks.length ? Math.round(done/tasks.length*100) : 0;
  const filtered= tasks.filter(t=>filter==='pending'?!t.done:filter==='done'?t.done:filter==='high'?t.priority==='HIGH':true);

  const addTask = async () => {
    if (!form.title.trim()) return;
    try {
      const r = await tasksAPI.create(form);
      setTasks(ts=>[...ts,r.data]);
      setForm({ title:'', description:'', priority:'MEDIUM', category:'', taskTime:'' });
      setShow(false);
      toast.success('Task added! 🎯');
    } catch { toast.error('Failed to add task'); }
  };

  const toggle = async (t) => {
    try {
      await tasksAPI.toggle(t.id);
      setTasks(ts=>ts.map(x=>x.id===t.id?{...x,done:!x.done}:x));
      toast.success(t.done?'Marked pending':'Done! 🎉');
    } catch { toast.error('Failed to update'); }
  };

  const remove = async (id) => {
    try { await tasksAPI.delete(id); setTasks(ts=>ts.filter(x=>x.id!==id)); toast.success('Deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'1.9rem', fontWeight:700, fontFamily:SERIF, color:C.text, letterSpacing:'-0.02em' }}>Tasks ✦</h1>
          <p style={{ fontSize:'0.72rem', color:C.text4, marginTop:'0.25rem' }}>{tasks.length} tasks · {done} done · {pct}% complete</p>
        </div>
        <button onClick={()=>setShow(f=>!f)} style={{ background:showForm?'transparent':`linear-gradient(135deg,${C.terracotta},${C.honey})`, border:`1.5px solid ${showForm?C.border2:'transparent'}`, color:showForm?C.text2:'#fff', padding:'0.7rem 1.4rem', fontSize:'0.8rem', cursor:'pointer', fontFamily:SANS, borderRadius:11, fontWeight:600, boxShadow:showForm?'none':`0 4px 16px ${C.terraGlow}` }}>
          {showForm ? '✕ Cancel' : '+ Add task'}
        </button>
      </div>

      <div style={{ background:C.bg2, borderRadius:20, height:8, marginBottom:'1.75rem', overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${C.terracotta},${C.honey})`, borderRadius:20, transition:'width 0.5s' }}/>
      </div>

      {showForm && (
        <div style={{ background:C.paper, border:`1.5px solid ${C.terracotta}40`, borderRadius:16, padding:'1.6rem', marginBottom:'1.6rem', boxShadow:`0 6px 24px ${C.shadow}` }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
            <input style={inp} placeholder="What do you need to do? *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}
              onFocus={e=>{ e.target.style.borderColor=C.terracotta; e.target.style.boxShadow=`0 0 0 3px ${C.terraGlow}`; }}
              onBlur={e=>{ e.target.style.borderColor=C.border2; e.target.style.boxShadow='none'; }}/>
            <input type="time" style={inp} value={form.taskTime} onChange={e=>setForm(f=>({...f,taskTime:e.target.value}))}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
            <select style={inp} value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
              <option value="HIGH">🔥 High priority</option>
              <option value="MEDIUM">⚡ Medium priority</option>
              <option value="LOW">🌿 Low priority</option>
            </select>
            <select style={inp} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
              <option value="">No category</option>
              {CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <textarea style={{ ...inp, minHeight:70, resize:'vertical', display:'block', marginBottom:'0.75rem', lineHeight:1.65 }} placeholder="Description (optional)" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.5rem' }}>
            <button onClick={()=>setShow(false)} style={{ background:'transparent', border:`1.5px solid ${C.border2}`, color:C.text2, padding:'0.55rem 1.1rem', fontSize:'0.76rem', cursor:'pointer', fontFamily:SANS, borderRadius:9 }}>Cancel</button>
            <button onClick={addTask} style={{ background:`linear-gradient(135deg,${C.terracotta},${C.honey})`, border:'none', color:'#fff', padding:'0.55rem 1.5rem', fontSize:'0.76rem', cursor:'pointer', fontFamily:SANS, borderRadius:9, fontWeight:600, boxShadow:`0 2px 10px ${C.terraGlow}` }}>Save task</button>
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:'0.4rem', marginBottom:'1.3rem', flexWrap:'wrap' }}>
        {[['all','All'],['pending','Pending'],['done','Done'],['high','High']].map(([f,l])=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:'0.4rem 1.05rem', border:`1.5px solid ${filter===f?C.terracotta:C.border2}`, background:filter===f?C.terraLight:C.paper, color:filter===f?C.terracotta:C.text3, fontSize:'0.72rem', cursor:'pointer', fontFamily:SANS, borderRadius:20, fontWeight:filter===f?700:400, transition:'all 0.15s' }}>{l}</button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
        {filtered.length===0
          ? <div style={{ textAlign:'center', padding:'4rem', color:C.text4, fontSize:'0.85rem' }}>Nothing here yet ✨</div>
          : filtered.map(t=>(
          <div key={t.id} style={{ background:C.paper, border:`1.5px solid ${C.border}`, borderLeft:`4px solid ${PC[t.priority]||C.border2}`, borderRadius:14, padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:'0.9rem', opacity:t.done?0.6:1, boxShadow:`0 2px 10px ${C.shadow}`, transition:'all 0.15s' }}>
            <button onClick={()=>toggle(t)} style={{ width:24, height:24, borderRadius:7, border:`1.5px solid ${t.done?C.moss:C.border2}`, background:t.done?C.moss:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.72rem', fontWeight:700, flexShrink:0 }}>{t.done?'✓':''}</button>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'0.9rem', fontWeight:t.done?400:600, textDecoration:t.done?'line-through':'none', color:t.done?C.text3:C.text, marginBottom:'0.22rem' }}>{t.title}</div>
              <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', flexWrap:'wrap' }}>
                {t.taskTime&&<span style={{ fontSize:'0.65rem', color:C.text3 }}>🕐 {t.taskTime}</span>}
                {t.category&&<Tag color={C.text2} bg={C.bg2}>{t.category}</Tag>}
                <Tag color={PC[t.priority]} bg={`${PC[t.priority]}18`}>{t.priority}</Tag>
              </div>
            </div>
            <button onClick={()=>remove(t.id)} style={{ background:'none', border:'none', color:C.border2, cursor:'pointer', fontSize:'1.2rem', padding:'0 0.2rem', lineHeight:1, transition:'color 0.15s' }}
              onMouseEnter={e=>e.target.style.color=C.terracotta} onMouseLeave={e=>e.target.style.color=C.border2}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
