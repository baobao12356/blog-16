import React from 'react'
import '../global.less'
import { NavLink} from 'dva/router'
// import { Index } from './../components/index/index'
// import Dynamic from './../components/dynamic/dynamic'
import Toast from './../components/notification/notification'
import Dialog from './../components/dialog/dialog'
// import Article from './../components/article/article'
// import message from '../components/message/message'
import Loading from '../components/loading/loading'
// import ArticleDetail from '../components/article/articleDetail'
function Container(props) {
    console.log(props)
    const navs = [
        { text: 'Home', url: '/home' },
        { text: 'Moments', url: '/dynamic' },
        { text: 'Article', url: '/article' },
        { text: 'Message', url: '/message' },
        { text: 'Extra', url: '/extra' },
    ]
    return (
        <div className='container'>
            <Toast />
            <Loading />
            <Dialog />
            <div className='bg'></div>
            <div className='bgOverlay'></div>
            <header>
                <h1 className='logo'>Ada - Blog</h1>
                <ul>
                    {
                        navs.map(item => {
                            return (
                                <li key={item.url}>
                                    <NavLink to={item.url}>{item.text}</NavLink>
                                </li>
                            )
                        })
                    }
                </ul>
            </header>
            <section>
                { props.children }
            </section>
        </div>
    );
}

export default Container
