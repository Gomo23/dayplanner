import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { C, SERIF, SANS } from '../theme';

const NAV = [
  { to:'/dashboard', icon:'⬡', label:'Dashboard' },
  { to:'/tasks',     icon:'✦', label:'Tasks'     },
  { to:'/expenses',  icon:'◈', label:'Expenses'  },
  { to:'/notes',     icon:'◻', label:'Notes'     },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:SANS }}>
      <style>{`
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:${C.bg}} ::-webkit-scrollbar-thumb{background:${C.border2};border-radius:4px}
        a{text-decoration:none;}
      `}</style>

      {open && (
        <aside style={{ width:240, background:C.paper, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', flexShrink:0, boxShadow:`2px 0 20px ${C.shadow}` }}>
          <div style={{ padding:'1.5rem 1.25rem', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:'0.7rem' }}>
            <div style={{ width:38, height:38, background:`linear-gradient(135deg,${C.terracotta},${C.honey})`, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, color:'#fff', fontWeight:700 }}>✦</div>
            <div>
              <div style={{ fontSize:'1rem', fontWeight:700, color:C.text, fontFamily:SERIF }}>DayPlanner</div>
              <div style={{ fontSize:'0.58rem', color:C.text4, marginTop:1 }}>Your personal space</div>
            </div>
          </div>

          <nav style={{ flex:1, padding:'0.75rem' }}>
            {NAV.map(({ to, icon, label }) => (
              <NavLink key={to} to={to} style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:'0.7rem',
                padding:'0.75rem 0.9rem', textDecoration:'none', fontSize:'0.85rem',
                color: isActive ? C.terracotta : C.text2,
                background: isActive ? C.terraLight : 'transparent',
                borderRadius: 11, marginBottom:'0.22rem',
                fontWeight: isActive ? 700 : 400, transition:'all 0.15s',
              })}>
                <span style={{ fontSize:'1.05rem' }}>{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div style={{ padding:'1.1rem 1.25rem', borderTop:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.7rem', marginBottom:'0.85rem' }}>
              <div style={{ width:36, height:36, background:`linear-gradient(135deg,${C.terracotta},${C.honey})`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.9rem', fontWeight:700, flexShrink:0 }}>
                {(user?.name || 'U')[0].toUpperCase()}
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:'0.82rem', fontWeight:700, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
                <div style={{ fontSize:'0.62rem', color:C.text3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</div>
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/'); }} style={{ width:'100%', background:'transparent', border:`1.5px solid ${C.border2}`, color:C.text3, padding:'0.48rem', fontSize:'0.74rem', cursor:'pointer', fontFamily:SANS, borderRadius:9, transition:'all 0.15s' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.terracotta; e.currentTarget.style.color=C.terracotta; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border2; e.currentTarget.style.color=C.text3; }}>
              Sign out
            </button>
          </div>
        </aside>
      )}

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <header style={{ height:56, background:C.paper, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 1.8rem', flexShrink:0 }}>
          <button onClick={() => setOpen(o=>!o)} style={{ background:'none', border:'none', color:C.text3, cursor:'pointer', fontSize:'1.3rem', lineHeight:1, padding:0 }}>☰</button>
          <div style={{ fontSize:'0.7rem', color:C.text3, letterSpacing:'0.06em' }}>
            {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </div>
        </header>
        <main style={{ flex:1, overflow:'auto', padding:'2.2rem 2.8rem', background:C.bg, color:C.text }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
