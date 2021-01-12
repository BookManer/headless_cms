export const useAuthInterceptor = (instanceAxios) => {
    instanceAxios.interceptors.request.use((req) => {
        // Отправляем токен авторизированного пользователя во всех случаях кроме входа и регистрации
        if (!req.url.includes('auth')) {
            req.headers = {...req.headers, 'Authorization': 'Bearer ' + localStorage.getItem('token')}
            req.query = {...req.data, token: localStorage.getItem('token')}
        }
        return Promise.resolve(req);
    })
    instanceAxios.interceptors.response.use((res) => {
        res.headers = {...res.headers, 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'POST, GET, PUT, UPDATE, DELETE, OPTIONS',
            'Access-Control-Allow-Methods': '*'
        }
        // Если в ответе нам прилетел токен, запишем его в localStorage
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
        }
        return Promise.resolve(res);
    }, (e) => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    })
}