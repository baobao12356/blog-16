import React from 'react'
import './header.css'
// import { NoticeBar } from 'antd-mobile'
import { Icon } from 'antd'
import { connect } from 'react-redux'
const UI = props => {
    return (
        <header className={props.screen ? 'hideHeader' : ''}>
            <div className="logo">
                <span className='logoSpan'> <Icon style={{ position: 'relative', top: '-1px' }} type={props.logo.src} /> Ada - {props.logo.item}</span>
            </div>
            <div className="welcome">
                <p>HOME - PAGE</p> 
            </div>
        </header>
    )
}

export const Header = connect(state => {
    return {
        logo: state.logo,
        user: state.user,
        screen: state.screen
    }
}, () => { return {} })(UI)