import Api from './../utils/request'
// import { routerRedux } from 'dva/router'
export default {
    namespace: 'article',
    state: { data: [], hot: [], detail: { } },
    reducers: {
        loadArticle(state, { payload }) {
            const hot = JSON.parse(payload).sort((a, b) => b.viewer - a.viewer)
            return { ...state, detail: { visible: false }, data: [...JSON.parse(payload)], hot: hot.slice(0, 3) }
        },
        filter(state, { payload }) {
            if (/0/.test(payload)) {
                for (let item of state.data) item.show = item.year === payload
                return { ...state }
            }
            if (payload === 'Time') {
                for (let item of state.data) item.show = true
                return { ...state, data: [...state.data.reverse()] }
            }
            for (let item of state.data) {
                item.show = payload === item.type || payload === 'All'
            }
            return { ...state, data: [...state.data] }
        },
        callAddViewer(state, { _id }){
            const detail = state.data.filter(item => item._id === _id)
            return {
                ...state,
                detail: { ...detail[0], visible: true }
            }
        }
    },
    effects: {
        *addViewer({ _id }, { call, put }) {
            const hasUpvote = JSON.parse(localStorage.getItem('hasUpvote')) || []
            if (!hasUpvote.includes(_id)) {
                hasUpvote.push(_id)
                localStorage.setItem('hasUpvote', JSON.stringify(hasUpvote))                
                yield call(Api, 'api/updateArticleViewerById', 'POST', { _id })                
            }
            yield put({
                _id,
                type: 'callAddViewer'
            })
        },
        *load({ payload }, { call, put }) {
            const articles = sessionStorage.getItem('articles')
            if (!!articles) {
                yield put({
                    payload: articles,
                    type: 'loadArticle'
                })
                yield payload.cb && payload.cb()                
                return
            }
            const result = yield call(Api, 'api/getArticles')
            for (let item of result.data) item.show = true
            result.success && sessionStorage.setItem('articles', JSON.stringify(result.data))
            yield put({
                payload: result.success ? JSON.stringify(result.data) : result,
                type: 'loadArticle'
            })
            yield payload.cb && payload.cb()
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line  
            history.listen(location => {
                if (location.pathname === '/article') {
                    dispatch({ type: 'load' , payload: {}})
                }
            })
        },
    }
}