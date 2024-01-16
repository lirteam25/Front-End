import React from 'react';
import { useTranslation } from 'next-i18next';

//INTERNAL IMPORTS
import Style from "./../Button.module.css";

const ActionButton = ({ text, fontSize }) => {
    const { t } = useTranslation();

    const buttonStyle = {
        fontSize: fontSize,
    };

    return (
        <div className={Style.InfoButton} style={buttonStyle}>
            <div className={Style.InfoButton_text}>
                {t(`${text}`)}
            </div>
        </div>
    )
}

export default ActionButton;