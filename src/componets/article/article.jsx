import React from 'react'
import { Toast } from 'antd-mobile'
import { Icon } from 'antd'
import './article.css'
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux'
import { API } from '../../request/request'
// import ReactDOM from 'react-dom'
import { Scroll } from '../../handleOnScroll/scroll';

// const Item = Popover.Item
class UI extends React.Component {
    constructor() {
        super()
        this.state = {
            data: [],
            visible: false,
            height: document.documentElement.clientHeight,
            refreshing: false,
            scrollHeight: 0,
            index: 0,//slice（index, pagesize）
            pageSize: 6,//一次请求多少条？
            isOver: false,//没有数据了？
        }
    }
    componentWillReceiveProps(props) {
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
        if (window.sessionStorage && window.sessionStorage.getItem('articles')) {
            const data = JSON.parse(window.sessionStorage.getItem('articles'))
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
        scroll.onScrollEnd(this.handleScroll.bind(this))
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
    shouldComponentUpdate(arg1, arg2) {
        if (arg2.data.length === 0) return false
        return true
    }
    handleScroll() {
        if (this.state.isOver) return
        const { body } = this
        if (body.scrollTop + body.clientHeight >= body.scrollHeight) {
            this.sendFetch(this.state.index, this.state.pageSize)
        }
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
        API('/getArticlePageSize', 'POST', { index, pageSize }).then(result => {
            if (result.success) {
                index === 0 && window.sessionStorage && window.sessionStorage.setItem('articles', JSON.stringify(result.data))
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
        this.setState({ refreshing: true })
        API('/getArticles').then(result => {
            if (result.success) {
                this.setState({ data: result.data }, () => this.setState({ refreshing: false }))
                this.props.setData({ payload: { type: 'articles', data: result.data } })
            }
            else Toast.offline('刷新失败', 1)
        })
    }
    articleDetail(_id, viewer) {
        API('/updateArticleViewerById', 'POST', { _id, viewer }).then(result => {
            if (result.success) {
                const { data } = this.state
                for (let item of data) {
                    if (item._id === _id) {
                        item.viewer = (viewer + 1)
                        break
                    }
                }
                this.props.setData({ payload: { type: 'articles', data } })
            }
        })
        // }
        this.props.history.push('/article/' + _id)
    }
    onSelect(key, viewer) {
        const _id = key.props.value
        if (key.key === '4') {
            this.articleDetail(_id, viewer)
            this.props.history.push('/article/' + _id)
        }
    }
    render() {
        const { scrollHeight } = this.state
        //< div className = 'articleContainer contentSlideFromLeft' >
        return (
            <ul className="articleList itemFromLeft contentSlideFromLeft" ref={body => this.body = body} style={{ height: scrollHeight + 'px' }} >
                {
                    this.state.data.length !== 0 && this.state.data.map(item => {
                        return (
                            <li key={item._id} className="articleItem" onClick={() => this.articleDetail(item._id, item.viewer)}>
                                <div className="articleStatus">
                                    <div>
                                        <Icon style={{ position: 'relative', right: '2px'   }} type="clock-circle" /><span style={{ fontSize: '12px' }}>{item.date}</span>
                                    </div>

                                    <div>
                                        <Icon style={{ position: 'relative'  }} type='fire' /><span style={{ marginLeft: '4px' }}>{item.viewer}</span>
                                    </div>
                                    <div>
                                        <Icon style={{ position: 'relative'  }} type='tag' /><span style={{ marginLeft: '4px' }}>{item.type}</span>
                                    </div>
                                    {/* <div className="operation"> */}
                                        {/* <Popover mask
                                            overlayClassName="fortest"
                                            overlayStyle={{ color: 'currentColor' }}
                                            visible={this.state.visible}
                                            overlay={[
                                                (<Item key="4" value={item._id} data-seed="logId">查看详情</Item>),
                                                (<Item key="5" value={item._id} style={{ whiteSpace: 'nowrap' }}>点个赞</Item>),
                                                (<Item key="6" value={item._id} ><span style={{ marginRight: 5 }}>分享</span></Item>)
                                            ]}
                                            align={{
                                                overflow: { adjustY: 0, adjustX: 0 },
                                                offset: [-10, 0],
                                            }}
                                            onSelect={(key) => this.onSelect(key, item.viewer)}
                                        >
                                            <div>more</div>
                                        </Popover> */}
                                    {/* </div> */}
                                </div>

                                <div className="articleTitle">
                                    {ReactHtmlParser(item.summary.slice(0, 200).replace(/contenteditable="true"/g, '') + ' ......')}
                                </div>
                            </li>
                        )
                    })
                }                {
                    !this.state.isOver &&
                    <div className='loadingCon'>
                        <Icon type='loading' />
                    </div>
                }
            </ul>)
    }
}
export const Article = connect(state => {
    return {
        articles: state.datas.articles,
        toTopVisible: state.toTop.visible,
        screen: state.screen
    }
}, dispatch => {
    return {
        setData(params) {
            dispatch({ type: 'SET_DATA', ...params })
        },
        changeTop(type) {
            dispatch({ type })
        },
    }
})(UI)