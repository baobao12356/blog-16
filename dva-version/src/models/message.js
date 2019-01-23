import Api from './../utils/request'

export default {
    namespace: 'message',
    state: { data: [], fly: [], pageSizeData: [] },
    reducers: {
        // callLeaveMsg(state, { payload }){
        //     sessionStorage.setItem('messages', JSON.stringify(payload))
        //     return { ...state, data: [...payload], fly: state.fly, pageSizeData: state.pageSizeData }
        // },
        loadMessage(state, { payload }) {
            const msgs = []
            const fly = []
            const SINGLE_PAGE_DATA_COUNT = 6
            for (let i = 0; i < 5; i++)
                msgs.push(Math.floor(Math.random() * payload.length))
            if (payload.length !== 0) {
                for (let item of msgs)
                    payload[item] && fly.push(payload[item])
            }
            for (let item of payload)
                item.repeat && (item.repeat = item.repeat.reverse())
            return { ...state, data: payload, fly: [...fly], pageSizeData: payload.slice(0, SINGLE_PAGE_DATA_COUNT) }
        },
        init(state){
            for (let item of state.data){
                item.open = false
                item.operation = false
            }
            return { ...state }
        },
        renderPageSize(state, { payload: { page, cb } }) {
            const SINGLE_PAGE_DATA_COUNT = 6
            const start = (page - 1) * SINGLE_PAGE_DATA_COUNT
            const pageSizeData = state.data.slice(start, start + SINGLE_PAGE_DATA_COUNT)
            cb && cb()
            return {
                ...state,
                pageSizeData
            }

        },
        toggleList(state, { payload }) {
            const list = state.data.map(item => {
                item._id === payload && (item.open = !item.open)
                return item
            })
            return {
                ...state,
                data: list
            }
        },
        toggleOperation(state, { payload }) {
            if (payload.name === 'operation1') {
                const list = state.data.map(item => {
                    item._id === payload._id && (item.operation = !item.operation)
                    return item
                })
                return { ...state, data: list }
            }
            else {
                for (let item of state.data) {
                    if (item._id === payload._parentId && item.repeat) {
                        for (let repeat of item.repeat)
                            if (repeat._id === payload._id) {
                                repeat.operation = !repeat.operation
                                break
                            }
                    }
                }
                return { ...state, data: [...state.data] }
            }
        }
    },
    effects: {
        *load({ payload }, { call, put }) {
            const messages = sessionStorage.getItem('messages')
            if (!!messages) {
                const name = [...new Set((JSON.parse(messages)).map(item => item.name))]
                const avatars = yield call(Api, 'api/all_user_avatar', 'POST', { name })
                const msgs = JSON.parse(messages).map(item => {
                    for (let _item of avatars.data)
                        item.name === _item.name && (item.avatar = _item.avatar)
                    return item
                })
                yield put({
                    payload: msgs,
                    type: 'loadMessage'
                })
                yield payload.cb && payload.cb()
                return
            }
            const result = yield call(Api, 'api/getAllMessages')
            const name = [...new Set(result.data.map(item => item.name))]
            const avatars = yield call(Api, 'api/all_user_avatar', 'POST', { name })
            const msgs = result.data.map(item => {
                for (let _item of avatars.data)
                    item.name === _item.name && (item.avatar = _item.avatar)
                return item
            })
            result.success && sessionStorage.setItem('messages', JSON.stringify(result.data))
            yield put({
                payload: result.success ? msgs : result,
                type: 'loadMessage'
            })
            yield payload.cb && payload.cb()            
        },
        *deleteMsgInner({ payload: { cb, _id, _parent_id } }, { call, put }){
            const result = yield call(Api, 'api/deleteInnerRepeat', 'POST', { _id, _parent_id })
            cb && cb(result)
            if (result.success){
                const messages = sessionStorage.getItem('messages')
                const _data = JSON.parse(messages)
                for (let item of _data){
                    if (item._id === _parent_id){
                        item.open = true
                        const _repeat = item.repeat.filter(repeat => repeat._id !== _id)
                        item.repeat = [..._repeat]
                        break
                    }
                }
                sessionStorage.setItem('messages', JSON.stringify(_data))
                yield put({
                    type: 'loadMessage',
                    payload: _data
                })
            }
        },
        *deleteMsg({ payload: { _id, cb } }, { call, put }) {
            const result = yield call(Api, 'api/deleteMsgById', 'POST', { _id })
            cb && cb(result)
            if (result.success) {
                const messages = sessionStorage.getItem('messages')
                const _data = JSON.parse(messages).filter(item => item._id !== _id)
                sessionStorage.setItem('messages', JSON.stringify(_data))
                yield put({
                    type: 'loadMessage',
                    payload: _data
                })
            }
        },
        *repeatMsg({ payload: { cb, toRepeat, _id, info } }, { call, put }){
            const result = yield call(Api, 'api/repeatmsg', 'POST', { _id, toRepeat, info })
            cb && cb(result)
            
            if (result.success){
                for (let item of result.data){
                    if (item._id === _id){
                        item.open = true
                        break
                    }
                }
                sessionStorage.setItem('messages', JSON.stringify(result.data.reverse()))
                yield put({
                    type: 'loadMessage',
                    payload: result.data
                })
            }
        },
        *leaveMessage(action, { call, put }) {
            const { payload: { date, content, name, cb } } = action
            const result = yield call(Api, 'api/leaveMsg', 'POST', { date, content, name })
            cb && cb(result)
            if (result.success) {
                const messages = sessionStorage.getItem('messages')
                sessionStorage.setItem('messages', JSON.stringify([result.data, ...JSON.parse(messages)]))
                yield put({
                    type: 'loadMessage',
                    payload: [result.data, ...JSON.parse(messages)]
                })
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }, state) {  // eslint-disable-line
            history.listen(location => {
                if (location.pathname === '/message') {
                    dispatch({ type: 'load' , payload: { }})
                }
            })
        },
    }
}