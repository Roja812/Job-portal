import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, download } from '../api';
import { Alert, Empty } from '../components';
import { STATUS, date } from '../util';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]); const [apps, setApps] = useState([]); const [company, setCompany] = useState(null);
  const [jobF, setJobF] = useState(''); const [stF, setStF] = useState(''); const [open, setOpen] = useState(null); const [err, setErr] = useState('');

  const load = () => Promise.all([api('/jobs/mine'), api('/applications/recruiter'), api('/company/me')])
    .then(([j, a, c]) => { setJobs(j); setApps(a); setCompany(c); }).catch(e => setErr(e.message));
  useEffect(() => { load(); }, []);

  const guard = p => p.catch(e => setErr(e.message));
  const setStatus = (a, status) => guard(api(`/applications/${a.id}/status`, { method: 'PUT', body: { status } }).then(u => setApps(apps.map(x => x.id === u.id ? u : x))));
  const toggle = j => guard(api('/jobs/' + j.id, { method: 'PUT', body: { ...j, active: !j.active } }).then(load));
  const remove = j => confirm(`Delete "${j.title}" and all its applications?`) && guard(api('/jobs/' + j.id, { method: 'DELETE' }).then(load));
  const count = s => apps.filter(a => a.status === s).length;
  const shown = apps.filter(a => (!jobF || a.job.id === +jobF) && (!stF || a.status === stF));
  const appCount = id => apps.filter(a => a.job.id === id).length;

  return <>
    <div className="row between"><h1>Recruiter dashboard</h1><Link className="btn" to="/recruiter/jobs/new">Post a job</Link></div>
    <Alert>{err}</Alert>
    {company && !company.location && !company.description && <Alert kind="warn">Your company profile is incomplete. <Link to="/recruiter/company">Add details</Link> so candidates trust your listings.</Alert>}
    <div className="stats">
      {[['Jobs posted', jobs.length], ['Open jobs', jobs.filter(j => j.active).length], ['Applications', apps.length], ['New to review', count('APPLIED')], ['Shortlisted', count('SHORTLISTED')], ['Hired', count('HIRED')]]
        .map(([l, v]) => <div className="stat" key={l}><b>{v}</b><span>{l}</span></div>)}
    </div>

    <h2>Your jobs</h2>
    {jobs.length === 0 ? <Empty title="You haven't posted a job yet"><Link to="/recruiter/jobs/new">Post your first job</Link> to start receiving applications.</Empty> :
      <div className="card table-wrap"><table>
        <thead><tr><th>Job</th><th>Status</th><th>Applicants</th><th>Posted</th><th></th></tr></thead>
        <tbody>{jobs.map(j => <tr key={j.id}>
          <td><Link to={`/jobs/${j.id}`}>{j.title}</Link><br /><small className="muted">{j.location}</small></td>
          <td><span className={'badge ' + (j.active ? 'green' : 'grey')}>{j.active ? 'Open' : 'Closed'}</span></td>
          <td><button className="link" onClick={() => setJobF(String(j.id))}>{appCount(j.id)} applicants</button></td>
          <td>{date(j.createdAt)}</td>
          <td className="actions"><Link className="btn ghost sm" to={`/recruiter/jobs/${j.id}/edit`}>Edit</Link>
            <button className="btn ghost sm" onClick={() => toggle(j)}>{j.active ? 'Close' : 'Reopen'}</button>
            <button className="btn danger sm" onClick={() => remove(j)}>Delete</button></td>
        </tr>)}</tbody></table></div>}

    <h2>Applications</h2>
    <div className="row filters-row">
      <select value={jobF} onChange={e => setJobF(e.target.value)}><option value="">All jobs</option>{jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}</select>
      <select value={stF} onChange={e => setStF(e.target.value)}><option value="">All statuses</option>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
    </div>
    {shown.length === 0 ? <Empty title="No applications to show">New applications appear here as candidates apply.</Empty> :
      <div className="list">{shown.map(a => <div className="card pad" key={a.id}>
        <div className="row between wrap">
          <div><h3>{a.candidate.name}</h3><p className="muted">{a.candidate.email}{a.candidate.phone && ' · ' + a.candidate.phone}</p>
            <p>Applied for <b>{a.job.title}</b> on {date(a.appliedAt)}</p></div>
          <div className="row">
            <button className="btn ghost sm" onClick={() => guard(download(`/applications/${a.id}/resume`, a.resumeName))}>Download resume</button>
            <select value={a.status} onChange={e => setStatus(a, e.target.value)}>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          </div>
        </div>
        {a.coverLetter && <><button className="link" onClick={() => setOpen(open === a.id ? null : a.id)}>{open === a.id ? 'Hide cover letter' : 'Read cover letter'}</button>
          {open === a.id && <p className="pre quote">{a.coverLetter}</p>}</>}
      </div>)}</div>}
  </>;
}
