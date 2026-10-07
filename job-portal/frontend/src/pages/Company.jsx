import { useEffect, useState } from 'react';
import { api } from '../api';
import { Alert } from '../components';

export default function Company() {
  const [c, setC] = useState(null);
  const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
  useEffect(() => { api('/company/me').then(setC).catch(e => setErr(e.message)); }, []);
  const set = k => e => setC({ ...c, [k]: e.target.value });
  const submit = e => { e.preventDefault(); setMsg(''); setErr(''); api('/company/me', { method: 'PUT', body: c }).then(d => { setC(d); setMsg('Company profile saved.'); }).catch(e => setErr(e.message)); };
  if (!c) return <Alert>{err}</Alert>;

  return <form className="card pad narrow" onSubmit={submit}>
    <h1>Company profile</h1>
    <p className="muted">Candidates see this on every job you post.</p>
    <Alert>{err}</Alert><Alert kind="ok">{msg}</Alert>
    <label>Company name<input required value={c.name || ''} onChange={set('name')} /></label>
    <div className="two">
      <label>Industry<input value={c.industry || ''} onChange={set('industry')} placeholder="e.g. Fintech" /></label>
      <label>Company size<select value={c.companySize || ''} onChange={set('companySize')}><option value="">Select</option>
        {['1-10', '11-50', '51-200', '201-1000', '1000+'].map(s => <option key={s}>{s}</option>)}</select></label>
    </div>
    <div className="two">
      <label>Location<input value={c.location || ''} onChange={set('location')} /></label>
      <label>Website<input value={c.website || ''} onChange={set('website')} placeholder="https://" /></label>
    </div>
    <label>About the company<textarea rows="6" value={c.description || ''} onChange={set('description')} /></label>
    <button className="btn">Save company profile</button>
  </form>;
}
