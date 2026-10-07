export const TYPES = { FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship', REMOTE: 'Remote' };
export const STATUS = { APPLIED: 'Applied', UNDER_REVIEW: 'Under review', SHORTLISTED: 'Shortlisted', INTERVIEW: 'Interview', HIRED: 'Hired', REJECTED: 'Rejected' };
const money = n => '₹' + Number(n).toLocaleString('en-IN');
export const salary = j =>
  j.salaryMin && j.salaryMax ? `${money(j.salaryMin)} – ${money(j.salaryMax)} / yr`
  : j.salaryMax ? `Up to ${money(j.salaryMax)} / yr`
  : j.salaryMin ? `From ${money(j.salaryMin)} / yr` : 'Salary not disclosed';
export const date = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const skillList = s => (s || '').split(',').map(x => x.trim()).filter(Boolean);
