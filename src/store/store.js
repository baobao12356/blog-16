import { createStore, combineReducers } from 'redux'
import {
    isLoginReduce,
    logoReducer,
    loginUIREduce,
    asideReduce,
    allData,
    dialogReducer,
    toTopReducer,
    fullScreenReduce,
    imgReduce
} from './reducersModule'

const reducers = combineReducers({
    user: isLoginReduce,
    logo: logoReducer,
    loginUI: loginUIREduce,
    aside: asideReduce,
    datas: allData,
    dialog: dialogReducer,
    toTop: toTopReducer,
    screen: fullScreenReduce,
    img: imgReduce
})
export const Store = createStore(reducers, {})