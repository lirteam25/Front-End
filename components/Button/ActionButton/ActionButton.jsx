import React from 'react';

//INTERNAL IMPORTS
import Style from "./../Button.module.css";

const ActionButton = ({ action, text, fontSize }) => {

    const buttonStyle = {
        fontSize: fontSize,
    };

    return (
        <div className={Style.ActionButton} style={buttonStyle} >
            <button onClick={async () => action()} className={Style.ActionButton_text}>
                {text}
            </button>
        </div>
    )
}

export default ActionButton;