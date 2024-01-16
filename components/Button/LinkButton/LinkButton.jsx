import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

//INTERNAL IMPORTS
import Style from "./../Button.module.css";

const LinkButton = ({ path, queries, text, background, fontSize, textColor }) => {
    const { t } = useTranslation();

    const buttonStyle = {
        fontSize: fontSize,
    };

    return (
        <div className={Style.Button} style={buttonStyle}>
            <Link href={queries ? { pathname: path, query: queries } : path} className={Style.Button_text} style={{ backgroundColor: `${background}`, color: `${textColor}` }} >
                {t(`${text}`)}
            </Link>
        </div>
    )
}

export default LinkButton;