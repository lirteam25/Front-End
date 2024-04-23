import React, { useContext } from "react";
import { Player } from '@lottiefiles/react-lottie-player';

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
                    <Player
                        autoplay
                        loop
                        style={{ height: '80px', width: '80px' }}
                        src='https://lottie.host/fc0e3d65-2f19-4f85-b046-46c7dd115b6c/UaGlqmGCc7.json'
                    />
                    <p className="font-normal">{loading}</p>
                </div>
            </div>
        </div>
    );
};

export default Loading;