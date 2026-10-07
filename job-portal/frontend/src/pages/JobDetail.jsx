import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import { Alert, Skills, Tracker } from '../components';
import { TYPES, salary, date } from '../util';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(null);
  const [cover, setCover] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    api('/jobs/' + id).then(setJob).catch(e => setErr(e.message));
    if (user?.role === 'CANDIDATE') api('/applications/mine').then(a => setApplied(a.find(x => x.job.id === +id) || null)).catch(() => {});
  }, [id, user]);

  const apply = () => { setErr(''); api(`/jobs/${id}/apply`, { method: 'POST', body: { coverLetter: cover } }).then(setApplied).catch(e => setErr(e.message)); };
  if (!job) return <Alert>{err}</Alert>;

  return <div className="split">
    <article className="card pad">
      <p className="muted">{job.company.name} · {job.company.location}</p>
      <h1>{job.title}</h1>
      <div className="meta"><span className="badge">{TYPES[job.employmentType]}</span><span>{job.location}</span><strong>{salary(job)}</strong><span className="muted">Posted {date(job.createdAt)}</span></div>
      <Skills value={job.skills} />
      <h3>About the role</h3><p className="pre">{job.description}</p>
      <h3>About {job.company.name}</h3><p className="pre">{job.company.description || 'No company description yet.'}</p>
      {job.company.website && <p><a href={job.company.website} target="_blank" rel="noreferrer">{job.company.website}</a></p>}
    </article>
    <aside className="card pad sticky">
      <h3>Apply for this job</h3>
      <Alert>{err}</Alert>
      {!job.active && <Alert>This job is closed and no longer accepts applications.</Alert>}
      {!user && job.active && <><p className="muted">Create a free job seeker account to apply.</p><Link className="btn block" to="/login">Log in to apply</Link></>}
      {user?.role === 'RECRUITER' && <p className="muted">Employer accounts can't apply. Switch to a job seeker account.</p>}
      {user?.role === 'CANDIDATE' && applied && <><Alert kind="ok">You applied on {date(applied.appliedAt)}.</Alert><Tracker status={applied.status} /></>}
      {user?.role === 'CANDIDATE' && !applied && job.active && <>
        {!user.resumeName && <Alert kind="warn">Add your resume first. <Link to="/candidate">Upload resume</Link></Alert>}
        {user.resumeName && <p className="muted">Resume: <b>{user.resumeName}</b></p>}
        <label>Cover letter (optional)<textarea rows="5" value={cover} onChange={e => setCover(e.target.value)} placeholder="Tell the employer why you're a good fit" /></label>
        <button className="btn block" onClick={apply} disabled={!user.resumeName}>Submit application</button>
      </>}
    </aside>
  </div>;
}
