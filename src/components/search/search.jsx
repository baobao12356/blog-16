import React from 'react'
import s from './search.less'
import { connect } from 'dva'

const Search = props => {
    return(
        <div className={s.searchContainer}>
            <div className={s.content}>
                component doing...
            </div>
        </div>
    )
}

export default connect(({ loading, toast, search }) => ({ loading, toast, search }))(Search)