import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import { Alert } from '../components';

export default function Auth({ mode }) {
  const reg = mode === 'register';
  const [f, setF] = useState({ role: 'CANDIDATE', name: '', email: '', phone: '', password: '', companyName: '' });
  const [err, setErr] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const submit = e => {
    e.preventDefault(); setErr('');
    api(reg ? '/auth/register' : '/auth/login', { method: 'POST', body: f })
      .then(d => { login(d); nav(d.user.role === 'RECRUITER' ? '/recruiter' : '/'); })
      .catch(e => setErr(e.message));
  };

  return <form className="card pad narrow" onSubmit={submit}>
    <h1>{reg ? 'Create your account' : 'Welcome back'}</h1>
    {reg && <div className="seg">
      <button type="button" className={f.role === 'CANDIDATE' ? 'on' : ''} onClick={() => setF({ ...f, role: 'CANDIDATE' })}>I'm looking for a job</button>
      <button type="button" className={f.role === 'RECRUITER' ? 'on' : ''} onClick={() => setF({ ...f, role: 'RECRUITER' })}>I'm hiring</button>
    </div>}
    <Alert>{err}</Alert>
    {reg && <label>Full name<input required value={f.name} onChange={set('name')} /></label>}
    <label>Email<input type="email" required value={f.email} onChange={set('email')} /></label>
    {reg && <label>Phone<input value={f.phone} onChange={set('phone')} /></label>}
    {reg && f.role === 'RECRUITER' && <label>Company name<input required value={f.companyName} onChange={set('companyName')} /></label>}
    <label>Password<input type="password" required minLength={reg ? 6 : 1} value={f.password} onChange={set('password')} placeholder={reg ? 'At least 6 characters' : ''} /></label>
    <button className="btn block">{reg ? 'Create account' : 'Log in'}</button>
    <p className="muted center">{reg ? <>Already registered? <Link to="/login">Log in</Link></> : <>New here? <Link to="/register">Create an account</Link></>}</p>
  </form>;
}
