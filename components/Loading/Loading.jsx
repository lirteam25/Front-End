import React, { useContext } from "react";
//import { Player } from '@lottiefiles/react-lottie-player';

//INTERNAL IMPORT
import Style from "./Loading.module.css";

//SMAFRT CONTRCAT IMPORT CONTEXT
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const Loading = () => {
    const { loading } = useContext(NFTMarketplaceContext);
    return (
        <div className={Style.Error}>
            <div className={Style.Error_box}>
                <div className={Style.Error_box_info}>
                    <p className="font-normal">{loading}</p>
                </div>
            </div>
        </div>
    );
};

export default Loading;