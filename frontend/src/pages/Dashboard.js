import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { tasksAPI, expensesAPI, notesAPI } from '../api/client';
import toast from 'react-hot-toast';
import { C, SERIF, SANS, PC } from '../theme';

const spendArea = [
  {day:'1',v:22000},{day:'3',v:22320},{day:'5',v:22820},{day:'6',v:23469},{day:'7',v:23919},{day:'9',v:24369},{day:'10',v:24599},
];

function StatCard({ label, value, icon, color, bg }) {
  return (
    <div style={{ background:C.paper, border:`1.5px solid ${C.border}`, borderRadius:16, padding:'1.3rem 1.5rem', flex:1, minWidth:135, boxShadow:`0 2px 14px ${C.shadow}` }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.65rem' }}>
        <div style={{ width:34, height:34, background:bg, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>{icon}</div>
        <span style={{ fontSize:'0.62rem', color:C.text4, letterSpacing:'0.1em', textTransform:'uppercase' }}>{label}</span>
      </div>
      <div style={{ fontSize:'1.9rem', fontWeight:700, color, fontFamily:SERIF, lineHeight:1 }}>{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks,    setTasks]    = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [notes,    setNotes]    = useState([]);

  useEffect(() => {
    tasksAPI.getAll().then(r=>setTasks(r.data)).catch(()=>{});
    expensesAPI.getAll().then(r=>setExpenses(r.data)).catch(()=>{});
    notesAPI.getAll().then(r=>setNotes(r.data)).catch(()=>{});
  }, []);

  const done     = tasks.filter(t=>t.done).length;
  const pct      = tasks.length ? Math.round(done/tasks.length*100) : 0;
  const totalInc = expenses.filter(e=>e.type==='INCOME').reduce((s,e)=>s+e.amount,0);
  const totalExp = expenses.filter(e=>e.type==='EXPENSE').reduce((s,e)=>s+e.amount,0);
  const bal      = totalInc - totalExp;
  const greet    = () => { const h=new Date().getHours(); return h<12?'Good morning':h<18?'Good afternoon':'Good evening'; };

  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'2.1rem', fontWeight:700, fontFamily:SERIF, color:C.text, letterSpacing:'-0.02em' }}>
          {greet()}, <span style={{ color:C.terracotta, fontStyle:'italic' }}>{user?.name}</span> 🌸
        </h1>
        <p style={{ fontSize:'0.75rem', color:C.text4, marginTop:'0.35rem', letterSpacing:'0.06em' }}>Here is your day at a glance</p>
      </div>

      <div style={{ display:'flex', gap:'1rem', marginBottom:'1.75rem', flexWrap:'wrap' }}>
        <StatCard label="Tasks done"    value={done}                                       icon="🎯" color={C.moss}        bg={C.mossLight}  />
        <StatCard label="Still to-do"   value={tasks.filter(t=>!t.done).length}            icon="📋" color={C.honey}       bg={C.honeyLight} />
        <StatCard label="High priority" value={tasks.filter(t=>t.priority==='HIGH').length} icon="🔥" color={C.terracotta} bg={C.terraLight} />
        <StatCard label="Balance"       value={`₹${bal.toLocaleString()}`}                 icon="💰" color={C.sky}         bg={C.skyLight}   />
      </div>

      <div style={{ background:C.paper, border:`1.5px solid ${C.border}`, borderRadius:16, padding:'1.3rem 1.6rem', marginBottom:'1.5rem', boxShadow:`0 2px 14px ${C.shadow}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
          <span style={{ fontSize:'0.82rem', color:C.text2, fontWeight:600 }}>Today's progress</span>
          <span style={{ fontSize:'0.85rem', color:C.terracotta, fontWeight:700, fontFamily:SERIF }}>{pct}%</span>
        </div>
        <div style={{ background:C.bg2, borderRadius:20, height:12, overflow:'hidden' }}>
          <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${C.terracotta},${C.honey})`, borderRadius:20, transition:'width 0.6s cubic-bezier(0.16,1,0.3,1)', position:'relative' }}>
            {pct>5 && <div style={{ position:'absolute', right:0, top:'50%', transform:'translateY(-50%)', width:18, height:18, background:'#fff', borderRadius:'50%', border:`2px solid ${C.honey}`, boxShadow:`0 2px 8px ${C.terraGlow}` }}/>}
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'0.5rem' }}>
          <span style={{ fontSize:'0.65rem', color:C.text3 }}>{done} tasks done</span>
          <span style={{ fontSize:'0.65rem', color:C.text3 }}>{tasks.length - done} remaining</span>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:'1.25rem', marginBottom:'1.25rem' }}>
        <div style={{ background:C.paper, border:`1.5px solid ${C.border}`, borderRadius:16, padding:'1.5rem', boxShadow:`0 2px 14px ${C.shadow}` }}>
          <div style={{ fontSize:'0.68rem', color:C.text4, fontWeight:700, marginBottom:'1rem', letterSpacing:'0.1em' }}>TODAY'S TASKS</div>
          {tasks.slice(0,7).map(t=>(
            <div key={t.id} style={{ display:'flex', alignItems:'center', gap:'0.7rem', marginBottom:'0.62rem' }}>
              <div style={{ width:18, height:18, borderRadius:6, border:`1.5px solid ${t.done?C.moss:C.border2}`, background:t.done?C.moss:'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.58rem', color:'#fff', flexShrink:0 }}>{t.done?'✓':''}</div>
              <span style={{ fontSize:'0.82rem', color:t.done?C.text3:C.text, textDecoration:t.done?'line-through':'none', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.title}</span>
              {t.taskTime&&<span style={{ fontSize:'0.63rem', color:C.text4, flexShrink:0 }}>{t.taskTime}</span>}
              <div style={{ width:6, height:6, borderRadius:'50%', background:PC[t.priority]||C.border2, flexShrink:0 }}/>
            </div>
          ))}
          {tasks.length===0 && <div style={{ fontSize:'0.8rem', color:C.text4, textAlign:'center', padding:'1.5rem 0' }}>No tasks yet — add some! ✦</div>}
        </div>

        <div style={{ background:C.paper, border:`1.5px solid ${C.border}`, borderRadius:16, padding:'1.5rem', boxShadow:`0 2px 14px ${C.shadow}` }}>
          <div style={{ fontSize:'0.68rem', color:C.text4, fontWeight:700, marginBottom:'1rem', letterSpacing:'0.1em' }}>BUDGET · THIS MONTH</div>
          {[['Income',`+₹${totalInc.toLocaleString()}`,C.moss],['Spent',`-₹${totalExp.toLocaleString()}`,C.terracotta]].map(([l,v,col])=>(
            <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.65rem 0', borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:'0.8rem', color:C.text2 }}>{l}</span>
              <span style={{ fontSize:'0.95rem', color:col, fontWeight:700, fontFamily:SERIF }}>{v}</span>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 0 0.5rem' }}>
            <span style={{ fontSize:'0.8rem', color:C.text, fontWeight:600 }}>Balance</span>
            <span style={{ fontSize:'1.3rem', color:C.honey, fontWeight:700, fontFamily:SERIF }}>₹{bal.toLocaleString()}</span>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={spendArea}>
              <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.terracotta} stopOpacity={0.15}/><stop offset="95%" stopColor={C.terracotta} stopOpacity={0}/></linearGradient></defs>
              <Area type="monotone" dataKey="v" stroke={C.terracotta} strokeWidth={2} fill="url(#sg)" dot={false}/>
              <XAxis dataKey="day" tick={{ fill:C.text4, fontSize:8 }} axisLine={false} tickLine={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {notes.filter(n=>n.pinned).length > 0 && (
        <div style={{ background:C.paper, border:`1.5px solid ${C.border}`, borderRadius:16, padding:'1.5rem', boxShadow:`0 2px 14px ${C.shadow}` }}>
          <div style={{ fontSize:'0.68rem', color:C.text4, fontWeight:700, marginBottom:'1rem', letterSpacing:'0.1em' }}>📌 PINNED NOTES</div>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
            {notes.filter(n=>n.pinned).map(n=>(
              <div key={n.id} style={{ background:n.color||C.honeyLight, borderRadius:12, padding:'1rem 1.1rem', flex:1, minWidth:160, border:`1px solid rgba(0,0,0,0.05)` }}>
                <div style={{ fontSize:'0.82rem', fontWeight:700, color:C.text, fontFamily:SERIF, marginBottom:'0.35rem' }}>{n.title}</div>
                <div style={{ fontSize:'0.68rem', color:C.text2, lineHeight:1.65 }}>{(n.content||'').split('\n')[0]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
