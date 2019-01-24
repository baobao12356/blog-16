import Cookies  from 'js-cookie'

export const API = (url, method = 'GET', data) => {
    const options = {
        method,
        headers: {
            'content-type': 'application/json',
            accept: 'application/json',
            authorization: Cookies.get('token') || 'no-permission'
        }
    }
    method === 'POST' && (options.body = JSON.stringify(data))
    return fetch(url, options).then(res => {
        if (res.status >= 200 && res.status < 300)
            return res.json()
        return res.status === 401 ? res.json() : res.status
    }).then(result => {
        return result.success ? result : result.errorMsg || result
    }).catch(err => { 
        return err
    })
}