import Api from './../utils/request'

export default {
    namespace: 'search',
    state: { visible: false, result: [] },
    reducers: {
        searchResult(state, { payload: { result } }) {
            return {
                ...state,
                result
            }
        }
    },
    effects: {
        *search({ payload: { cb, data } }, { call, put }) {
            const result = yield call(Api, 'api/search', 'POST', { data })
            cb && cb(result)            
            yield put({
                type: 'searchResult',
                payload: {
                    result: result.success ? result.result : result
                }
            })

        }
    }
}