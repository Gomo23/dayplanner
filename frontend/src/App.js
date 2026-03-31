import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing   from './pages/Landing';
import Layout    from './components/Layout';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks     from './pages/Tasks';
import Expenses  from './pages/Expenses';
import Notes     from './pages/Notes';
import './styles/global.css';

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function Guard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#faf7f4' }}>
      <div style={{ color:'#c4622d', fontSize:'0.85rem', letterSpacing:'0.2em', fontFamily:"'Gill Sans',sans-serif" }}>Loading your planner...</div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: {
            background:'#ffffff',
            color:'#1a1108',
            border:'1px solid #ede5db',
            fontSize:'0.82rem',
            fontFamily:"'Gill Sans','Trebuchet MS',sans-serif",
            borderRadius:'12px',
            boxShadow:'0 8px 32px rgba(100,60,20,0.15)',
          },
          success: { iconTheme: { primary:'#4a7c59', secondary:'#fff' } },
          error:   { iconTheme: { primary:'#c4622d', secondary:'#fff' } },
        }} />
        <Routes>
          <Route path="/"         element={<Landing />} />
          <Route path="/login"    element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
          <Route element={<Guard><Layout /></Guard>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks"     element={<Tasks />} />
            <Route path="/expenses"  element={<Expenses />} />
            <Route path="/notes"     element={<Notes />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
