import React from 'react'
import s from './extra.less'

const Extra = props => {
    const imgs = [
        { imgs: ['/resouce/gallery/1.jpg'] },
        { imgs: ['/resouce/gallery/2.jpg'] },
        { imgs: ['/resouce/gallery/3.jpg'] },
        { imgs: ['/resouce/gallery/4.jpg', '/resouce/gallery/7.jpg', '/resouce/gallery/12.jpg'] },
        { imgs: ['/resouce/gallery/5.jpg', '/resouce/gallery/7.jpg'] },
        { imgs: ['/resouce/gallery/6.jpg'] },
        { imgs: ['/resouce/gallery/8.jpg', '/resouce/gallery/7.jpg', '/resouce/gallery/7.jpg'] },
        { imgs: ['/resouce/gallery/9.jpg', '/resouce/gallery/11.jpg', '/resouce/gallery/7.jpg', '/resouce/gallery/7.jpg'] },
        { imgs: ['/resouce/gallery/10.jpg'] },
        { imgs: ['/resouce/gallery/5.jpg', '/resouce/gallery/7.jpg'] },
    ]
    const handleShow = e => {
        const { target } = e.nativeEvent
        if (target.tagName.toUpperCase() === 'IMG') {
            const mask = document.getElementsByClassName(s.bigImg)[0]
            const IMG_WIDTH = target.offsetWidth
            const IMG_HEIGHT = target.offsetHeight
            target.style.cssText = `width:640px; height: 420px;opacity: 1; z-index:1;translateX(0)`
            mask.style.display = 'block'
            mask.addEventListener('click', _ => {
                target.style.cssText = `width:${IMG_WIDTH - 10}px; height: ${IMG_HEIGHT - 10}px;opacity: 0.5; z-index:0;`
                mask.style.display = 'none'                
            }, false)
        }
    }
    return (
        <div className={s.extraContainer}>
            <div className={s.bigImg}>
                <div id='imgCon' className={s.imgCon}>
                    {/* <img src="" alt="" /> */}
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