import React from 'react'
import s from './extra.less'

const Extra = props => {
    return (
        <div className={s.extraContainer}>
            <div className={s.showStage}>
                <div className={s.showContainer}>
                    <div className={s.circleOne}></div>
                    <div className={s.circleTwo}></div>
                    <div className={s.circleThree}></div>
                </div>
            </div>
            <div className={s.play}>
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
            </div>
            <div className={s.circleTarget}></div>
        </div>
    )
}

export default Extra