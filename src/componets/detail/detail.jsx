import React from 'react'
import { Toast } from 'antd-mobile'
import ReactHtmlParser from 'react-html-parser'
import { Icon } from 'antd'
import './detail.css'
import { API } from '../../request/request'
import { connect } from 'react-redux'
// import { Scroll } from './../../handleOnScroll/scroll'
class UI extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            data: {},
            scrollHeight: 0,
        }
    }
    componentDidMount() {
        Toast.loading('加载中...', 30)
        const _id = this.props.match.params.id
        this.setState({
            scrollHeight: window.innerHeight - 110
        })
        API('/queryArticleById', 'POST', { _id }).then(result => result.success ? this.setState({ data: result.data }, Toast.hide()) : Toast.offline('无法读取文章内容', 2, () => this.props.history.push('/article')))
        this.props.changeTop('HIDE')
    }
    componentWillReceiveProps() {
        const isFullScreen = this.props.screen
        this.setState({
            scrollHeight: isFullScreen ? window.innerHeight - 110 : window.innerHeight 
        })
    }
    render() {
        const { scrollHeight } = this.state
        return (
            <div className="detailContainer contentSlideFromLeft" ref={body => this.body = body} style={{ maxHeight: scrollHeight + 'px' }}>
                <div className="articleStatus1 itemFromLeft">
                    <div className="articleStatus1">
                        <div>
                            <Icon style={{ position: 'relative', top: '1px' }} type="clock-circle" /><span style={{ marginLeft: '4px' }}>{this.state.data.year}-{this.state.data.date}</span>
                        </div>
                        <div>
                            <Icon style={{ position: 'relative', top: '2px' }} type='tag' /><span style={{ marginLeft: '4px' }}>{this.state.data.type}</span>
                        </div>
                        <div>
                            <Icon style={{ position: 'relative', top: '1px' }} type='like' /><span style={{ marginLeft: '4px' }}>{this.state.data.viewer}</span>
                        </div>
                    </div>
                </div>
                {ReactHtmlParser(this.state.data.summary && this.state.data.summary.replace(/contenteditable="true"/g, ''))}
            </div>
        )
    }
}

export const ArticleDetail = connect(state => {
    return {
        toTopVisible: state.toTop.visible,
        footerStatus: state.footer,
        screen: state.screen,
    }
}, dispatch => {
    return {
        toggleFooter() {
            dispatch({ type: 'TOGGLE' })
        },
        changeTop(type) {
            dispatch({ type })
        },
    }
})(UI)