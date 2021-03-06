import React from 'react'
import styles from './index.less'
import { connect } from 'dva'
import { Base64 } from 'js-base64'
import Cookies from 'js-cookie'

@connect(({ user, toast, loading, dynamic, article, message }) => ({ user, toast, loading, dynamic, article, message }))
export class Index extends React.Component {
    state = {
        isLogin: false
    }
    changeLogin(type) {
        this.setState({
            isLogin: type === 'login'
        })
    }
    handelKeyDown(e) {
        e.keyCode === 13 && this.handleSubmit(e.target.getAttribute('_type'))
    }
    componentDidMount() {
        const { dispatch, user } = this.props
        const needLoading = !sessionStorage.getItem('dynamics') || !sessionStorage.getItem('articles') || !sessionStorage.getItem('messages')
        const preLoad = async () => {
            try {
                await dispatch({ type: 'loading/loading', payload: true })
                await dynamic()
                await article()
                await messages()
                await dispatch({ type: 'loading/loading', payload: false })
            } catch (error) {
                console.log(error)
            }
        }
        const dynamic = () => { return new Promise(resolve => dispatch({ type: 'dynamic/load', payload: { cb: resolve } })) }
        const article = () => { return new Promise(resolve => dispatch({ type: 'article/load', payload: { cb: resolve } })) }
        const messages = () => { return new Promise(resolve => dispatch({ type: 'message/load', payload: { cb: resolve } })) }
        needLoading && preLoad()
        if (!user.isLogin && !!Cookies.get('user')) {
            // dispatch({ type: 'loading/loading', payload: true })
            dispatch({
                type: 'user/getUserInfo',                                                                                                                                             
                payload: {
                    // cb: () => dispatch({ type: 'loading/loading', payload: false })
                }
            })
        }
    }
    handleSubmit(type) {
        const { props: { dispatch } } = this
        const { regName, regPassword, regRepeatPassword, loginName, loginPassword } = this.refs
        if (type === 'login') {
            const name = loginName.value
            const pwd = loginPassword.value
            if (!name || /\s/.test(name) || !pwd || /\s/.test(pwd)) {
                dispatch({
                    type: 'toast/open',
                    payload: { type: 'fail', msg: '不能为空且不能包含空格' }
                })
                return
            }
            dispatch({ type: 'loading/loading', payload: true })
            dispatch({
                type: 'user/login',
                payload: {
                    pwd: Base64.encode(pwd), name, state: true,
                    cb: result => {
                        dispatch({ type: 'loading/loading', payload: false })
                        dispatch({ type: 'toast/open', payload: { type: result.success ? 'success' : 'fail', msg: result.success ? '登陆成功！' : result.errorMsg || result } })
                    }
                }
            })
        }
        else if (type === 'register') {
            const name = regName.value
            const password = regPassword.value
            const repeatPassword = regRepeatPassword.value
            if (!name || /\s/.test(name)) {
                dispatch({
                    type: 'toast/open',
                    payload: {
                        msg: '用户名不能为空且不能包含空格',
                        type: 'fail'
                    }
                })
                return
            }
            if (name.length > 20 || name.length < 3) {
                dispatch({
                    type: 'toast/open',
                    payload: {
                        msg: '用户名长度3-20',
                        type: 'fail'
                    }
                })
                return
            }
            if (!password || /\s/.test(password)) {
                dispatch({
                    type: 'toast/open',
                    payload: {
                        msg: '密码不能为空且不能包含空格',
                        type: 'fail'
                    }
                })
                return
            }
            if (password.length > 15 || password.length < 6) {
                dispatch({
                    type: 'toast/open',
                    payload: {
                        msg: '密码长度6-15',
                        type: 'fail'
                    }
                })
                return
            }
            if (password !== repeatPassword) {
                dispatch({
                    type: 'toast/open',
                    payload: {
                        msg: '两次密码不一致',
                        type: 'fail'
                    }
                })
                return
            }
            dispatch({ type: 'loading/loading', payload: true })
            dispatch({
                type: 'user/register',
                payload: {
                    name,
                    pwd: Base64.encode(password),
                    cb: result => {
                        dispatch({ type: 'loading/loading', payload: false })
                        !result.success && dispatch({ type: 'toast/open', payload: { type: 'fail', msg: result } })
                        if (result.success) {
                            dispatch({ type: 'toast/open', payload: { type: 'success', msg: '注册成功' } })
                            this.setState({
                                isLogin: true
                            })
                        }
                    }
                }
            })
        }
    }
    handleUpload(info) {
        const file = info.nativeEvent.target.files[0]
        handleFile.call(this, file)
    }
    render() {
        const { user } = this.props
        const h = new Date().getHours()
        let t = ''
        if (h > 1 && h <= 6) t = '凌晨了'
        else if (h <= 12) t = '早上好'
        else if (h >= 13 && h <= 18) t = '下午好'
        else t = '晚上好'
        return (
            <div className={styles.indexContainer}>
                <div className={styles.leftContainer}>
                    <p className={`${styles.welcome} ${styles.fromLeft}`}>WELCOME TO HOME PAGE</p>
                    <h2 className={`${styles.extrc} ${styles.fromTop}`}> Maybe you can't save the world</h2>
                    <h2 className={`${styles.extrc2} fromBottom`}> But you can change the world</h2>
                </div>
                {
                    !!Cookies.get('user') && user.isLogin &&
                    <div className={styles.loginFinish}>
                        {/* <div className={styles.circleInfo}>
                            <div className={styles.name}>{user.name}</div>
                        </div> */}
                        <div className={styles.userAvatar}>
                            <input type="file" title='' onChange={(info) => this.handleUpload(info)} />
                            <img src={user.avatar} alt="" />
                        </div>
                        <div className={styles.welcomeWord}>
                            <span>{user.name}</span>
                        </div>
                        <div className={styles.operation}>
                            <div>
                                <span>{t}</span>
                            </div>
                            <div onClick={() => {
                                this.props.dispatch({
                                    type: 'user/signOut'
                                })
                            }} className={styles.signOut}>
                                <span>注销</span>
                            </div>
                        </div>
                    </div>
                }
                {
                    !Cookies.get('user') && <div className={styles.rightContainer}>
                        <div className={styles.top}>
                            <div onClick={() => this.changeLogin('signUp')} className={`${styles.selectSignUp} ${!this.state.isLogin && styles.current}`}>Sign up</div>
                            <div onClick={() => this.changeLogin('login')} className={`${styles.selectLogin} ${this.state.isLogin && styles.current}`}>Login</div>
                        </div>
                        <div className={styles.down} onKeyDown={(e) => this.handelKeyDown(e)}>
                            <ul className={`${this.state.isLogin && styles.currentType}`}>
                                <li>
                                    <form>
                                        <div className={styles.inputItem}>
                                            <span>Username</span>
                                            <input autoComplete="off" ref='regName' _type='register' className='input' type='text' />
                                        </div>
                                        <div className={styles.inputItem}>
                                            <span>Password</span>
                                            <input autoComplete="off" ref='regPassword' _type='register' className='input' type='password' />
                                        </div>
                                        <div className={styles.inputItem}>
                                            <span>Repeat Password</span>
                                            <input autoComplete="off" ref='regRepeatPassword' _type='register' className='input' type='password' />
                                        </div>
                                        <div className={styles.inputItem}>
                                            <div onClick={() => this.handleSubmit('register')} className={styles.btn}>Sign up</div>
                                        </div>
                                    </form>
                                </li>
                                <li>
                                    <form>
                                        <div className={styles.inputItem}>
                                            <span>Username</span>
                                            <input autoComplete="off" ref='loginName' _type='login' className='input' type='text' />
                                        </div>
                                        <div className={styles.inputItem}>
                                            <span>Password</span>
                                            <input autoComplete="off" ref='loginPassword' _type='login' className='input' type='password' />
                                        </div>
                                        <div className={styles.inputItem}>
                                            <div onClick={() => this.handleSubmit('login')} className={styles.btn}>Login</div>
                                        </div>
                                    </form>
                                </li>
                            </ul>
                        </div>
                    </div>
                }
                <div className={styles.footerInfo}>
                    React Blog  ©  2019 Adaxh
                </div>
            </div>
        )
    }
}

function handleFile(file) {
    const { name } = file
    const { props } = this
    if (!/png+|jpeg+|gif+|GIF+|PNG+|JPEG/.test(file.type)) {
        props.dispatch({ type: 'toast/open', payload: { type: 'fail', msg: '不支持的图片类型' } })
        return
    }
    const fileReader = new FileReader()
    fileReader.readAsBinaryString(file)
    fileReader.onload = e => {
        props.dispatch({ type: 'loading/loading', payload: true })
        props.dispatch({
            type: 'user/setAvatar',
            payload: {
                avatar: e.target.result,
                name: props.user.name,
                fileName: name,
                cb: result => {
                    props.dispatch({ type: 'toast/open', payload: { type: result.success ? 'success' : 'fail', msg: result.success ? '头像更新成功' : '头像更新失败' } })
                    props.dispatch({ type: 'loading/loading', payload: false })
                }
            }
        })
    }
}