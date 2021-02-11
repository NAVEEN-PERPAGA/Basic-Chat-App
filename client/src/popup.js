import React from 'react'


export const PopUp = (props) => {
    return (
        <div>
            <div className="popup-box">
                <div className="box">
                    <span className="close-icon" onClick={props.handleClose}>x</span>
                    {props.children}
                </div>
            </div>
        </div>
    )
}