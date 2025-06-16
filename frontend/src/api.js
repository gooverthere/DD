export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : '',
  };
  const opts = { ...options, headers };
  return fetch(url, opts);
}
