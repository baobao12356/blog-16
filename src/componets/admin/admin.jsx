import React from 'react'
import { connect } from 'react-redux'
import { Toast, SegmentedControl } from 'antd-mobile'
import './admin.css'
import { Route, Switch, Redirect } from 'react-router-dom'
import { DynamicList } from './dynamicList'
// import { ArticleList } from './articleList'
import { PicManage } from './indexPic'
// import { Edit } from './edit';
// import { New } from './new';
class UI extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {
        this.props.changeTop('HIDE')        
        if (!this.props.user.admin) {
            Toast.offline('你还没有权限或者没登录', 2)
            this.props.history.push('/index')
            return
        }
    }
    onTypeChange(e) {
        const type = e.nativeEvent.selectedSegmentIndex
        this.props.history.push('/admin/' + (type === 0 ? 'dynamic' : 'pic'))
    }
    render() {
        return (
            <div className="adminContainer contentSlideFromLeft">
                <SegmentedControl onChange={(e) => this.onTypeChange(e)} selectedIndex={0} values={['动态', '首页图片']} />
                <div className="routeContainer">
                    <Switch>
                        <Route path='/admin/dynamic' component={DynamicList} />
                        {/* <Route path='/admin/article' component={ArticleList} /> */}
                        <Route path='/admin/pic' component={PicManage} />
                        <Redirect from='/admin' to='/admin/dynamic' />
                    </Switch>
                </div>
            </div>
        )
    }
}
export const Admin = connect(state => {
    return {
        user: state.user,
        visible: state.dialog.visible,
        toTopVisible: state.toTop.visible        
    }
}, dispatch => {
    return {
        changeTop(type) {
            dispatch({ type })
        },
    }
})(UI)