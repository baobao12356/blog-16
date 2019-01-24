import React, { Component } from 'react';
import { Container } from './componets/container/container'
import { connect } from 'react-redux'
import { Dialog } from './componets/dialog/dialog'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import './App.css'
import { API } from './request/request';
import { Loading } from './componets/loading/loading';

function preLoadFile(imgs) {
  // console.log(imgs)
  const src = [
    "/resouce/images/glitch.jpg",
    '/upload/user_avatar/default_avatar.jpg',
    "/resouce/gallery/1.jpg",
    "/resouce/gallery/2.jpg",
    "/resouce/gallery/3.jpg",
    "/resouce/gallery/4.jpg",
    "/resouce/gallery/5.jpg",
    "/resouce/gallery/6.jpg",
    "/resouce/gallery/7.jpg",
    "/resouce/gallery/8.jpg",
    "/resouce/gallery/9.jpg",
    "/resouce/gallery/10.jpg",
    "/resouce/gallery/11.jpg",
    "/resouce/gallery/12.jpg"
  ]
  const imgResult = []
  return new Promise((resolve) => {
    for (let item of [...new Set([...src, ...imgs])]) {
      const img = new Image()
      img.src = item.replace && item.replace(/jpeg/g,'jpg').replace(/GIF/g, 'gif')
      img.onload = function (e) {
        imgResult.push(img)
        imgResult.length === src.length && resolve(true)
      }
      img.onerror = function () {
        imgResult.push(img)
        imgResult.length === src.length && resolve(true)
      }
    }
  })
}

class UI extends Component {
  state = {
    loading: true
  }
  componentDidMount() {
    API('/getDynamic').then(result => {
      if (result.success) {
        const imgs = result.data.map(item => item.img || '/resouce/gallery/7.jpg')
          preLoadFile(imgs).then(res => {
            setTimeout(() => {
              this.setState({ loading: !res })
            }, 1000);  
          })

      }
    })
    const d = new Date()
    d.setDate(d.getDate() + 2)
    !(/user/.test(document.cookie)) && API('/get-customer').then(result => {
      if (result.success) {
        API('/add-customer', 'POST', { number: result.data.number + 1 })
      }
    })
    const con = document.getElementsByClassName('App')[0]
    con.style.height = window.innerHeight + 'px'
    window.addEventListener('resize', () => {
      con.style.height = window.innerHeight + 'px'
    })
  }
  render() {
    return (
      <div className="App">
        {this.props.visible && <Dialog />}
        { this.state.loading && <Loading /> }
        <Router>
          <Route path="/" component={Container} />
        </Router>
      </div>
    );
  }
}
export const App = connect(state => {
  return {
    visible: state.dialog.visible
  }
}, () => {
  return {

  }
})(UI)
