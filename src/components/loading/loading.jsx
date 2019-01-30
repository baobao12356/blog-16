import React from 'react'
import { connect } from 'dva'
import styles from './loading.less'
const Loading = ({ loading }) => {
    return (
        <div>
            {
                loading.visible &&
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingMask}></div>
                    <div className={styles.loadingWrap}>
                        <div className={`${styles.loadingDot + ' '+ styles.startLoading}`}>
                        </div>
                        <div className={styles.loadingText}>LOADING</div>
                    </div>
                </div>
            }

        </div>
    )
}

export default connect(({ loading }) => ({ loading }))(Loading)