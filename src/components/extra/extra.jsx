import React from 'react'
import s from './extra.less'

const Extra = props => {
    const imgs = [
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/1.jpg'] },
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/2.jpg'] },
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/3.jpg'] },
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/4.jpg', 'https://adaxh.applinzi.com/resouce/gallery/7.jpg', 'https://adaxh.applinzi.com/resouce/gallery/12.jpg'] },
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/5.jpg', 'https://adaxh.applinzi.com/resouce/gallery/7.jpg'] },
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/6.jpg'] },
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/8.jpg', 'https://adaxh.applinzi.com/resouce/gallery/7.jpg', 'https://adaxh.applinzi.com/resouce/gallery/7.jpg'] },
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/9.jpg', 'https://adaxh.applinzi.com/resouce/gallery/11.jpg', 'https://adaxh.applinzi.com/resouce/gallery/7.jpg', 'https://adaxh.applinzi.com/resouce/gallery/7.jpg'] },
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/10.jpg'] },
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/5.jpg', 'https://adaxh.applinzi.com/resouce/gallery/7.jpg'] },
    ]
    const handleShow = e => {
        const { target } = e.nativeEvent
        if (target.tagName.toUpperCase() === 'IMG') {
            const CONTAINER_WIDTH = 900
            const CONTAINER_HEIGHT = 600
            const CONTENT_TOP = 120
            const left = e.clientX - CONTAINER_WIDTH / 2
            const clienX = e.clientX
            const top = e.clientY - CONTAINER_HEIGHT / 2 - CONTENT_TOP
            const el = document.getElementsByClassName(s.imgCon)[0]
            const bigImg = el.children[0]
            let timmer1 = null
            let timmer2 = null
            bigImg.addEventListener('click', e => { //开始缩小 
                const handleAsync = () => {
                    return new Promise(resolve => {
                        el.style.cssText = `transform: translate(${left}px, ${top}px) scale(0.3); opacity: 0.5;`
                        clearTimeout(timmer1)
                        timmer1 = setTimeout(() => {
                            resolve()
                        }, 400);
                    })
                }
                handleAsync().then(() => {
                    bigImg.parentNode.parentNode.style.display = 'none'
                    target.style.cssText = 'opacity: 0.5;transition: all 1s;'
                })
            }, false)
            const handleAsyncImg = () => {
                return new Promise(resolve => {
                    bigImg.src = target.src
                    el.parentNode.style.display = 'block'
                    el.style.cssText = `transition: all 0s; transform: translate(${left}px, ${top}px) scale(0.3)`
                    target.style.cssText = 'opacity: 0;transition: all 0s;'
                    clearTimeout(timmer2)
                    timmer2 = setTimeout(() => {
                        resolve()
                    }, 10);
                })
            }
            handleAsyncImg().then(() => {
                el.style.cssText = `transform: translate(${clienX / 2}px, ${CONTAINER_HEIGHT / 2 + CONTENT_TOP - 380}px) scale(1); opacity:1; transition: all 0.5s;`
            })
        }
    }
    return (
        <div className={s.extraContainer}>
            <div className={s.bigImg}>
                <div id='imgCon' className={s.imgCon}>
                    <img src="" alt="" />
                </div>
            </div>
            <div className={s.galleryContainer} onClick={(e) => handleShow(e)}>
                {
                    imgs.map((item, i) => {
                        return (
                            <div key={i} className={s.imgContainer}>
                                {item.imgs.map((_item, i) => {
                                    return (
                                        <img key={i} src={_item} alt='' />
                                    )
                                })}
                            </div>
                        )
                    })
                }
            </div>
            {/* <div className={s.showStage}>
                    <div className={s.showContainer}>
                    <div className={s.circleOne}></div>
                    <div className={s.circleTwo}></div>
                    <div className={s.circleThree}></div>
                </div>
            </div> */}
            {/* <div className={s.play}>
                <div className={s.time}>
                    <div className={s.start}>01:53</div>
                    <div className={s.line}>
                        <div className={s.dot}></div>
                    </div>
                    <div className={s.end}>04:29</div>
                </div>
                <div className={s.info}>
                    晴天 - 周杰伦
                </div>
                <div className={s.text}>从前从前，有个人爱你很久</div>
                <div className={s.controll}>
                    <div className={s.pre}><i className="iconfont icon-shangyiqu"></i></div>
                    <div className={s.playA}><i className="iconfont icon-bofang1"></i></div>
                    <div className={s.Next}><i className="iconfont icon-xiayiqu"></i></div>
                </div>
            </div> */}
            {/* <div className={s.circleTarget}></div> */}
        </div>
    )
}

export default Extra