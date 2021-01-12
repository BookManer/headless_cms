import QuetzalAPI from './api/Quetzal.api';
export const api = QuetzalAPI.Init({
    baseURL: 'http://localhost:4760/api/v2/',
});

interface httpRequestPayload {
    data?: object,
    method: string,
}

export async function http(url: string, payload: httpRequestPayload = {method: 'get'}) {
    const res = await api[payload.method](url, payload.data);
    return res;
}
