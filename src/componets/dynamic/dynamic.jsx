import React from 'react'
import { Card, Toast, Modal } from 'antd-mobile'
import { Icon } from 'antd'
import './dynamic.css'
import { connect } from 'react-redux'
import { API } from '../../request/request'
import { Base64 } from 'js-base64'
// import ReactDOM from 'react-dom'
import { Scroll } from './../../handleOnScroll/scroll'

const alert = Modal.alert

class UI extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            height: document.documentElement.clientHeight,
            refreshing: false,
            scrollHeight: 0,
            index: 0,//slice（index, pagesize）
            pageSize: 6,//一次请求多少条？
            isOver: false,//没有数据了？
        }
    }
    shouldComponentUpdate(arg1, arg2) {
        if (!arg2.data || arg2.data.length === 0) return false
        return true
    }
    componentWillReceiveProps(props){
        const isFullScreen = props.screen
        this.setState({
            scrollHeight: isFullScreen ? window.innerHeight : window.innerHeight - 110
        })
    }
    componentDidMount() {
        this.props.changeTop('HIDE')
        this.setState({
            scrollHeight: window.innerHeight - 110
        })
        const { index, pageSize } = this.state
        if (window.sessionStorage && window.sessionStorage.getItem('dynamics')) {
            const data = JSON.parse(window.sessionStorage.getItem('dynamics'))
            this.setState({
                data,
                index: 6,
                pageSize: 12
            })
        } else {
            Toast.loading('加载中...', 30)
            this.sendFetch(index, pageSize, () => Toast.hide())
        }
        const scroll = new Scroll(this.body)
        scroll.onScrollEnd(() => {
            this.handleScroll()
        })
        scroll.onScroll(() => {
            const { toTopVisible, changeTop } = this.props
            const { body } = this
            if (body.scrollTop <= 0) {
                toTopVisible && changeTop('HIDE')
            }
            else {
                changeTop('SHOW')
            }
        })
    }
    concatData(data, temp) {
        const copyData = JSON.parse(JSON.stringify(data))
        const allId = copyData.map(item => item._id)
        for (let item of temp) {
            !(allId.includes(item._id)) && copyData.push(item)
        }
        return [...copyData]
    }
    sendFetch(index, pageSize, cb) {
        if (this.state.isOver) return
        API('/getDynamicByPageSize', 'POST', { index, pageSize }).then(result => {
            if (result.success) {
                index === 0 && window.sessionStorage && window.sessionStorage.setItem('dynamics', JSON.stringify(result.data))
                const data = this.concatData(this.state.data, result.data)
                const _index = this.state.pageSize
                const pageSize = _index + 6
                const isOver = result.isOver
                this.setState(state => {
                    return {
                        data,
                        index: _index,
                        pageSize,
                        isOver
                    }
                }, cb && cb())
            }
        })
    }
    refresh() {
        this.setState({ refreshing: true, index: 0, data: [], pageSize: 6, isOver: false }, () => this.sendFetch(0, 6, () => this.setState({ refreshing: false })))
    }
    toggleRepeat(_id) {
        const { data } = this.state
        for (let item of data) {
            if (item._id === _id) {
                item.open = !item.open
                break
            }
        }
        this.setState({ data: [...data] })
        // this.props.setData({ payload: { type: 'dynamics', data } })
    }
    openDialog(_id) {
        const cb = value => {
            if (!value || value.content.trim() === '') {
                Toast.info('输入不规范', 1)
                return
            }
            Toast.loading('加载中...', 10)
            const d = new Date()
            const year = d.getFullYear()
            const month = d.getMonth() + 1
            const day = d.getDate()
            const hour = d.getHours()
            const minute = d.getMinutes()
            const currentDay = year + "-" + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + '--' + (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute)
            API('/leave-dynamic-mg', 'POST', { msg: { context: value.content, date: currentDay }, _id, name: Base64.encode(this.props.user.name) }).then(res => {
                if (res.success) {
                    Toast.hide()
                    value.hide({ visible: false })
                    this.setState({ data: res.data.reverse().slice(0, 6) }, () => window.sessionStorage && window.sessionStorage.setItem('dynamics', JSON.stringify(this.state.data.slice(0, 6))))
                }
                else Toast.offline(res)
            })
        }
        this.props.openDialog({ cb, placeholder: '你想评论什么呢？' })
    }
    deleteMsg(_id, msgId) {
        Toast.loading('删除中', 2)
        API('/deleteDynamicMsg', 'POST', { _id, msgId }).then(result => {
            Toast.hide()
            if (result.success) {
                const { data } = this.state
                for (let item of data) {
                    if (item._id === msgId) {
                        const msg = item.msg.filter(msg => msg._id !== _id)
                        item.msg = msg
                        break
                    }
                }
                this.setState({ data }, () => window.sessionStorage && window.sessionStorage.setItem('dynamics', JSON.stringify(this.state.data.slice(0, 6))))
                // this.props.setData({ payload: { type: 'dynamics', data } })
                Toast.success('已删除', 1)
            } else Toast.offline(result)
        })
    }
    handleScroll() {
        if (this.state.isOver) return
        const { body } = this
        if (body.scrollTop + body.clientHeight >= body.scrollHeight) {
            this.sendFetch(this.state.index, this.state.pageSize)
        }
    }
    viewImg(src){
        // !!src && this.props.viewImg({ visible: true, src })
        const imgContainer = document.querySelector('.imgDetail')
        imgContainer.style.display = 'block'
        imgContainer && imgContainer.children[1] && (imgContainer.children[1].src = src)
    }
    render() {
        // const imgs = document.getElementsByClassName('dynamicImgContainer')
        // if (imgs.length !== 0){
        //     for (let item of imgs){
        //         item.addEventListener('click', )
        //     }
        // }
        const { scrollHeight } = this.state
        // <div className="">
        return (
            //onScroll={() => this.handleScroll()}
            <div className="indexContainer dynamicContainer contentSlideFromLeft" style={{ height: scrollHeight + 'px' }} ref={body => this.body = body}>
                {
                    this.state.data && this.state.data.length !== 0 && this.state.data.map(item => {
                        const src = item.img || '/resouce/gallery/7.jpg'
                        const len = (item.msg && item.msg.length) || 0
                        return (
                            <div key={item._id}>
                                <Card className='itemFromLeft cardItem' >
                                    <div className="dynamicImgContainer" onClick={() => this.viewImg(src)} style={{backgroundImage: 'url('+ src +')'}}>
                                    </div>
                                    <Card.Header
                                        title={item.title}
                                    />
                                    <Card.Body>
                                        <div className='fromLeft dynamicContent'>
                                            {item.content}
                                            <div className='dynamicDate fromLeft'>
                                                <span className="line"></span>
                                                <span>{item.date}</span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                    <Card.Footer content={<div className='dynamicOperationContainer'>
                                        
                                        <div className="rightTemp">
                                            <div className='upvote'><Icon style={{ position: 'relative', top: '-1px', left: '-5px' }} type="like" />{item.upvote}</div>

                                            <div className="repeat">
                                                <span onClick={() => this.toggleRepeat(item._id)} >
                                                    <Icon style={{ position: 'relative', top: '-1px', left: '-5px' }} type={item.open ? "close" : 'message'} />
                                                    {len}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    } />
                                    {
                                        item.open ?
                                            <div className='repeatContainer' key={item._id}>
                                                <div style={{ 'textAlign': "right", color: '#888', marginTop: '0.12rem', paddingRight: '0.2rem' }}>
                                                    <Icon style={{ position: 'relative', top: '-0.01rem', left: '-0.05rem', color: '#4089bc' }} type="plus" onClick={() => this.props.user.name ? this.openDialog(item._id) : Toast.fail('你还没有登录哦', 1)} />
                                                </div>
                                                <div className="repeatList">
                                                    <ul>
                                                        {
                                                            item.msg && item.msg.reverse().map(msg => {
                                                                return (
                                                                    <li key={msg._id}>
                                                                        <div className="name">
                                                                            {msg.name || '神秘人'} : <span>{msg.date.replace(/--/, ': ')}</span>
                                                                            {(this.props.user.admin || this.props.user.name === msg.name) && <Icon className='repeatInner deleteI' onClick={() => alert('提示', '确定删除吗？', [
                                                                                { text: '取消', onPress: () => console.log('cancel') },
                                                                                { text: '确定', onPress: () => this.deleteMsg(msg._id, item._id) }
                                                                            ])} type='delete' />}
                                                                        </div>
                                                                        <div className="context">{msg.context}</div>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                            :
                                            ''
                                    }

                                </Card>

                            </div>
                        )
                    })
                }
                {
                    !this.state.isOver &&
                    <div className='loadingCon'>
                        <Icon type='loading' />
                    </div>
                }
            </div>

            // </div>
        )
    }
}
const Dynamic = connect(state => {
    return {
        user: state.user,
        dynamics: state.datas.dynamics,
        toTopVisible: state.toTop.visible,
        screen: state.screen,
    }
}, (dispatch) => {
    return {
        viewImg(payload){
            dispatch({ type: 'VIEW', payload })
        },
        setUser(user) {
            dispatch({
                type: 'SET_USER_VO',
                payload: user
            })
        },
        changeTop(type) {
            dispatch({ type })
        },
        setData(params) {
            dispatch({ type: 'SET_DATA', ...params })
        },
        openDialog(payload) {
            dispatch({ type: 'LEAVE_MESSAGE', payload })
        }
    }
})(UI)
export default Dynamic