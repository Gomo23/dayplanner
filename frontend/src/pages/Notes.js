import React, { useEffect, useState } from 'react';
import { notesAPI } from '../api/client';
import toast from 'react-hot-toast';
import { C, SERIF, SANS, NOTE_COLORS, inp } from '../theme';

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div onClick={onEdit} style={{ background:note.color||'#fdf8ec', borderRadius:16, padding:'1.3rem', cursor:'pointer', minHeight:140, border:`1.5px solid rgba(0,0,0,0.06)`, position:'relative', overflow:'hidden', transition:'transform 0.18s, box-shadow 0.18s' }}
      onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px) rotate(0.4deg)'; e.currentTarget.style.boxShadow=`0 16px 40px ${C.shadow2}`; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0) rotate(0deg)'; e.currentTarget.style.boxShadow='none'; }}>
      <div style={{ position:'absolute', top:0, right:0, width:50, height:50, background:'rgba(0,0,0,0.04)', borderRadius:'0 16px 0 50px' }}/>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.6rem' }}>
        <div style={{ fontSize:'0.9rem', fontWeight:700, color:C.text, flex:1, lineHeight:1.35, fontFamily:SERIF, paddingRight:'0.5rem' }}>{note.title}</div>
        <button onClick={e=>{ e.stopPropagation(); onDelete(); }} style={{ background:'none', border:'none', color:'rgba(0,0,0,0.22)', cursor:'pointer', fontSize:'1.2rem', lineHeight:1, flexShrink:0, padding:0 }}
          onMouseEnter={e=>e.target.style.color='rgba(196,98,45,0.8)'} onMouseLeave={e=>e.target.style.color='rgba(0,0,0,0.22)'}>×</button>
      </div>
      <div style={{ fontSize:'0.74rem', color:'rgba(0,0,0,0.58)', lineHeight:1.75, whiteSpace:'pre-wrap', wordBreak:'break-word', fontFamily:SANS }}>{note.content}</div>
      {note.pinned && <div style={{ position:'absolute', bottom:10, right:12, fontSize:'0.7rem', color:'rgba(0,0,0,0.3)' }}>📌</div>}
    </div>
  );
}

