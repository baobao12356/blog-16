import React from 'react';
// import { Router, Route, Switch } from 'dva/router';
import { NavLink, Route, Switch, Redirect, Router } from 'dva/router'
import { Index } from './components/index/index'
import Dynamic from './components/dynamic/dynamic'
import Toast from './components/notification/notification'
import Dialog from './components/dialog/dialog'
import Article from './components/article/article'
import message from './components/message/message'
import Loading from './components/loading/loading'
import Detail from './components/article/ArticleDetail'
import styles from './routes/container.less'
import Extra from './components/extra/extra'
// import Container from './routes/container.jsx'

function RouterConfig({ history }) {
  const navs = [
    { text: 'Home', url: '/home' },
    { text: 'Moments', url: '/dynamic' },
    { text: 'Article', url: '/article' },
    { text: 'Message', url: '/message' },
    { text: 'Extra', url: '/about' },
  ]
  return (
    <Router history={history}>
      <div className={styles.container}>
        <Toast />
        <Loading />
        <Dialog />
        <div className={styles.bg}></div>
        <div className={styles.bgOverlay}></div>
        <header>
          <h1 className={styles.logo}>Ada - Blog</h1>
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
          <Switch>
            <Route path='/home' component={Index}></Route>
            <Route path='/dynamic' component={Dynamic}></Route>
            <Route path='/article' exact component={Article}></Route>
            <Route path='/article/:id' render={props => <Detail {...props}/>}></Route>
            <Route path='/message' component={message}></Route>
            <Route path='/about' component={Extra}></Route>
            <Redirect to='/home'></Redirect>
          </Switch>
        </section>
      </div>
    </Router>
  );
}

export default RouterConfig;
