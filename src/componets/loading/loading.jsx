import React from 'react'
import './loading.css'

export const Loading = () => {
    return(
        <div className="loadingContainer">
            <div className="loadingWrap">
                <div className="loadingDot startLoading">
                </div>
                <div className="loadingText">LOADING</div>
            </div>
            <div className="footerInfo">
                React Blog  © 2018 Adaxh
            </div>
        </div>
    )
}