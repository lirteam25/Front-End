import React from 'react';

//INTERNAL IMPORTS
import Style from "./../Button.module.css";

const ActionButton = ({ text, fontSize }) => {

    const buttonStyle = {
        fontSize: fontSize,
    };

    return (
        <div className={Style.InfoButton} style={buttonStyle}>
            <div className={Style.InfoButton_text}>
                {text}
            </div>
        </div>
    )
}

export default ActionButton;