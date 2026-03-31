import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { expensesAPI } from '../api/client';
import toast from 'react-hot-toast';
import { C, SERIF, SANS, inp } from '../theme';

const CATS = ['Food','Transport','Rent','Health','Leisure','Creative','Learning','Shopping','Other'];
const BAR_COLORS = [C.terracotta, C.honey, C.moss, C.sky, C.blush, '#7a5a9c', '#3a8a6a'];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShow]     = useState(false);
  const [form, setForm]         = useState({ title:'', amount:'', category:'Food', type:'EXPENSE', expenseDate: new Date().toISOString().split('T')[0], notes:'' });

  useEffect(() => { expensesAPI.getAll().then(r=>setExpenses(r.data)).catch(()=>{}); }, []);

  const totalInc  = expenses.filter(e=>e.type==='INCOME').reduce((s,e)=>s+e.amount,0);
  const totalExp  = expenses.filter(e=>e.type==='EXPENSE').reduce((s,e)=>s+e.amount,0);
  const bal       = totalInc - totalExp;
  const catData   = Object.entries(
    expenses.filter(e=>e.type==='EXPENSE').reduce((a,e)=>({...a,[e.category]:(a[e.category]||0)+e.amount}),{})
  ).map(([name,amount])=>({name,amount}));

  const add = async () => {
    if (!form.title || !form.amount) return;
    try {
      const r = await expensesAPI.create({ ...form, amount: parseFloat(form.amount) });
      setExpenses(ex=>[r.data,...ex]);
      setForm({ title:'', amount:'', category:'Food', type:'EXPENSE', expenseDate: new Date().toISOString().split('T')[0], notes:'' });
      setShow(false);
      toast.success('Entry saved! 💰');
    } catch { toast.error('Failed to save'); }
  };

  const remove = async (id) => {
    try { await expensesAPI.delete(id); setExpenses(ex=>ex.filter(e=>e.id!==id)); toast.success('Deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'1.9rem', fontWeight:700, fontFamily:SERIF, color:C.text, letterSpacing:'-0.02em' }}>Expenses ◈</h1>
          <p style={{ fontSize:'0.72rem', color:C.text4, marginTop:'0.25rem' }}>Track your money, calmly</p>
        </div>
        <button onClick={()=>setShow(f=>!f)} style={{ background:showForm?'transparent':`linear-gradient(135deg,${C.terracotta},${C.honey})`, border:`1.5px solid ${showForm?C.border2:'transparent'}`, color:showForm?C.text2:'#fff', padding:'0.7rem 1.4rem', fontSize:'0.8rem', cursor:'pointer', fontFamily:SANS, borderRadius:11, fontWeight:600, boxShadow:showForm?'none':`0 4px 16px ${C.terraGlow}` }}>
          {showForm ? '✕ Cancel' : '+ Add entry'}
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display:'flex', gap:'1rem', marginBottom:'1.75rem', flexWrap:'wrap' }}>
        {[
          { label:'Income',  value:`₹${totalInc.toLocaleString()}`, icon:'💰', color:C.moss,        bg:C.mossLight  },
          { label:'Spent',   value:`₹${totalExp.toLocaleString()}`, icon:'💸', color:C.terracotta,  bg:C.terraLight },
          { label:'Balance', value:`₹${bal.toLocaleString()}`,      icon:'✨', color:C.honey,       bg:C.honeyLight },
        ].map(s=>(
          <div key={s.label} style={{ background:C.paper, border:`1.5px solid ${C.border}`, borderRadius:16, padding:'1.3rem 1.5rem', flex:1, minWidth:140, boxShadow:`0 2px 14px ${C.shadow}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.55rem' }}>
              <div style={{ width:32, height:32, background:s.bg, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.95rem' }}>{s.icon}</div>
              <span style={{ fontSize:'0.62rem', color:C.text4, letterSpacing:'0.1em', textTransform:'uppercase' }}>{s.label}</span>
            </div>
            <div style={{ fontSize:'1.7rem', fontWeight:700, color:s.color, fontFamily:SERIF }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background:C.paper, border:`1.5px solid ${C.terracotta}40`, borderRadius:16, padding:'1.6rem', marginBottom:'1.6rem', boxShadow:`0 6px 24px ${C.shadow}` }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
            <input style={inp} placeholder="Title *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}
              onFocus={ev=>{ ev.target.style.borderColor=C.terracotta; ev.target.style.boxShadow=`0 0 0 3px ${C.terraGlow}`; }}
              onBlur={ev=>{ ev.target.style.borderColor=C.border2; ev.target.style.boxShadow='none'; }}/>
            <input type="number" style={inp} placeholder="Amount ₹ *" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
            <select style={inp} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
              {CATS.map(c=><option key={c}>{c}</option>)}
            </select>
            <select style={inp} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
              <option value="EXPENSE">💸 Expense</option>
              <option value="INCOME">💰 Income</option>
            </select>
            <input type="date" style={inp} value={form.expenseDate} onChange={e=>setForm(f=>({...f,expenseDate:e.target.value}))}/>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.5rem' }}>
            <button onClick={()=>setShow(false)} style={{ background:'transparent', border:`1.5px solid ${C.border2}`, color:C.text2, padding:'0.55rem 1.1rem', fontSize:'0.76rem', cursor:'pointer', fontFamily:SANS, borderRadius:9 }}>Cancel</button>
            <button onClick={add} style={{ background:`linear-gradient(135deg,${C.terracotta},${C.honey})`, border:'none', color:'#fff', padding:'0.55rem 1.5rem', fontSize:'0.76rem', cursor:'pointer', fontFamily:SANS, borderRadius:9, fontWeight:600, boxShadow:`0 2px 10px ${C.terraGlow}` }}>Save</button>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
        {/* Chart */}
        <div style={{ background:C.paper, border:`1.5px solid ${C.border}`, borderRadius:16, padding:'1.5rem', boxShadow:`0 2px 14px ${C.shadow}` }}>
          <div style={{ fontSize:'0.68rem', color:C.text4, fontWeight:700, marginBottom:'1rem', letterSpacing:'0.1em' }}>SPEND BY CATEGORY</div>
          {catData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={catData} barSize={26}>
                <XAxis dataKey="name" tick={{ fill:C.text3, fontSize:9 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:C.text3, fontSize:9 }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ background:C.paper, border:`1px solid ${C.border}`, color:C.text, fontSize:'0.75rem', borderRadius:10 }} formatter={v=>`₹${v.toLocaleString()}`}/>
                <Bar dataKey="amount" radius={[8,8,0,0]}>
                  {catData.map((_,i)=><Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign:'center', padding:'3rem 0', color:C.text4, fontSize:'0.82rem' }}>No expenses yet</div>
          )}
        </div>

        {/* Recent list */}
        <div style={{ background:C.paper, border:`1.5px solid ${C.border}`, borderRadius:16, padding:'1.5rem', boxShadow:`0 2px 14px ${C.shadow}`, overflowY:'auto', maxHeight:350 }}>
          <div style={{ fontSize:'0.68rem', color:C.text4, fontWeight:700, marginBottom:'1rem', letterSpacing:'0.1em' }}>RECENT ENTRIES</div>
          {expenses.length === 0 && <div style={{ textAlign:'center', padding:'2rem 0', color:C.text4, fontSize:'0.82rem' }}>No entries yet ◈</div>}
          {expenses.map(e=>(
            <div key={e.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.62rem 0', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'0.82rem', color:C.text, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{e.title}</div>
                <div style={{ fontSize:'0.63rem', color:C.text3, marginTop:'0.1rem' }}>{e.category} · {e.expenseDate}</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.7rem', flexShrink:0, marginLeft:'0.5rem' }}>
                <span style={{ color:e.type==='INCOME'?C.moss:C.terracotta, fontSize:'0.92rem', fontWeight:700, fontFamily:SERIF }}>{e.type==='INCOME'?'+':'-'}₹{e.amount.toLocaleString()}</span>
                <button onClick={()=>remove(e.id)} style={{ background:'none', border:'none', color:C.border2, cursor:'pointer', fontSize:'1.1rem', lineHeight:1, transition:'color 0.15s' }}
                  onMouseEnter={ev=>ev.target.style.color=C.terracotta} onMouseLeave={ev=>ev.target.style.color=C.border2}>×</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
