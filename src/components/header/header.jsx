import React from 'react'
import styles from './header.less'
import { NavLink, withRouter } from 'dva/router'
import { connect } from 'dva'

const Header = props => {
    const navs = [
        { text: 'Home', url: '/home' },
        { text: 'Moments', url: '/dynamic' },
        { text: 'Article', url: '/article' },
        { text: 'Message', url: '/message' },
        { text: 'Extra', url: '/about' },
    ]
    const handleSearch = e => {
        const { nativeEvent: { target } } = e
        if (e.keyCode === 13 && !!target.value && target.value.trim() !== '') {
            const { dispatch, history: { push } } = props
            dispatch({ type: 'loading/loading', payload: true })
            dispatch({
                type: 'search/search',
                payload: {
                    data: target.value,
                    cb: result => {
                        dispatch({ type: 'loading/loading', payload: false })
                        !result.success && dispatch({ type: 'toast/open', payload: { type: 'fail', msg: result } })
                        result.success && result.result && result.result.length === 0 && dispatch({ type: 'toast/open', payload: { type: 'fail', msg: `没有找到关于“${target.value}”的内容` } })   
                        result.success && result.result && result.result.length !== 0 && dispatch({ type: 'toast/hide' }) && push('/search')          
                    }
                }
            })
        }
    }
    const handleLine = ({ nativeEvent: { target } }) => {
        const MARGIN_LEFT = 10
        const width = target.offsetWidth
        const left = target.offsetLeft + MARGIN_LEFT
        const line = document.getElementsByClassName(styles.navLine)[0]
        line.style.cssText = `transform: translateX(${left}px); width: ${width}px`
    }
    return(
        <header>
            <h1 className={styles.logo}>Ada - Blog</h1>
            <div className={styles.search}>
                <div className={styles.searchIcon} onClick={() => {
                    document.getElementsByClassName('_searchInput')[0].value = ''
                    document.getElementsByClassName('_searchInput')[0].focus()
                }}>
                    <i className='icon-search iconfont'></i>
                </div>
                <input type='text' className='_searchInput' placeholder='SEARCH' onKeyDown={e => handleSearch(e)} />
            </div>
            <ul>
                {
                    navs.map(item => {
                        return (
                            <li onClick={e => handleLine(e)} key={item.url}>
                                <NavLink to={item.url}>{item.text}</NavLink>
                            </li>
                        )
                    })
                }
                <div className={styles.navLine}></div>
            </ul>
        </header>
    )
}

export default connect(({ loading, search, toast }) => ({ loading, search, toast }))(withRouter(Header))