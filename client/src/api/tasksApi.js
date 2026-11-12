const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
}

function withTzOffset(params = {}) {
  const searchParams = new URLSearchParams({
    tzOffset: String(new Date().getTimezoneOffset()),
    ...params,
  });
  return searchParams.toString();
}

export function fetchWeeklySummary() {
  return request(`/api/tasks/weeks?${withTzOffset()}`);
}

export function fetchTasks(params = {}) {
  return request(`/api/tasks?${withTzOffset(params)}`);
}

export function searchTasks(query) {
  const params = new URLSearchParams({ q: query });
  return request(`/api/tasks/search?${params.toString()}`);
}

export function createTask(payload) {
  return request('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateTask(id, payload) {
  return request(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteTask(id) {
  return request(`/api/tasks/${id}`, {
    method: 'DELETE',
  });
}

