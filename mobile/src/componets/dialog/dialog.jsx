import React from 'react'
import { TextareaItem, InputItem, Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import { connect } from 'react-redux'
import { Button } from 'antd-mobile'
import './dialog.css'
import { API } from '../../request/request';

class UI extends React.PureComponent {
    state = { 
        data: {},
        img: '',
        newDynamic: {
            title: '',
            content: '',
            img: ''
        },
        dataUrl: ''
     }
    componentDidMount() {
        const { dialog: { dynamic, dialogType } } = this.props
        const data = {
            title: (dynamic && dynamic.title) || '',
            content: (dynamic && dynamic.content) || '',
            img: (dynamic && dynamic.img) || '',
            _id: dynamic && dynamic._id
        }
        dialogType === 'newDynamic' && delete data._id
        this.setState({
            data: {
                ...data
            }
        })
    }
    setData(key, value) {
        const { data, newDynamic } = this.state
        const { dialog: { dialogType } } = this.props
        dialogType === 'newDynamic' && (this.setState({
            newDynamic: {
                ...newDynamic,
                [key]: value
            }
        })) 
        dialogType === 'editDynamic' && this.setState({
            data: { 
                ...data,
                [key]: value
            }
        })
        window.debug() && console.log('value\n', value)
        dialogType === 'leaveMessage' && this.setState({
            data: { [key]: value }
        })
    }
    submit(dynamic) {
        const { props } = this
        const { data, newDynamic } = this.state
        newDynamic.hide = props.hide
        data.hide = props.hide
        window.debug() && console.log('data\n', data)
        props.dialog.cb && props.dialog.cb(props.dialog.dialogType === 'newDynamic' ? (props.dialog.dialogType === 'leaveMessage' ? data : newDynamic) : data)
        sessionStorage && sessionStorage.removeItem(/ynamic/.test(props.dialog.dialogType) && 'dynamics')
    }
    resetView() {
        document.getElementsByClassName('container')[0].scrollIntoView(false)
    }
    handleUpload(info) {
        const file = info.nativeEvent.target.files[0]
        handleFile.call(this, file)
    }
    render() {
        const { props } = this
        return (
            <div className="editBg">
                <div className="editDialog dialogAnimation">
                    {(props.dialog.dialogType === 'newDynamic' || props.dialog.dialogType === 'editDynamic') &&
                        <InputItem onBlur={() => this.resetView()} placeholder='在这里输入标题' onKeyUp={(e) => this.setData('title', e.nativeEvent.target.value)} defaultValue={props.dialog.dynamic.title}
                        ><span className='inputTitle'>标题：</span></InputItem>
                    }
                    <TextareaItem
                        placeholder={props.dialog.placeholder || ''}
                        onBlur={() => this.resetView()}
                        onKeyUp={(e) => this.setData('content', e.nativeEvent.target.value)}
                        {...props.form.getFieldProps('count', {
                            initialValue: (props.dialog.dynamic && props.dialog.dynamic.content) || '',
                        })}
                        rows={5}
                        count={props.dialog.count || 100}
                    />
                    <div className="dialogFooter">
                        <Button onClick={() => {
                            props.hide({ visible: false })
                            props.dialog.cancelCallback && props.dialog.cancelCallback()
                            this.setState({
                                newDynamic: { }
                            })
                        }} type='default'>取消</Button>
                        <Button type='default' onClick={() => this.submit(props.dynamic)} >确定</Button>
                    </div>
                    {
                        (props.dialog.dialogType === 'newDynamic' || props.dialog.dialogType === 'editDynamic') &&
                        <div className="uploadContainer">
                            点击配图
                            <img src={ '/' + (props.dialog.dialogType === 'editDynamic' ? this.state.data.img : this.state.newDynamic.img) } alt="" />
                            <input type="file"  onChange={(info) => this.handleUpload(info)}/>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

function handleFile(file) {
    const { name } = file
    if (!/png+|jpeg+|gif+|GIF+|PNG+|JPEG/.test(file.type)) {
        Toast.fail('不支持的图片类型', 1)
        return
    }
    Toast.loading('上传中')
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = e => {
        API('/setDynamicImg', 'POST', { dataUrl: e.target.result, name }).then(res => {
            if (res.success) {
                const { newDynamic, data } = this.state
                this.setState({
                    newDynamic: {
                        ...newDynamic,
                        img: res.img
                    },
                    data: {
                        ...data,
                        img: res.img
                    }
                }, Toast.success('已上传配图', 1))
            } else Toast.fail(res)
        })
    }
}

export const Dialog = connect(state => {
    return {
        dialog: state.dialog
    }
}, dispatch => {
    return {
        hide(payload) {
            dispatch({ type: 'QUERY_DYNAMIC', payload })
        },
        _setData(params) {
            dispatch({ type: 'SET_DATA', ...params })
        }
    }
})(createForm()(UI))