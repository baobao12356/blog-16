import Api from './../utils/request'

export default {
    namespace: 'dynamic',
    state: {},
    reducers: {
        loadDynamic(state, { payload }) {
            payload.cb && payload.cb()
            return [...payload]
        },
        callUpvote(state, { payload: { _id, upvote } }) {
            for (let item of state)
                if (item._id === _id) {
                    item.upvote = upvote
                    break
                }
            sessionStorage.setItem('dynamics', JSON.stringify([...state]))            
            return [
                ...state
            ]
        }
    },
    effects: {
        *upvote(action, { call, put }) {
            const { payload: { upvote, _id, cb } } = action
            const result = yield call(Api, 'api/upvoteDynamic', 'POST', { upvote, _id })
            cb && cb(result)
            if (result.success) {
                const hasUpvote = JSON.parse(localStorage.getItem('hasUpvote')) || []
                !hasUpvote.includes(_id) && hasUpvote.push(_id)
                localStorage.setItem('hasUpvote', JSON.stringify(hasUpvote))
                yield put({
                    type: 'callUpvote',
                    payload: { _id, upvote: upvote + 1 }
                })
            }
        },
        *leaveMsg(action, { call, put }) {
            const { payload: { msg, _id, name, cb } } = action
            const result = yield call(Api, 'api/leave-dynamic-mg', 'POST', { msg, _id, name })
            for (let item of result.data) {
                if (item._id === _id) {
                    cb && cb(item)
                    break
                }
            }
            !result.success && cb && cb(false)
            if (result.success) {
                sessionStorage.setItem('dynamics', JSON.stringify(result.data.reverse()))
                yield put({
                    type: 'load',
                    payload: {
                        ...result.data
                    }
                })
            } else yield put({
                type: 'loadDynamic',
                payload: {}
            })
        },
        *load({ payload }, { call, put }) {
            const dynamics = sessionStorage.getItem('dynamics')
            if (!!dynamics) {
                yield put({
                    payload: JSON.parse(dynamics),
                    type: 'loadDynamic'
                })
                yield payload.cb && payload.cb()                  
                return
            }
            const result = yield call(Api, 'api/getDynamic')
            result.success && sessionStorage.setItem('dynamics', JSON.stringify(result.data))
            payload.cb && payload.cb()
            yield put({
                payload: result.success ? result.data : result,
                type: 'loadDynamic'
            })
            yield payload.cb && payload.cb()  
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
            history.listen(location => {
                if (location.pathname === '/dynamic') {
                    dispatch({ type: 'load', payload: {} })
                }
            })
        },
    }
}