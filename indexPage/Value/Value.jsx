import React from 'react';

import Style from "./Value.module.css";
import { ExternalLinkButton } from "../../components/componentsIndex";

const boxes = [
    {
        "title": "No Subscription Fees",
        "description": "Receive 90% of each sale, instantly. The remaining 10% is allocated to run the platform. We value collecting, not subscriptions."
    },
    {
        "title": "Enhanced DJ and Fan Engagement",
        "description": "Digital music has a value. Release your limited edition tracks directly to your fans. Give them the possibility to digitally collect and trade them though blockchain technology."
    },
    {
        "title": "Lower cost for Higher Profits",
        "description": "Eliminate high production and distribution costs associated with vinyl records, resulting in increased profits."
    },
    {
        "title": "Resale Royalties",
        "description": "Earn a 5% share on each digital vinyl resale. This is not possible in ordinary vinyl release.."
    }
]

const Value = () => {
    return (
        <div className={Style.Value}>
            <h2 className={`${Style.Value_title} font-large bold`}>LIR FOR PRODUCERS</h2>
            <div className={Style.Value_boxes}>
                {boxes.map((el, i) => (
                    <div key={el.title} className={Style.Value_boxes_box}>
                        <h3 className='font-medium bold'>{el.title}</h3>
                        <p className='font-small'>{el.description}</p>
                    </div>
                ))}
            </div>
            <div className={Style.Value_button}>
                <ExternalLinkButton text="learn more" path="https://lirmusic.notion.site/Lir-Music-info-694b4a6252224f9fba741bc2397f6212?pvs=4" background="white" textColor="black" />
            </div>
        </div>
    )
}

export default Value;