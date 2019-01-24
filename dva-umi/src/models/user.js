import Api from './../utils/request'
import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'
export default {
    namespace: 'user',
    state: { isLogin: false, user: {} },
    effects: {
        *fetch({ payload }, { call, put }) {
            yield put({ type: 'save' });
        },
        *register({ payload: { pwd, name, cb } }, { call, put }) {
            const result = yield call(Api, 'api/register', 'POST', { name, pwd })
            cb && cb(result)
            result.success && (yield put({
                type: 'callRegister',
                payload: { ...result, isLogin: false }
            }))
        },
        *setAvatar(state, { call, put }){
            const { payload: { avatar, name, fileName, cb } } = state
            const result = yield call(Api, 'api/set-avatar', 'POST', { avatar, name, fileName: fileName.replace(/jpeg+|JPEG/g, 'jpg') })
            cb && cb(result)
            yield put({
                type: 'callSetAvatar',
                payload: { ...result, [result.success && 'avatar']: result.success && `/upload/user_avatar/${fileName.replace(/jpeg+|JPEG/g, 'jpg')}` }
            })
        },
        *getUserInfo({ payload: { cb }}, { call, put }) {
            const result = yield call(Api, 'api/getUserInfoByToken', 'POST')
            yield put({
                type: 'callGetUserInfo',
                payload: {
                    isLogin: result.success,
                    ...(result instanceof Object ? result.user : {})
                }
            })
            yield cb && cb()
        },
        *login({ payload: { pwd, name, state, cb } }, { call, put }) {
            const result = yield call(Api, 'api/login', 'POST', { name, pwd, state, cb })
            cb && cb(result)
            yield put({
                type: 'callLogin',
                payload: {
                    isLogin: result.success,
                    ...(result instanceof Object ? result : {})
                }
            })
        }
    },
    reducers: {
        callSetAvatar(state, { payload }){
            return {
                ...state,
                ...payload
            }
        },
        signOut(state){
            Cookies.remove('user')
            Cookies.remove('token')
            return {
                isLogin: false,
                user: { }
            }
        },
        callGetUserInfo(state, { payload }) {
            return {
                ...payload
            }
        },
        callRegister(state, { payload }) {
            return payload
        },
        callLogin(state, { payload }) {
            if (payload.success && payload.token) {
                Cookies.set('token', payload.token, { expires: 2 })
                Cookies.set('user', Base64.encode(payload.name), { expires: 2 })
            }
            return payload
        }
    },
    subscriptions: {
        setup({ dispatch, history }, state) {  // eslint-disable-line
            // history.listen(location => {
            //     if (location.pathname === '/home') {
            //         if (!state.isLogin && !!Cookies.get('user')) {
            //             dispatch({ type: 'getUserInfo' })
            //         }
            //     }
            // })
        },
    }
};
