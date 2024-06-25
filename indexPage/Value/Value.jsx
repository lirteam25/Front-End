import React from 'react';

import Style from "./Value.module.css"

const boxes = [
    {
        "title": "No Subscription Fees",
        "description": "You receive 90% of each sale instantly."
    },
    {
        "title": "Enhanced DJ and Fan Engagement",
        "description": "Directly release your exclusive, limited-edition tracks to fans, giving them full control over supply and pricing. Enable digital collecting and resale of unique content."
    },
    {
        "title": "Cost Efficiency for Higher Revenues",
        "description": "Eliminate high production and distribution costs associated with vinyl records, resulting in increased revenues."
    },
    {
        "title": "Resale Royalties",
        "description": "Earn a 5% revenue share on each digital vinyl resale, a feature not available with traditional vinyl releases."
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
        </div>
    )
}

export default Value;