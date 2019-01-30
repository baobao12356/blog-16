import React from 'react';
// import { Router, Route, Switch } from 'dva/router';
import { Route, Switch, Redirect, Router } from 'dva/router'
import { Index } from './components/index/index.tsx'
import Dynamic from './components/dynamic/dynamic'
import Toast from './components/notification/notification'
import Dialog from './components/dialog/dialog'
import Article from './components/article/article'
import message from './components/message/message'
import Loading from './components/loading/loading'
import Detail from './components/article/ArticleDetail'
import styles from './container.less'
import Extra from './components/extra/extra'
import Search from './components/search/search'
// import Container from './routes/container.jsx'
import Header from './components/header/header';

// export interface Props {}

const RouterConfig = (props: any) => {
  return (
    <Router history={props.history}>
      <div className={styles.container}>
        <Toast />
        <Loading />
        <Dialog />
        <Header />
        <div className={styles.bg}></div>
        <div className={styles.bgOverlay}></div>
        <section>
          <Switch>
            <Route path='/home' component={Index}></Route>
            <Route path='/dynamic' component={Dynamic}></Route>
            <Route path='/article' exact component={Article}></Route>
            <Route path='/article/:id' render={props => <Detail {...props} />}></Route>
            <Route path='/message' component={message}></Route>
            <Route path='/about' component={Extra}></Route>
            <Route path='/search' component={Search} />
            <Redirect to='/home'></Redirect>
          </Switch>
        </section>
      </div>
    </Router>
  );
}

export default RouterConfig;
