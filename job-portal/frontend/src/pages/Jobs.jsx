import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Alert, Empty, Skills } from '../components';
import { TYPES, salary, date } from '../util';

export default function Jobs() {
  const [f, setF] = useState({ q: '', skill: '', location: '', type: '', minSalary: '' });
  const [jobs, setJobs] = useState(null);
  const [err, setErr] = useState('');
  const set = k => e => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    const t = setTimeout(() => {
      const p = new URLSearchParams(Object.entries(f).filter(([, v]) => v));
      api('/jobs?' + p).then(setJobs).catch(e => setErr(e.message));
    }, 300);
    return () => clearTimeout(t);
  }, [f]);

  return <>
    <section className="hero">
      <h1>Find work that fits your skills</h1>
      <p>Search open roles by skill, city, salary and job type. Apply in a minute with your saved resume.</p>
      <div className="filters">
        <label>Job title or company<input placeholder="e.g. Backend developer" value={f.q} onChange={set('q')} /></label>
        <label>Skill<input placeholder="e.g. Java, React" value={f.skill} onChange={set('skill')} /></label>
        <label>Location<input placeholder="e.g. Chennai" value={f.location} onChange={set('location')} /></label>
        <label>Job type<select value={f.type} onChange={set('type')}><option value="">Any type</option>
          {Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label>Min. yearly salary (₹)<input type="number" min="0" step="50000" placeholder="e.g. 600000" value={f.minSalary} onChange={set('minSalary')} /></label>
        <button className="btn ghost" onClick={() => setF({ q: '', skill: '', location: '', type: '', minSalary: '' })}>Clear filters</button>
      </div>
    </section>
    <Alert>{err}</Alert>
    {jobs && <p className="muted count">{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found</p>}
    <div className="list">
      {jobs?.map(j => (
        <Link to={`/jobs/${j.id}`} className="card job" key={j.id}>
          <div className="logo">{j.company.name[0]}</div>
          <div className="grow">
            <h3>{j.title}</h3>
            <p className="muted">{j.company.name} · {j.location || 'Location flexible'}</p>
            <Skills value={j.skills} />
          </div>
          <div className="side">
            <span className="badge">{TYPES[j.employmentType]}</span>
            <strong>{salary(j)}</strong>
            <small className="muted">Posted {date(j.createdAt)}</small>
          </div>
        </Link>
      ))}
      {jobs?.length === 0 && <Empty title="No jobs match your search">Try removing a filter or searching a broader skill.</Empty>}
    </div>
  </>;
}
