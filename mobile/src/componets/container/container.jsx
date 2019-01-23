import React from 'react'
import './container.css'
import { Footer } from './../footer/footer'
import { Header } from './../header/header'
import { RouteConfig } from './../route/route'
import { Toast } from 'antd-mobile'
import { connect } from 'react-redux'
import Aside from './../aside/Aside'
import { LoginReg } from '../aside/loginrReg'
import { Base64 } from 'js-base64'
import { API } from '../../request/request'
import { Icon } from 'antd'

class UI extends React.PureComponent {
    componentDidMount() {
        if (sessionStorage && !!sessionStorage.getItem('user')) {
            API('/getUserInfor', 'POST', { name: Base64.decode(sessionStorage.getItem('user')) }).then(result => {
                result.success ? this.props.userInfo({ ...result.user, status: true, text: '注销' }) : Toast.offline(result.errorMsg || result, 1)
            })
        }
        window.addEventListener('popstate', ev => {
            // console.log(ev)
            const imgDetail = document.getElementsByClassName('imgDetail')[0]
            const galleryContainer = document.getElementsByClassName('galleryContainer')[0];
            /galleryContainerOpen/.test(galleryContainer.className) && (galleryContainer.className = 'galleryContainer')
            imgDetail && (imgDetail.style.display === 'block') && (imgDetail.style.display = 'none')
        }, false)
        const con = document.getElementsByClassName('container')[0]
        con.style.height = window.innerHeight + 'px'
        window.addEventListener('resize', () => con.style.height = window.innerHeight + 'px')
        const imgDetail = document.getElementsByClassName('imgDetail')[0]
        imgDetail.addEventListener('click', ev => {
            ev.target.tagName.toUpperCase() !== 'IMG' && (imgDetail.style.display = 'none')
        })
    }
    exitFullscreen() {
        const de = document;
        if (de.exitFullscreen) {
            de.exitFullscreen();
        } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen();
        } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen();
        }
    }
    requestFullScreen(element) {
        // 判断各种浏览器，找到正确的方法
        const requestMethod = element.requestFullScreen || //W3C
            element.webkitRequestFullScreen ||    //Chrome等
            element.mozRequestFullScreen || //FireFox
            element.msRequestFullScreen; //IE11
        if (requestMethod) {
            requestMethod.call(element);
        }
        else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
            const wscript = new window.ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }     
    }
    handleFullScreen() {
        // this.props.fullScreen ? this.exitFullscreen() : this.requestFullScreen(document.documentElement)
        this.props.toggleScreen()
    }
    render() {
        return (
            <div className='container' style={{ paddingTop: this.props.fullScreen ? '10px' : '60px' }}>
                <div className="imgDetail" style={{ display: 'none' }}>
                    <div className="imgMask"></div>
                    <img src='' alt="" width='100%' height='auto' />
                </div>
                <div className="galleryContainer">  {/* 图库画布 */}
                    <Icon type='export' className='exitGallery' onClick={() => {
                        document.getElementsByClassName('galleryContainer')[0].className = 'galleryContainer'
                    }} />
                    <canvas id="canvas">你的浏览器不支持HTML5画布技术，请使用谷歌浏览器。</canvas>
                </div>
                <div className="fullScreen" onClick={() => this.handleFullScreen()}>
                    <Icon type={this.props.fullScreen ? "fullscreen-exit" : "fullscreen"} />
                </div>
                <LoginReg />      {/* 登陆注册 */}
                <Aside />         {/* 侧边栏 */}
                <Header />        {/* 头部 */}
                <RouteConfig />   {/* 路由配置 */}
                <Footer />        {/* 底部 */}
            </div>
        )
    }
}
export
    const Container = connect(state => {
        return {
            user: state.user,
            datas: state.datas,
            visible: state.dialog.visible,
            fullScreen: state.screen,
            img: state.img
        }
    }, dispatch => {
        return {
            setData(params) {
                dispatch({ type: 'SET_DATA', ...params })
            },
            userInfo(user) {
                dispatch({ type: 'SET_USER_VO', payload: { ...user } })
            },
            toggleScreen() {
                dispatch({ type: 'TOGGLE_SCREEN' })
            }
        }
    })(UI)