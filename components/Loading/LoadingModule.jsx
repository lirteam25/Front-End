import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

import Style from "./Loading.module.css";

const LoadingModule = ({ height, width }) => {
    return (
        <>
            <Player
                autoplay
                loop
                style={{ height: height, width: width, textAlign: "center" }}
                src='https://lottie.host/fc0e3d65-2f19-4f85-b046-46c7dd115b6c/UaGlqmGCc7.json'
            />
        </>
    )
}

export default LoadingModule;