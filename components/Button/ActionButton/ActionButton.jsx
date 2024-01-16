import React from 'react';
import { useTranslation } from 'next-i18next';

//INTERNAL IMPORTS
import Style from "./../Button.module.css";

const ActionButton = ({ action, text, fontSize }) => {
    const { t } = useTranslation();

    const buttonStyle = {
        fontSize: fontSize,
    };

    return (
        <div className={Style.ActionButton} style={buttonStyle} >
            <div onClick={async () => action()} className={Style.ActionButton_text}>
                {t(`${text}`)}
            </div>
        </div>
    )
}

export default ActionButton;