import React from 'react'
import { connect } from 'dva'
import styles from './article.less'
import ReactHtmlParser from 'react-html-parser'
// import { routerRedux } from 'dva/router'

const Article = props => {
    const article = props.article.data
    const { hot } = props.article
    const extrct = {}
    const extrctArr = []
    const type = [
        'All',
        'HTML',
        'JavaScript',
        'CSS',
        'React',
        'Vue',
        'NodeJs'
    ]
    if (article && article instanceof Array) {
        for (let item of article) {
            !extrct[item.year] ? extrct[item.year] = 1 :
                (extrct[item.year] = extrct[item.year] + 1)
        }
    }
    for (let key in extrct) {
        !type.includes(key) && type.push(key)
        extrctArr.push({ year: key, value: extrct[key] })
    }
    type.push('Time')
    type.push('')
    const color = [
        '#abd0bc',
        '#62cf8e',
        '#f46c3c',
        '#b2b2b2',
        '#ddc49c',
        '#62b78d',
        '#d1f9f1',
        '#c4c4c4',
        '#b89168',
        '#ff766e',
        '#1e89bd',
        '#d34694',
        '#c5d08d',
        '#4ae488'
    ]
    const random = () => {
        return color[Math.floor(Math.random() * color.length)]
    }
    const handleType = ({ nativeEvent: { target } }, item) => {
        const types = document.querySelectorAll('._articleTyle')
        const SLIDE_MARGIN = 50
        types[types.length - 1].style.transform = `translateX(${target.offsetLeft - SLIDE_MARGIN}px) translateY(${target.offsetTop - SLIDE_MARGIN}px)`
        types[types.length - 1].style.width = `${target.offsetWidth + 20}px`

        if (target.getAttribute('current') === 'true') return
        for (let _item = 0; _item < types.length; _item++) {
            if (_item < types.length - 1) {
                !!item && types[_item].setAttribute('current', 'false')
                !!item && (types[_item].style.cssText = 'color: white; cursor: pointer')
            }
        }
        !!item && item !== 'Time' && target.setAttribute('current', 'true')
        target.style.cssText = 'color: #f54c53;' + (item !== 'Time' && 'cursor: not-allowed')
        !!item && props.dispatch({ type: 'article/filter', payload: item })
    }
    function toDetail(_id) {
        props.dispatch({
            type: 'article/addViewer',
            _id
        })
        props.history.push('/article/' + _id)        
    }
    return (
        <div className={styles.articleContainer}>
            {/* <div className={styles.space}></div> */}
            <div className={styles.articleWrap}>
                {/* <div className={styles.listWrap}> */}
                <ul className={styles.articleList}>
                    {
                        article instanceof Array && article.map(item => {
                            if (item.show || !item.hasOwnProperty('show'))
                                return (
                                    <li onClick={() => toDetail(item._id)} className={styles.articleItem} key={item._id}>
                                        <div className={styles.articleCircle} style={{ backgroundColor: random() }}>{item.type.slice(0, 1)}</div>
                                        <div className={styles.articleDate}><span>{item.year}-{item.date}</span></div>
                                        <div className={styles.articleSummary}>
                                            {ReactHtmlParser(item.summary.replace(/contenteditable="true"+|style+|placeholder="Compose an epic..."+|<\/?br>/g, '').slice(0, 130) + ' ......')}
                                        </div>
                                        {/* <div className={styles.status}>
                                            <div><i className="iconfont icon-4leixing"></i><span>{item.type}</span></div>
                                            <div><i className="iconfont icon-liulan"></i><span>{item.viewer}</span></div>
                                            <div><i className="iconfont icon-shijian"></i><span>{item.year}-{item.date} {item.time}</span></div>
                                        </div> */}
                                    </li>
                                )
                            else return ''
                        })
                    }
                </ul>
                {/* </div> */}
            </div>
            <div className={styles.rightContainer}>
                <div className={styles.articleFilter}>
                    {
                        type.map((item, i) => {
                            return (
                                <div current={i === 0 ? 'true' : 'false'} className='_articleTyle' onClick={(e) => handleType(e, item)} key={item}>{item}</div>
                            )
                        })
                    }
                </div>
                <div className={styles.downContainer}>
                    <div className={styles.hotTitle}>Hot</div>
                    <ul className={styles.hotList}>
                        {
                            hot.map(item => {
                                return (
                                    <li onClick={() => toDetail(item._id)} className={styles.hotItem} key={item._id}>
                                        <div className={styles.hotFire}><i className="iconfont icon-fire"></i></div>
                                        {ReactHtmlParser(item.summary.replace(/contenteditable="true"+|style+|placeholder="Compose an epic..."+|<\/?br>/g, '').slice(0, 130) + ' ......')}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default connect(({ article, loading }) => ({ article, loading }))(Article)