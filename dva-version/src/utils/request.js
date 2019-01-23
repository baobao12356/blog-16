import fetch from 'dva/fetch'
import Cookies from 'js-cookie'

// function parseJSON(response) {
//   return response.json();
// }

// function checkStatus(response) {
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   }

//   const error = new Error(response.statusText);
//   error.response = response;
//   throw error;
// }

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
// export function _request(url, options) {
//   return fetch(url, options)
//     .then(checkStatus)
//     .then(parseJSON)
//     .then(data => ({ data }))
//     .catch(err => ({ err }));
// }

const isBuild = /5050+|adaxh/.test(window.location.href)

export default function Api(url, method = 'GET', data) {
  const options = {
    method,
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json',
      'authorization': Cookies.get('token') || 'null'
    }
  }
  method === 'POST' && (options.body = JSON.stringify(data))
  return new Promise((resolve, reject) => {
    fetch( isBuild ? url.replace(/api/, '') : url , options).then(response => {
      if (response.status >= 200 && response.status < 300) return response.json()
      return response.status
    }).then(result => {
      resolve(result.success ? result : (result.errorMsg || result))
    })
  })

}