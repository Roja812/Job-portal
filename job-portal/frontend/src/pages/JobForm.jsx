import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { Alert } from '../components';
import { TYPES } from '../util';

const blank = { title: '', description: '', skills: '', location: '', salaryMin: '', salaryMax: '', employmentType: 'FULL_TIME', active: true };

export default function JobForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [j, setJ] = useState(blank);
  const [err, setErr] = useState('');
  useEffect(() => { if (id) api('/jobs/' + id).then(setJ).catch(e => setErr(e.message)); }, [id]);
  const set = k => e => setJ({ ...j, [k]: e.target.value });

  const submit = e => {
    e.preventDefault(); setErr('');
    const body = { ...j, salaryMin: j.salaryMin === '' ? null : +j.salaryMin, salaryMax: j.salaryMax === '' ? null : +j.salaryMax };
    api(id ? '/jobs/' + id : '/jobs', { method: id ? 'PUT' : 'POST', body }).then(() => nav('/recruiter')).catch(e => setErr(e.message));
  };

  return <form className="card pad narrow" onSubmit={submit}>
    <h1>{id ? 'Edit job' : 'Post a job'}</h1>
    <Alert>{err}</Alert>
    <label>Job title<input required value={j.title} onChange={set('title')} placeholder="e.g. Java Backend Developer" /></label>
    <div className="two">
      <label>Job type<select value={j.employmentType} onChange={set('employmentType')}>{Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label>Location<input value={j.location || ''} onChange={set('location')} placeholder="e.g. Chennai" /></label>
    </div>
    <label>Required skills<input value={j.skills || ''} onChange={set('skills')} placeholder="Comma separated: Java, Spring Boot, MySQL" /></label>
    <div className="two">
      <label>Min. yearly salary (₹)<input type="number" min="0" value={j.salaryMin ?? ''} onChange={set('salaryMin')} /></label>
      <label>Max. yearly salary (₹)<input type="number" min="0" value={j.salaryMax ?? ''} onChange={set('salaryMax')} /></label>
    </div>
    <label>Job description<textarea required rows="9" value={j.description} onChange={set('description')} placeholder="Responsibilities, requirements, benefits" /></label>
    <label className="check"><input type="checkbox" checked={j.active} onChange={e => setJ({ ...j, active: e.target.checked })} /> Accepting applications</label>
    <div className="row"><button className="btn">{id ? 'Save changes' : 'Publish job'}</button><button type="button" className="btn ghost" onClick={() => nav('/recruiter')}>Cancel</button></div>
  </form>;
}
