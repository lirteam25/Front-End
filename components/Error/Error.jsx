import React, { useContext } from "react";

//INTERNAL IMPORT
import Style from "./Error.module.css";

//SMART CONTRCAT IMPORT CONTEXT
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";


const ErrorPage = () => {
    const { error, setOpenError } = useContext(NFTMarketplaceContext);
    return (
        <div className={Style.Error} onClick={() => setOpenError(false)}>
            <div className={Style.Error_box} onClick={(e) => e.stopPropagation()}>
                <div className={`${Style.Error_box_top} font-medium`}>
                    ERROR
                </div>
                <div className={`${Style.Error_box_bottom} font-normal`} dangerouslySetInnerHTML={{ __html: error }}>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;