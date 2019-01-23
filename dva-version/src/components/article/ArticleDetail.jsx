import React from 'react'
import { connect } from 'dva'
import ReactHtmlParser from 'react-html-parser'
import styles from './article.less'
const Detail = props => {
    console.log(props)
    function handleClose({ nativeEvent: { target } }, _id) {
        /detailContainer+|hiddenScroll/.test(target.className) && props.history.push('/article')
    }
    const { detail } = props
    return (
        <div className={styles.detailContainer} onClick={e => handleClose(e, detail._id)}>
            {
                detail.visible &&
                <div className={styles.hiddenScroll}>
                    <div className={styles.page}>
                        <div className={styles.info}>
                            <div>类型：{detail.type}</div>
                            <div>时间：{detail.year} - {detail.date} - {detail.time}</div>
                            <div>浏览：{detail.viewer}</div>
                        </div>
                        <div className={styles.content}>
                            {ReactHtmlParser(detail.summary.replace(/contenteditable="true"+|style+|placeholder="Compose an epic..."+|<\/?br>/g, ''))}
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}

export default connect(({ article: { detail } }) => ({ detail }))(Detail)