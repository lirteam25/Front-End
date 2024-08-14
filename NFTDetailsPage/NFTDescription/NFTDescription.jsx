import React, { useState, useContext } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Image from "next/image";
import { ActionButton } from "../../components/componentsIndex";
import { isMobile } from "react-device-detect";
//Internal Imports
import Style from "./NFTDescription.module.css";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";
import NFTDetails from "./NFTDetails/NFTDetails";
import Comments from "./Comments/Comments";
import Collectors from "./Collectors/Collectors";
import images from "../../img/index";
import { LastRelease } from "../../indexPage/indexIndex";

const NFTDescription = ({ nft, user, collectors, discoverMore, setNft }) => {


    const scanner = "https://polygonscan.com";

    const [tokenDetails, setTokenDetails] = useState(isMobile ? false : true);
    const [comment, setComment] = useState(null);

    const { handleLoginWithThirdweb, addComment, setToast, setOpenToast } = useContext(NFTMarketplaceContext);

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && comment) {
            await sendComment();
        }
    };

    const sendCommentToDb = async () => {
        if (comment) {
            const newNftWithComment = await addComment(nft, comment);
            console.log(newNftWithComment)
            setNft(newNftWithComment);
            setComment("")
        }
    }

    const sendComment = async () => {
        if (comment) {
            if (user) {
                sendCommentToDb()
            } else {
                await handleLoginWithThirdweb();
                setToast("Now you can comment");
                setOpenToast(true);
            }
        }
    }

    return (
        <div>
            <div className={Style.NFTDescription}>
                <div className={Style.NFTDescription_grid}>
                    <div className={Style.NFTDescription_grid_box}>
                        <div className={`${Style.NFTDescription_grid_box_title} font-normal`} onClick={() => setTokenDetails(!tokenDetails)}>
                            <div className={Style.NFTDescription_grid_box_title_arrow}>
                                {tokenDetails ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </div>
                            <div className={Style.NFTDescription_grid_box_title_text}>Track details</div>
                        </div>
                        {tokenDetails &&

                            <NFTDetails nft={nft} scanner={scanner} />
                        }
                    </div>
                    <div className={Style.NFTDescription_grid_comment}>
                        <div className={Style.NFTDescription_grid_comment_collectedBy}>
                            <div className="font-normal">
                                Collected by
                            </div>
                            <Collectors collectors={collectors} />
                        </div>
                        <div className={Style.NFTDescription_grid_comment_action}>
                            <div className={Style.NFTDescription_grid_comment_action_comment}>
                                <Image src={images[`utente_${user ? user.picture : "1"}`]} alt="profile user" width={30.5} height={30.5} />
                                <div className={Style.NFTDescription_grid_comment_action_comment_input}>
                                    <input
                                        type="name"
                                        placeholder={"Write a comment..."}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                    />
                                    <ActionButton text="post" action={sendComment} />
                                </div>
                            </div>
                        </div>
                        <Comments nft={nft} setNft={setNft} />
                    </div>
                </div>
            </div>
            <div className={Style.Other}>
                <div className={`${Style.Other_title} font-normal`}>You may also like</div>
                <div className={Style.Other_content}>
                    <LastRelease tokenInfoData={discoverMore} />
                </div>
            </div>
        </div>
    )
}

export default NFTDescription;