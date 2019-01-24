import React from 'react'
import styles from './dialog.less'
import { connect } from 'dva'

const Dialog = props => {
    return(
        <div>
            {
                props.dialog.visible && 
                <div className={styles.dialogContainer}>
                    <div className={styles.dialogMask}></div>
                    <div className={styles.dialogContent}>
                        <textarea onChange={e => handleKeyDown(e, props)} placeholder={props.dialog.placeholder || ''} className='dialogText' autoFocus></textarea>
                        <div className={styles.dialogOperation}>
                            <div onClick={() => props.dispatch({type: 'dialog/hide'})}  className={styles.dialogCancel}>
                                <i className="icon-quxiao iconfont"></i>
                            </div>
                            <div onClick={() => onSubmit(props)} className={styles.dialogSubmit}>
                                <i className="icon-queding iconfont"></i>
                            </div>
                        </div>
                        <div className={styles.info}>{props.dialog.currentLength} / {props.dialog.maxInput}</div>
                    </div>
                </div>
            }
        </div>
    )
}

function handleKeyDown(e, { dispatch, dialog }){
    const { length } = e.target.value
    dispatch({
        type: 'dialog/renderInput',
        payload: { currentLength: length > dialog.maxInput ? dialog.maxInput : length }
    })
    if (length > dialog.maxInput) {
        e.target.value = e.target.value.slice(0, dialog.maxInput + 1)
        return 
    }
}

function onSubmit(props){
    const data = document.querySelector('.dialogText').value
    props.dialog.cb && props.dialog.cb(data)
}

export default connect(({ dialog }) => ({ dialog }))(Dialog)