// Thin fetch wrapper: adds the auth token, parses JSON, surfaces server messages as Error.message
export async function api(path, { method = 'GET', body, form } = {}) {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers.Authorization = 'Bearer ' + token;
  if (body) headers['Content-Type'] = 'application/json';
  const r = await fetch('/api' + path, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) });
  const text = await r.text();
  const data = text ? JSON.parse(text) : null;
  if (!r.ok) {
    if (r.status === 401 && token) { localStorage.clear(); window.location.href = '/login'; }
    throw new Error((data && data.message) || 'Something went wrong. Please try again.');
  }
  return data;
}

export async function download(path, name) {
  const r = await fetch('/api' + path, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
  if (!r.ok) throw new Error('Could not download the file');
  const url = URL.createObjectURL(await r.blob());
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}
