import React from 'react'
import { connect } from 'dva'
// import Pagination from './../pagination/pagination'
import Cookies from 'js-cookie'
import Pagination from './../pagination/pagination'
import styles from './message.less'
import { Base64 } from 'js-base64'

function escapeData(data) {
    return data.replace(/<input\stype="text"\sdata-formula="e=mc\^2"\sdata-link="quilljs\.com"\sdata-video="Embed\sURL"\splaceholder="Embed\sURL">/g, '').replace(/<\/?script>+|傻逼+|爸爸+|你爸+|SB+|sB+|sb+|操+|你妈/g, '**');
}

const Message = props => {
    const { data, fly, pageSizeData } = props.message
    const handlePage = page => {
        props.dispatch({
            type: 'message/renderPageSize',
            payload: { page }
        })
    }
    const renderRepeat = (list, { _id, name }) => {
        if (list.length === 0)
            return (<div className={styles.repeatList}>empty ~ </div>)
        else {
            return (
                <ul className={styles.repeatList}>
                    {
                        list.map(item => {
                            return (
                                <li key={item._id} className={styles.repeatItem}>
                                    <div className={styles.repeatInfo}>{item.name} {item.date} @ {item.toRepeat}</div>
                                    <div className={styles.repeatContent}>
                                        {item.info}
                                        <div onClick={() =>
                                            !props.user.isLogin && !Cookies.get('user') ?
                                                props.dispatch({
                                                    type: 'toast/open',
                                                    payload: { type: 'fail', msg: '请先登录！' }
                                                })
                                                :
                                                props.dispatch({
                                                    type: 'message/toggleOperation',
                                                    payload: {
                                                        _parentId: _id,
                                                        _id: item._id
                                                    }
                                                })
                                        } className={styles.more}>{item.operation ? 'Close' : 'More'}</div>
                                    </div>
                                    {
                                        item.operation &&
                                        <div className={styles.msgOperation}>
                                            <div onClick={() => leaveMsg('repeat', _id, item.name)}><i className="iconfont icon-liuyan-A"></i></div>
                                            <div onClick={() => deleteMsg('inner', item._id, _id)}><i className="iconfont icon-shanchu"></i></div>
                                        </div>
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
            )
        }
    }
    const renderMsgFly = () => {
        if (fly && fly.length !== 0) {
            return (
                <div className={styles.flyMsgContainer}>
                    {
                        fly.map((item, i) => {
                            return (<div key={i} className={styles.msgFlyItem}>{item.content}</div>)
                        })
                    }
                </div>
            )
        }
    }
    const leaveMsg = (type, _id, toRepeat) => {
        const { user, dispatch } = props
        // if (!user.isLogin && !Cookies.get('user')) {
        // dispatch({type: 'toast/open',payload: { type: 'fail', msg: '请先登录！' }})
        // } else {
        const cb = data => {
            if (!data || data.trim() === '') {
                dispatch({
                    type: 'toast/open',
                    payload: { type: 'fail', msg: '输入不规范' }
                })
            } else {
                dispatch({ type: 'loading/loading', payload: true })
                if (type === 'leaveMsg') {
                    const msg = escapeData(data)
                    const name = user.name || Base64.decode(Cookies.get('user'))
                    let date = new Date()
                    let minute = date.getMinutes()
                    const m = minute < 10 ? '0' + minute : minute
                    let hour = date.getHours()
                    const h = hour < 10 ? '0' + hour : hour
                    let year = date.getFullYear()
                    let month = date.getMonth() + 1
                    const ms = month < 10 ? '0' + month : month
                    let day = date.getDate()
                    const _day = day < 10 ? '0' + day : day
                    let d = year + '-' + ms + '-' + _day + '-----' + h + ' : ' + m
                    dispatch({
                        type: 'message/leaveMessage',
                        payload: {
                            date: d,
                            content: msg,
                            name,
                            cb: result => {
                                dispatch({ type: 'loading/loading', payload: false })
                                !result.success && dispatch({ type: 'toast/open', payload: { type: 'fail', msg: result } })
                                result.success && dispatch({ type: 'dialog/hide' })
                            }
                        }
                    })
                }
                else if (type === 'repeat') {
                    dispatch({
                        type: 'message/repeatMsg',
                        payload: {
                            _id,
                            info: escapeData(data),
                            toRepeat,
                            cb: result => {
                                dispatch({ type: 'loading/loading', payload: false })
                                !result.success && dispatch({ type: 'toast/open', payload: { type: 'fail', msg: result } })
                                result.success && dispatch({ type: 'dialog/hide' })
                            }
                        }
                    })
                }
            }
        }
        dispatch({
            type: 'dialog/open',
            payload: {
                placeholder: type === 'repeat' ? '回复' + toRepeat + ': ' : '在这里写下宝贵的留言',
                cb,
                maxInput: 100
            }
        })
        // }
    }
    const deleteMsg = (type, _id, _parent_id) => {
        const { dispatch } = props
        // if (!user.isLogin && !Cookies.get('user')) {
        //     dispatch({
        //         type: 'toast/open',
        //         payload: { type: 'fail', msg: '请先登录！' }
        //     })
        // } else {
        dispatch({ type: 'loading/loading', payload: true })
        if (type === 'out') {
            dispatch({
                type: 'message/deleteMsg',
                payload: {
                    _id,
                    cb: result => {
                        dispatch({ type: 'loading/loading', payload: false })
                        !result.success && dispatch({ type: 'toast/open', payload: { type: 'fail', msg: result } })
                    }
                }
            })
        } else {
            dispatch({
                type: 'message/deleteMsgInner',
                payload: {
                    _id,
                    _parent_id,
                    cb: result => {
                        dispatch({ type: 'loading/loading', payload: false })
                        !result.success && dispatch({ type: 'toast/open', payload: { type: 'fail', msg: result } })
                    }
                }
            })
        }
        // }
    }
    const handleClickWarp = ({ nativeEvent: { target } }) => {
        if (/wrapContainer+|addMsgCon/.test(target.className)) {
            // console.log('close')
            // console.log(pageSizeData)
            props.dispatch({ type: 'message/init' })
        }
    }
    const { user, dispatch } = props
    return (
        <div className={styles.messageContainer}>
            {
                renderMsgFly()
            }
            <div className={styles.wrapContainer} onClick={e => handleClickWarp(e)}>
                <div className={styles.addMsgCon}>
                    <div className={styles.dot}></div>
                    <div className={styles.dotToLine}></div>
                    <div className={styles.dotToLine2}></div>
                    <div onClick={() => !user.isLogin && !Cookies.get('user') ? dispatch({type: 'toast/open',payload: { type: 'fail', msg: '请先登录！' }})  : leaveMsg('leaveMsg')} className={styles.addMsg}>Leave a message?</div>
                </div>
                <div className={styles.messageListWrap}>
                    <ul className={styles.mssageList}>
                        {
                            pageSizeData instanceof Array && pageSizeData.map(item => {
                                return (
                                    <li className={styles.messageItem} key={item._id}>
                                        <div className={styles.msgAvatar}>
                                            <img src={item.avatar} alt="" />
                                        </div>
                                        <div className={styles.mssageName}>
                                            <div className={styles.leaveInfo}>
                                                <div>{item.name}</div>
                                                <div>{item.date.replace(/-----/, ' ')}</div>
                                            </div>
                                        </div>
                                        <div className={styles.msgContent}>
                                            {item.content}
                                            <div className={styles.moreCon}>
                                                <div onClick={() => props.dispatch({ type: 'message/toggleList', payload: item._id })}>
                                                    <i className={`iconfont ${item.open ? "icon-quxiao" : "icon-zhankai"}`}></i>
                                                </div>
                                                <div onClick={(e) =>
                                                    !props.user.isLogin && !Cookies.get('user') ?
                                                        props.dispatch({
                                                            type: 'toast/open',
                                                            payload: { type: 'fail', msg: '请先登录！' }
                                                        })
                                                        :
                                                        props.dispatch({
                                                            type: 'message/toggleOperation',
                                                            payload: {
                                                                _id: item._id,
                                                                name: 'operation1'
                                                            }
                                                        })
                                                }
                                                >{item.operation ? 'Close' : 'More'}</div>
                                            </div>
                                            {
                                                item.operation &&
                                                <div className={styles.msgOperation}>
                                                    <div onClick={() => leaveMsg('repeat', item._id, item.name)}><i className="iconfont icon-liuyan-A"></i></div>
                                                    <div onClick={() => deleteMsg('out', item._id)}><i className="iconfont icon-shanchu"></i></div>
                                                </div>
                                            }
                                        </div>
                                        {
                                            item.open && item.repeat && renderRepeat(item.repeat, item)
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className={styles.pagination}>
                    {data.length && data.length !== 0 && <Pagination total={data.length} pageSize={6} onChange={page => handlePage(page)} />}
                </div>
            </div>
        </div>
    )
}

export default connect(({ message, user, toast, dialog, loading }) => ({ message, user, toast, dialog, loading }))(Message)