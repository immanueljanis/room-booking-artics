export async function apiRequest({
    url,
    method = 'GET',
    needAuth = false,
    params = {},
    body = null,
}) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || '';
    const apiPrefix = baseUrl + '/api';

    const cleanPath = url.startsWith('/') ? url : '/' + url;

    let finalUrl = apiPrefix + cleanPath;
    if ((method === 'GET' || method === 'DELETE') && Object.keys(params).length) {
        const qs = new URLSearchParams(params).toString();
        finalUrl += `?${qs}`;
    }

    const fetchOptions = {
        method,
        headers: { Accept: 'application/json' },
    };

    if (needAuth) fetchOptions.credentials = 'include';

    if (method !== 'GET' && method !== 'HEAD') {
        fetchOptions.headers['Content-Type'] = 'application/json';
        fetchOptions.body = JSON.stringify(body);
    }

    const res = await fetch(finalUrl, fetchOptions);
    const payload = await res.json();

    if (!res.ok) {
        throw new Error(payload.message || res.statusText);
    }
    return payload;
}  