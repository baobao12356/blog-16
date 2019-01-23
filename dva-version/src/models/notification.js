export default {
    namespace: 'toast',
    state: {
        visible: false,
        type: 'success',
        msg: 'msg'
    },
    reducers: {
        open(state, { payload }){
            return {
                visible: true,
                ...payload
            }
        },
        hide(state, { payload }){
            return {
                visible: false
            }
        }
    }
}