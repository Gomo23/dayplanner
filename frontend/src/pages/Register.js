import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { C, SERIF, SANS, inp } from '../theme';

export default function Register() {
  const [form, setForm]       = useState({ name:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const { register }          = useAuth();
  const navigate              = useNavigate();
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try { await register(form.name, form.email, form.password); navigate('/dashboard'); }
    catch(err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', fontFamily:SANS }}>
      <style>{`@keyframes floatA{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-16px) rotate(1deg)}} a{text-decoration:none;}`}</style>

      <div style={{ flex:1, background:`linear-gradient(150deg,#fdf5f0 0%,#fef8ec 50%,#f0f7f2 100%)`, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'3rem', borderRight:`1px solid ${C.border}`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', width:500, height:500, background:`radial-gradient(circle,rgba(196,98,45,0.07),transparent 65%)`, top:'0%', left:'30%', pointerEvents:'none' }}/>
        <Link to="/"><button style={{ position:'absolute', top:'1.5rem', left:'1.5rem', background:'rgba(255,255,255,0.8)', border:`1.5px solid ${C.border}`, color:C.text2, padding:'0.4rem 0.9rem', fontSize:'0.7rem', cursor:'pointer', fontFamily:SANS, borderRadius:8 }}>← Back</button></Link>
        <div style={{ position:'relative', textAlign:'center' }}>
          <div style={{ fontSize:'3.5rem', marginBottom:'0.5rem', display:'block', animation:'floatA 4s ease-in-out infinite' }}>🌸</div>
          <div style={{ width:64, height:64, background:`linear-gradient(135deg,${C.terracotta},${C.honey})`, borderRadius:20, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:28, color:'#fff', marginBottom:'1.5rem', boxShadow:`0 10px 32px ${C.terraGlow}` }}>✦</div>
          <h1 style={{ fontSize:'2.4rem', fontWeight:700, color:C.text, fontFamily:SERIF, marginBottom:'0.5rem', letterSpacing:'-0.02em' }}>DayPlanner</h1>
          <p style={{ fontSize:'0.82rem', color:C.text2, lineHeight:1.8, maxWidth:260 }}>A warm, personal space for your tasks, budget and notes.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginTop:'2rem', alignItems:'center' }}>
            {['🎯 Plan tasks & priorities','💰 Track income & expenses','📝 Write colourful notes','⬡ Beautiful dashboard'].map(item=>(
              <div key={item} style={{ fontSize:'0.76rem', color:C.text2, background:'rgba(255,255,255,0.7)', padding:'0.45rem 1.1rem', borderRadius:20, border:`1px solid ${C.border}` }}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ width:480, display:'flex', alignItems:'center', justifyContent:'center', padding:'2.5rem', background:C.paper }}>
        <div style={{ width:'100%', maxWidth:370 }}>
          <div style={{ marginBottom:'2.5rem' }}>
            <h2 style={{ fontSize:'1.9rem', fontWeight:700, color:C.text, fontFamily:SERIF, marginBottom:'0.4rem', letterSpacing:'-0.02em' }}>Let us get started 🌿</h2>
            <p style={{ fontSize:'0.76rem', color:C.text3 }}>Create your free planner account</p>
          </div>
          <form onSubmit={submit}>
            {[['Your name','name','text'],['Email address','email','email'],['Create password','password','password']].map(([ph,k,t])=>(
              <div key={k} style={{ marginBottom:'1.1rem' }}>
                <label style={{ fontSize:'0.72rem', color:C.text2, fontWeight:600, display:'block', marginBottom:'0.4rem' }}>{ph}</label>
                <input style={inp} type={t} placeholder={ph} value={form[k]} onChange={e=>f(k,e.target.value)} required
                  onFocus={ev=>{ ev.target.style.borderColor=C.terracotta; ev.target.style.boxShadow=`0 0 0 3px ${C.terraGlow}`; }}
                  onBlur={ev=>{ ev.target.style.borderColor=C.border2; ev.target.style.boxShadow='none'; }}/>
              </div>
            ))}
            <button type="submit" disabled={loading} style={{ width:'100%', background:`linear-gradient(135deg,${C.terracotta},${C.honey})`, border:'none', color:'#fff', padding:'0.95rem', fontSize:'0.9rem', borderRadius:12, fontFamily:SANS, fontWeight:700, cursor:'pointer', marginTop:'0.5rem', boxShadow:`0 4px 20px ${C.terraGlow}`, opacity:loading?0.75:1 }}>
              {loading ? 'Creating your planner...' : 'Create my planner →'}
            </button>
          </form>
          <div style={{ marginTop:'1.5rem', paddingTop:'1.5rem', borderTop:`1px solid ${C.border}`, textAlign:'center' }}>
            <span style={{ fontSize:'0.76rem', color:C.text3 }}>Already have an account? </span>
            <Link to="/login" style={{ fontSize:'0.76rem', color:C.terracotta, fontWeight:700 }}>Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
