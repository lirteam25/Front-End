import React from 'react';

import Style from "./TopCollectors.module.css";


const TopCollectors = ({ collectors }) => {


    const loading = [{ _id: 0 }, { _id: 1 }, { _id: 2 }, { _id: 3 }, { _id: 4 }, { _id: 5 }, { _id: 6 }, { _id: 7 }, { _id: 8 }, { _id: 9 }]
    return (
        <div className={Style.borders}>
            <div className={Style.TopCollectors}>
                <div className={Style.TopCollectors_grid}>
                    <div className={`${Style.TopCollectors_grid_left} font-huge`}>
                        TOP 10 COLLECTORS
                    </div>
                    <div className={Style.TopCollectors_grid_right}>
                        <div className={Style.TopCollectors_grid_right_title}>
                            <div className={`${Style.box_line_name} font-normal`}>
                                #
                            </div>
                            <div className={`${Style.box_line_name} font-normal`}>
                                USERNAME
                            </div>
                            <div className={`${Style.box_line_count} font-normal`}>
                                # ITEMS COLLECTED
                            </div>
                        </div>
                        {collectors ? (collectors.map((el, i) => (
                            <div className={`${Style.TopCollectors_grid_right_content} font-small`} key={el.uid}>
                                <div>
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                                <div>
                                    {el.displayName}
                                </div>
                                <div >
                                    {el.count}
                                </div>
                            </div>

                        ))) : (
                            loading.map((el, i) => (
                                <div className={`${Style.TopCollectors_grid_right_content} font-normal`} key={el._id}>
                                    <div>
                                        --
                                    </div>
                                    <div>
                                        --
                                    </div>
                                </div>
                            )
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopCollectors;