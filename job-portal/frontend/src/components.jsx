import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import { STATUS, skillList } from './util';

export function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="nav">
      <div className="container nav-in">
        <Link to="/" className="brand">Hire<b>Lane</b></Link>
        <nav>
          <NavLink to="/" end>Find jobs</NavLink>
          {user?.role === 'CANDIDATE' && <NavLink to="/candidate">My applications</NavLink>}
          {user?.role === 'RECRUITER' && <>
            <NavLink to="/recruiter" end>Dashboard</NavLink>
            <NavLink to="/recruiter/company">Company</NavLink>
            <NavLink to="/recruiter/jobs/new">Post a job</NavLink>
          </>}
        </nav>
        <div className="nav-user">
          {user ? <><span className="muted">{user.name}</span><button className="btn ghost sm" onClick={() => { logout(); nav('/'); }}>Log out</button></>
            : <><Link className="btn ghost sm" to="/login">Log in</Link><Link className="btn sm" to="/register">Sign up</Link></>}
        </div>
      </div>
    </header>
  );
}

export const Skills = ({ value }) => <div className="chips">{skillList(value).map(s => <span className="chip" key={s}>{s}</span>)}</div>;
export const Alert = ({ children, kind = 'error' }) => children ? <p className={'alert ' + kind}>{children}</p> : null;
export const Empty = ({ title, children }) => <div className="empty"><h3>{title}</h3><p>{children}</p></div>;

const FLOW = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'HIRED'];
export function Tracker({ status }) {
  if (status === 'REJECTED') return <span className="badge red">Not selected</span>;
  const i = FLOW.indexOf(status);
  return <ol className="tracker">{FLOW.map((s, k) => <li key={s} className={k < i ? 'done' : k === i ? 'now' : ''}><i />{STATUS[s]}</li>)}</ol>;
}
