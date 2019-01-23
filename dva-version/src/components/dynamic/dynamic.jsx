import React from 'react'
import { connect } from 'dva'
import styles from './dynamic.less'
import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'
import Pagination from './../pagination/pagination'

@connect(({ dynamic, dialog, toast, loading, user }) => ({ dynamic, dialog, toast, loading, user }))
export default

    class Dynamic extends React.Component {
    state = {
        dynamicDetail: {
            visible: false,
            open: false,
        }
    }
    handlePage(index) {
        const SINGLE_PAGE_DATA_COUNT = 6                    
        this.randomItem()
        this.randromCurrent((index - 1) * SINGLE_PAGE_DATA_COUNT, (index - 1) * SINGLE_PAGE_DATA_COUNT + 5)
    }
    randomItem() {
        const lis = document.querySelectorAll('._dynamicItem')
        if (!!lis) {
            for (let i = 0; i < lis.length; i++) {
                const x = (Math.random() + 1) * 500
                const op = parseInt(x, 10) % 2 === 0 ? -1 : 1
                const y = (Math.random() + 1) * 300
                lis[i].style.opacity = '0'
                lis[i].style.transform = `translateX(${x}px) translateZ(${x}px) translateY(${op * y}px)`
                lis[i].style.display = 'none'
            }
        }
    }
    randromCurrent(start = 0, end = 5) {
        const lis = document.getElementsByClassName('_dynamicItem')
        if (!!lis) {
            for (let _start = start; _start <= end; _start++) {
                if (lis[_start]) {
                    const duration = (Math.random() * 3)
                    lis[_start].style.display = 'block'
                    lis[_start].style.opacity = '1'
                    setTimeout(() => {
                        lis[_start].style['transition-duration'] = duration + 's'
                        lis[_start].style.transform = `translate3d(0,0,0)`
                    }, 0);
                }
            }
        }
    }
    dynamicDetail(data) {
        this.setState({ dynamicDetail: { visible: false } }, () => this.setState({
            dynamicDetail: {
                visible: true,
                ...data
            }
        }))
    }
    toggleOpen() {
        if (this.state.dynamicDetail.msg.length === 0) return
        this.setState(state => {
            return {
                dynamicDetail: { ...state.dynamicDetail, open: !state.dynamicDetail.open }
            }
        })
    }
    componentDidMount() {
        const { dispatch, user } = this.props
        if (!user.isLogin && !!Cookies.get('user')) {
            dispatch({ type: 'loading/loading', payload: true })
            dispatch({
                type: 'user/getUserInfo',
                payload: {
                    cb: () => dispatch({ type: 'loading/loading', payload: false })
                }
            })
        }
    }
    openDialog(_id) {
        const { dispatch, user } = this.props
        if (!user.isLogin) {
            dispatch({
                type: 'toast/open',
                payload: { type: 'fail', msg: '登陆就能评论啦' }
            })
            return
        }
        const cb = data => {
            if (data === '' || data.trim && data.trim() === '') {
                dispatch({
                    type: 'toast/open',
                    payload: {
                        type: 'fail',
                        msg: '输入不规范'
                    }
                })
                return
            }
            const d = new Date()
            const year = d.getFullYear()
            const month = d.getMonth() + 1
            const day = d.getDate()
            const hour = d.getHours()
            const minute = d.getMinutes()
            const currentDay = year + "-" + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + '--' + (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute)
            dispatch({ type: 'loading/loading', payload: true })
            dispatch({
                type: 'dynamic/leaveMsg',
                payload: {
                    msg: {
                        context: data, date: currentDay
                    },
                    _id,
                    name: Base64.encode(user.name),
                    cb: (current) => { 
                        dispatch({ type: 'loading/loading', payload: false })
                        this.setState(({ dynamicDetail }) => ({
                            dynamicDetail: {
                                visible: true, 
                                open: dynamicDetail.open,
                                ...current,
                                msg: current.msg.reverse()
                            }
                        }), () => {
                            dispatch({ type: 'dialog/hide' })
                            dispatch({
                                type: 'toast/open',
                                payload: { type: current ? 'success': 'fail', msg: current ? '操作成功' : '操作失败' }
                            })
                        })
                    }
                }
            })
        }
        dispatch({ type: 'dialog/open', payload: { cb, placeholder: '在这里写下你的评论', maxInput: 60 } })
    }
    upvote({ _id, upvote }){
        const hasUpvote = JSON.parse(localStorage.getItem('hasUpvote')) || []
        if (hasUpvote.includes(_id)) return
        const { dispatch } = this.props
        dispatch({
            type: 'dynamic/upvote',
            payload: { 
                _id,
                upvote: upvote + 1,
                cb: result => result.success && this.setState(({ dynamicDetail }) => ({ dynamicDetail: {
                    ...dynamicDetail,
                    upvote: dynamicDetail.upvote + 1
                } }))
             }
        })
    }
    checkUpvote({ _id }){
        const hasUpvote = JSON.parse(localStorage.getItem('hasUpvote')) || []
        return hasUpvote.includes(_id) ? 'alreadyUpvote' : 'none'
    }
    render() {
        const { dynamic } = this.props
        const { dynamicDetail } = this.state
        return (
            <div className={styles.dynamicContainer}>
                {
                    dynamicDetail.visible && dynamicDetail && dynamicDetail.msg && 
                    <div className={styles.dynamicDetail}>
                        <div className={styles.dynamicDetailImg} style={{ backgroundImage: 'url(' + dynamicDetail.img + ')' }}>
                            {/* <div className={styles.dynamicDetailTitle}><span>{dynamicDetail.title}</span></div> */}
                        </div>
                        <div className={styles.dynamicDetailContent}>
                            {/* <div className={styles.title}>“ {dynamicDetail.title} ”</div> */}
                            {dynamicDetail.content}
                        </div>
                        <div className={styles.dynamicOperation}>
                            <div onClick={() => this.upvote(dynamicDetail)} className={`${styles.like} ${styles[this.checkUpvote(dynamicDetail)]}`}><i className='icon-dianzan iconfont'></i><span>{dynamicDetail.upvote}</span></div>
                            <div onClick={() => this.toggleOpen()} className={styles.open}><span>{dynamicDetail.msg.length}</span><i className={(dynamicDetail.open ? 'icon-quxiao' : 'icon-zhankai') + ' iconfont'}></i></div>
                            <div onClick={() => this.openDialog(dynamicDetail._id)} className={styles.repeat}><i className='iconfont icon-liuyan-A'></i></div>
                        </div>
                        {
                            dynamicDetail.open &&
                            <div className={styles.dynamicMsg}>
                                <ul className={styles.msgList}>
                                    {
                                        dynamicDetail.msg && dynamicDetail.msg.length !== 0 && dynamicDetail.msg.map(item => {
                                            return (
                                                <li key={item._id} className={styles.dynamicMsgItem}>
                                                    <div className={styles.dynamicName}>{item.name || '神秘人'} 在 {item.date} 评论：</div>
                                                    <div className={styles.dynamicMsgContent}>{item.context}</div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        }
                    </div>
                }
                {
                    dynamic && dynamic instanceof Array &&
                    <ul className={styles.container}>
                        {
                            dynamic.map((item, index) => {
                                return (
                                    <li onClick={() => this.dynamicDetail(item)} style={{ display: index > 5 ? 'none' : 'block' }} className={`${styles.dynamicItem} _dynamicItem`} key={item._id} >
                                        <div className={styles.dynamicBg} style={{ backgroundImage: 'url(' + item.img + ')'}}></div>
                                        <div className={styles.dynamicContent}>
                                            <div className={styles.dynamicTitle}>{item.title}</div>
                                            <div className={styles.dynamicSummary}>{item.content}</div>
                                        </div>
                                        <div className={styles.dynamicDate}>{item.date}</div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                }
                <ul className={styles.pageNation}>
                    {dynamic.length && dynamic.length !== 0 && <Pagination total={dynamic.length} pageSize={6} onChange={page => this.handlePage(page)} /> }              
                </ul>
            </div>
        )
    }
}
