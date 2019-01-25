import React from 'react'
import s from './extra.less'

const Extra = props => {
    const imgs = [
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/1.jpg'] },
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/2.jpg']},
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/3.jpg'] },  
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/4.jpg', 'https://adaxh.applinzi.com/resouce/gallery/7.jpg','https://adaxh.applinzi.com/resouce/gallery/12.jpg'] },     
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/5.jpg', 'https://adaxh.applinzi.com/resouce/gallery/7.jpg'] },        
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/6.jpg'] },
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/8.jpg', 'https://adaxh.applinzi.com/resouce/gallery/7.jpg', 'https://adaxh.applinzi.com/resouce/gallery/7.jpg'] },     
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/9.jpg', 'https://adaxh.applinzi.com/resouce/gallery/11.jpg', 'https://adaxh.applinzi.com/resouce/gallery/7.jpg', 'https://adaxh.applinzi.com/resouce/gallery/7.jpg'] },     
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/10.jpg'] }        ,
        { imgs: ['https://adaxh.applinzi.com/resouce/gallery/5.jpg', 'https://adaxh.applinzi.com/resouce/gallery/7.jpg'] },                                               
    ]
    const handleShow = ({ nativeEvent: { target: { parentNode } } }, src) => {
        const top = parentNode.offsetTop
        const left = parentNode.offsetLeft
        const el = document.getElementsByClassName(s.imgCon)[0]
        el.parentNode.style.display = 'block'
        // el.style.display = 'block'
        el.children[0].src = src
        const PARENT_WIDTH = el.parentNode.offsetWidth
        const PARENT_HEIGHT = el.parentNode.offsetHeight       
        const CONTAINER_WIDTH = 600
        const CONTAINER_HEIGHT = 400        
        el.style.cssText = `transform: translate(${left - parentNode.offsetWidth / 2}px, ${top}px) scale(0);opacity: 0; transition: all 0s;`                                
        setTimeout(() => {
            el.style.cssText = `transform: translate(${PARENT_WIDTH / 2 - CONTAINER_WIDTH / 2}px, ${PARENT_HEIGHT / 2 - CONTAINER_HEIGHT / 2 - 120}px) scale(1); opacity:1; transition: all 0.6s;`
        }, 10);
    } 
    return(
        <div className={s.extraContainer}>
            <div className={s.bigImg}>
                <div id='imgCon' className={s.imgCon}>
                    <img src="" alt="" onClick={e => e.nativeEvent.target.parentNode.parentNode.style.display = 'none'}/>
                </div>
            </div>
            <div className={s.galleryContainer}>
            {
                imgs.map((item, i) => {
                    return(
                        <div key={i} className={s.imgContainer}>
                            {item.imgs.map((_item, i) => {
                                return(
                                    <img onClick={(e) => handleShow(e, _item)} key={i} src={_item} alt=''/>
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