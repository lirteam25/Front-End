import React, { useState, useContext } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import Image from 'next/image';

import Style from "./Comments.module.css";
import { ActionButton } from "../../../components/componentsIndex";
import images from "../../../img/index";
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) return `${interval} years ago`;
    if (interval === 1) return "1 year ago";

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    if (interval === 1) return "1 month ago";

    interval = Math.floor(seconds / 604800);
    if (interval > 1) return `${interval} weeks ago`;
    if (interval === 1) return "1 week ago";

    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    if (interval === 1) return "1 day ago";

    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    if (interval === 1) return "1 hour ago";

    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    if (interval === 1) return "1 minute ago";

    return "just now";
}

const Comments = ({ nft, setNft }) => {

    const [visibleComments, setVisibleComments] = useState(4); // Number of comments to show initially
    const [openDelete, setOpenDelete] = useState(false);


    const handleShowMore = () => {
        setVisibleComments(visibleComments + 4); // Load 5 more comments
    };

    const closeDelete = () => {
        setOpenDelete(false);
    }

    const commentsToShow = nft.comments?.slice().reverse().slice(0, visibleComments);

    const { address, deleteComment } = useContext(NFTMarketplaceContext);

    const eliminateComment = async (_id) => {
        const updatedNFT = await deleteComment(_id, nft);
        if (updatedNFT) {
            setNft(updatedNFT);
        }
    }

    return (
        <div>
            {nft.comments?.length !== 0 ? (<div>
                <div className={`${Style.Comments_count} font-normal`}>
                    {nft.comments?.length} {nft.comments?.length == 1 ? "comment" : "comments"}
                </div>
                <div className={`${Style.Comments_overlay} ${nft.comments?.length > visibleComments && Style.dissoveBottom} `}>
                    {commentsToShow?.map((el, index) => (
                        <div key={el._id} className={`${Style.Comments_box}`}>
                            <Image src={images[`utente_${el.user_picture}`]} alt="profile user" width={30.5} height={30.5} />
                            <div className={`${Style.Comments_box_text} font-small`}>
                                <div className={Style.Comments_box_text_up}>
                                    <div>
                                        <span className='red'>{el.user_display_name}</span><span style={{ color: "var(--background-grey3)" }}> - {timeAgo(el.date)}</span>
                                    </div>
                                    {el.user_wallet === address &&
                                        (
                                            <>
                                                {openDelete === el._id ? (
                                                    <div className={Style.delete} onClick={() => eliminateComment(el._id)}>
                                                        Delete the comment
                                                    </div>) : <FaRegTrashAlt className={Style.trashIcon} onClick={() => setOpenDelete(el._id)} />}
                                            </>
                                        )
                                    }
                                </div>
                                <p>
                                    {el.comment}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {nft.comments?.length > visibleComments && (
                    <button onClick={handleShowMore} className={`${Style.ShowMoreButton} font-small`}>
                        Show More <IoIosArrowDown />
                    </button>
                )}
            </div>) : (
                <div className={`${Style.NoComments} font-normal`}>
                    <div>Seems a little quite over here</div>
                    <div style={{ color: "var(--background-grey3)" }}>Be the first to comment on this track</div>
                </div>)}
        </div>
    )
}

export default Comments