import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import { Alert, Empty, Tracker } from '../components';
import { date } from '../util';

export default function Candidate() {
  const { user, save } = useAuth();
  const [apps, setApps] = useState(null);
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '' });
  const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
  const file = useRef();

  useEffect(() => { api('/applications/mine').then(setApps).catch(e => setErr(e.message)); }, []);

  const run = (p, ok) => { setMsg(''); setErr(''); p.then(u => { save(u); setMsg(ok); }).catch(e => setErr(e.message)); };
  const upload = e => { const fd = new FormData(); fd.append('file', e.target.files[0]); run(api('/profile/resume', { method: 'POST', form: fd }), 'Resume uploaded.'); e.target.value = ''; };

  return <div className="split">
    <section>
      <h1>My applications</h1>
      {apps?.length === 0 && <Empty title="No applications yet">Find a role you like and apply — you can follow every update here. <Link to="/">Browse jobs</Link></Empty>}
      <div className="list">{apps?.map(a => (
        <div className="card pad" key={a.id}>
          <div className="row"><div><h3><Link to={`/jobs/${a.job.id}`}>{a.job.title}</Link></h3><p className="muted">{a.job.company.name} · applied {date(a.appliedAt)}</p></div></div>
          <Tracker status={a.status} />
        </div>))}
      </div>
    </section>
    <aside className="card pad sticky">
      <h3>My profile</h3>
      <Alert>{err}</Alert><Alert kind="ok">{msg}</Alert>
      <label>Full name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
      <label>Phone<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
      <button className="btn ghost block" onClick={() => run(api('/profile', { method: 'PUT', body: form }), 'Profile saved.')}>Save profile</button>
      <h3>Resume</h3>
      <p className="muted">{user.resumeName ? <>Current file: <b>{user.resumeName}</b></> : 'No resume uploaded yet.'}</p>
      <input ref={file} type="file" accept=".pdf,.doc,.docx" hidden onChange={upload} />
      <button className="btn block" onClick={() => file.current.click()}>{user.resumeName ? 'Replace resume' : 'Upload resume'}</button>
      <small className="muted">PDF, DOC or DOCX, up to 5 MB. Employers see the file you had when you applied.</small>
    </aside>
  </div>;
}
