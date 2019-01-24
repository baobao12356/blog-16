import React from 'react'
import { NavLink } from 'react-router-dom'
import { Icon } from 'antd'
import './footer.css'
import { connect } from 'react-redux'
import { animateToTop } from './../../handleOnScroll/scroll'
const UI = props => {
    const nav = [
        {
            type: 'fund',
            text: '动态',
            url: '/dynamic'
        },
        {
            type: 'file-text',
            text: '文章',
            url: '/article'
        },
        {
            type: 'home',
            text: '首页',
            url: '/index'
        },
        {
            type: 'message',
            text: '留言',
            url: '/message'
        },
        {
            type: 'tag',
            text: '关于',
            url: '/about'
        }
    ]
    return (
        <footer className={props.screen ? 'hideFooter' : ''}>
            <ul>
                {
                    nav.map(item => {
                        return (
                            <li key={item.url} onClick={() => props.set(item.type, item.text)}>
                                <NavLink style={{ display: 'block', color: "white"}} to={item.url}>
                                    <Icon type={item.type} />
                                </NavLink>
                            </li>
                        )
                    })
                }
            </ul>
            {
                props.toTopVisible &&
                <div className='toTop' onClick={() => toTop(props)}>
                    <Icon type="to-top" />
                </div>
            }
        </footer>
    )
}
const toTop = props => {
    const urlMapEl = [
        { url: '/dynamic', el: 'dynamicContainer' },
        { url: '/article', el: 'articleList' },
        { url: '/message', el: 'messageContainer' },
    ]
    const urlArr = window.location.href.split('/')
    const target = '/' + urlArr[urlArr.length - 1]

    for (let item of urlMapEl) {
        if (item.url === target) {
            animateToTop(document.getElementsByClassName(item.el)[0], () => setTimeout(() => {
                props.changeToTop('HIDE')                
            }, 1000))
            return
        }
    }
}

export const Footer = connect(state => {
    return {
        type: state.logo.src,
        toTopVisible: state.toTop.visible,
        screen: state.screen
    }
}, dispatch => {
    return {
        set(src, item) {
            dispatch({ type: 'LOGO', payload: { src, item } })
        },
        changeToTop(type) {
            dispatch({ type })
        },
        toggleFooter(type) {
            dispatch({ type })
        }
    }
})(UI)