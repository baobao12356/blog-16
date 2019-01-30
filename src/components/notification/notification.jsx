import React from 'react'
import styles from './notification.less'
import { connect } from 'dva'

const Toast = props => {
    return(
        <div>
        {
            props.toast.visible && 
            <div className={styles.toastContainer}>
                <div  onClick={() => { props.dispatch({type: 'toast/hide' }) }}className={styles.toastMask}></div>
                <div className={styles.toast}>
                    <i style={{color: props.toast.type === 'success' ? '#52c41a' : '#f5222d'}} className={styles.status +' icon-'+ (props.toast.type === 'success' ? 'queding' : 'wenti') +' iconfont'}></i>
                   <span>{props.toast.msg}</span>
                </div>
            </div>
        }
        </div>
    )
}
export default connect(({ toast }) => ( { toast } ))(Toast)