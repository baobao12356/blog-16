export default {
    namespace: 'load',
    state: { visible: false },
    reducers: {
        loading(state, { payload }){
            // setTimeout(() => {
            //     return { visible: false }
            // }, 2000);
            return { visible: payload }
        }
    }
}