export default function Notes() {
  const [notes,    setNotes]    = useState([]);
  const [showForm, setShow]     = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [form, setForm]         = useState({ title:'', content:'', color:'#fdf8ec', pinned:false });

  useEffect(() => { notesAPI.getAll().then(r=>setNotes(r.data)).catch(()=>{}); }, []);

  const openNew = () => { setEditNote(null); setForm({ title:'', content:'', color:'#fdf8ec', pinned:false }); setShow(true); };
  const openEdit = (n) => { setEditNote(n); setForm({ title:n.title, content:n.content, color:n.color||'#fdf8ec', pinned:n.pinned }); setShow(true); };

  const save = async () => {
    if (!form.title.trim()) return;
    try {
      if (editNote) {
        const r = await notesAPI.update(editNote.id, form);
        setNotes(ns=>ns.map(n=>n.id===editNote.id?r.data:n));
        toast.success('Note updated!');
      } else {
        const r = await notesAPI.create(form);
        setNotes(ns=>[r.data,...ns]);
        toast.success('Note saved! 📝');
      }
      setShow(false); setEditNote(null);
    } catch { toast.error('Failed to save'); }
  };

  const remove = async (id) => {
    try { await notesAPI.delete(id); setNotes(ns=>ns.filter(n=>n.id!==id)); toast.success('Deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  const pinned  = notes.filter(n=>n.pinned);
  const regular = notes.filter(n=>!n.pinned);

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.75rem' }}>
        <div>
          <h1 style={{ fontSize:'1.9rem', fontWeight:700, fontFamily:SERIF, color:C.text, letterSpacing:'-0.02em' }}>Notes ◻</h1>
          <p style={{ fontSize:'0.72rem', color:C.text4, marginTop:'0.25rem' }}>{notes.length} notes · {pinned.length} pinned</p>
        </div>
        <button onClick={showForm ? ()=>{ setShow(false); setEditNote(null); } : openNew}
          style={{ background:showForm?'transparent':`linear-gradient(135deg,${C.terracotta},${C.honey})`, border:`1.5px solid ${showForm?C.border2:'transparent'}`, color:showForm?C.text2:'#fff', padding:'0.7rem 1.4rem', fontSize:'0.8rem', cursor:'pointer', fontFamily:SANS, borderRadius:11, fontWeight:600, boxShadow:showForm?'none':`0 4px 16px ${C.terraGlow}` }}>
          {showForm ? '✕ Cancel' : '+ New note'}
        </button>
      </div>

      {showForm && (
        <div style={{ background:form.color, border:`1.5px solid rgba(0,0,0,0.1)`, borderRadius:16, padding:'1.6rem', marginBottom:'1.75rem', maxWidth:580, boxShadow:`0 6px 24px ${C.shadow}` }}>
          <input style={{ ...inp, marginBottom:'0.75rem', background:'rgba(255,255,255,0.75)' }} placeholder="Note title *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
          <textarea style={{ ...inp, minHeight:95, resize:'vertical', display:'block', marginBottom:'0.85rem', lineHeight:1.7, background:'rgba(255,255,255,0.75)' }} placeholder="Write your thoughts..." value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))}/>
          <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', flexWrap:'wrap', marginBottom:'1rem' }}>
            <span style={{ fontSize:'0.65rem', color:'rgba(0,0,0,0.45)', marginRight:'0.2rem' }}>Colour:</span>
            {NOTE_COLORS.map(({bg})=>(
              <div key={bg} onClick={()=>setForm(f=>({...f,color:bg}))} style={{ width:24, height:24, background:bg, cursor:'pointer', border:form.color===bg?'2.5px solid rgba(0,0,0,0.4)':'1.5px solid rgba(0,0,0,0.12)', borderRadius:7, transform:form.color===bg?'scale(1.25)':'scale(1)', transition:'transform 0.12s' }}/>
            ))}
            <label style={{ display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.76rem', color:'rgba(0,0,0,0.55)', cursor:'pointer', marginLeft:'0.5rem' }}>
              <input type="checkbox" checked={form.pinned} onChange={e=>setForm(f=>({...f,pinned:e.target.checked}))}/>📌 Pin
            </label>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.5rem' }}>
            <button onClick={()=>{ setShow(false); setEditNote(null); }} style={{ background:'transparent', border:`1.5px solid ${C.border2}`, color:C.text2, padding:'0.55rem 1.1rem', fontSize:'0.76rem', cursor:'pointer', fontFamily:SANS, borderRadius:9 }}>Cancel</button>
            <button onClick={save} style={{ background:`linear-gradient(135deg,${C.terracotta},${C.honey})`, border:'none', color:'#fff', padding:'0.55rem 1.5rem', fontSize:'0.76rem', cursor:'pointer', fontFamily:SANS, borderRadius:9, fontWeight:700, boxShadow:`0 2px 10px ${C.terraGlow}` }}>
              {editNote ? 'Update' : 'Save note'}
            </button>
          </div>
        </div>
      )}

      {pinned.length > 0 && (
        <div style={{ marginBottom:'2rem' }}>
          <div style={{ fontSize:'0.68rem', color:C.text4, fontWeight:700, letterSpacing:'0.1em', marginBottom:'0.9rem' }}>📌 PINNED</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1.1rem' }}>
            {pinned.map(n=><NoteCard key={n.id} note={n} onEdit={()=>openEdit(n)} onDelete={()=>remove(n.id)}/>)}
          </div>
        </div>
      )}

      {regular.length > 0 && (
        <>
          <div style={{ fontSize:'0.68rem', color:C.text4, fontWeight:700, letterSpacing:'0.1em', marginBottom:'0.9rem' }}>ALL NOTES</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1.1rem' }}>
            {regular.map(n=><NoteCard key={n.id} note={n} onEdit={()=>openEdit(n)} onDelete={()=>remove(n.id)}/>)}
          </div>
        </>
      )}

      {notes.length === 0 && !showForm && (
        <div style={{ textAlign:'center', padding:'5rem 0', color:C.text4 }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>📝</div>
          <div style={{ fontSize:'0.85rem' }}>No notes yet — write your first one!</div>
        </div>
      )}
    </div>
  );
}
