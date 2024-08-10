import React from 'react';
import { CiSquareQuestion } from 'react-icons/ci';

import Style from "./NFTDetails.module.css";

const NFTDetails = ({ nft, scanner }) => {
    const listed = nft.maxClaimableSupply - nft.supplyClaimed;

    function formatDateToMonthYear(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString("en-US", options);
        return formattedDate;
    }

    return (
        <div className={Style.NFTDetails}>
            <div className={Style.NFTDetails_description}>
                <div
                    className="font-small"
                    dangerouslySetInnerHTML={{ __html: nft.description || "----" }}
                />

            </div>
            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title}>
                    <h4 className="font-small">Released on</h4>
                </div>
                <div className={Style.NFTDetails_box_content}>
                    <p className="font-small">{nft.created_at ? formatDateToMonthYear(nft.created_at) : "----"}</p>
                </div>
            </div>
            {nft.musicTag && nft.musicTag.length > 0 &&
                <div className={Style.NFTDetails_box2}>
                    <div className={Style.NFTDetails_box_title}>
                        <h4 className="font-small">Genre</h4>
                    </div>
                    <div className={Style.NFTDetails_box_content}>
                        <p className="font-small">
                            {nft.musicTag.map((el, i) => (
                                <span key={i}>
                                    {el}
                                    {i < nft.musicTag.length - 1 && <br />}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>}
            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title}>
                    <h4 className="font-small">duration</h4>
                </div>
                <div className={Style.NFTDetails_box_content}>
                    <p className="font-small">{nft.audioDuration ? nft.audioDuration : "----"}</p>
                </div>
            </div>
            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title}>
                    <h4 className="font-small">price</h4>
                </div>
                <div className={Style.NFTDetails_box_content}>
                    <p className="font-small">{typeof nft.pricePerToken !== "undefined" ? (nft.pricePerToken == 0 ? "FOR FREE" : `${nft.pricePerToken} $`) : "----"}</p>
                </div>
            </div>

            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title2}>
                    <h4 className="font-small">Edition of </h4>
                    <div className={Style.NFTDetails_box_title2_icon}>
                        <CiSquareQuestion className={Style.CiSquareQuestion_editionOf} />
                        <div className={`${Style.CiSquareQuestion_editionOf_text} font-small`}>
                            <p>
                                The predefined number of editions created,
                                representing the maximum number of users who can collect the track.
                            </p>
                        </div>
                    </div>
                </div>
                <div className={Style.NFTDetails_box_content}>
                    <p className="font-small">{nft.maxClaimableSupply || "----"}</p>
                </div>
            </div>

            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title2}>
                    <h4 className="font-small">Remaining</h4>
                    <div className={Style.NFTDetails_box_title2_icon}>
                        <CiSquareQuestion className={Style.CiSquareQuestion_editionOf} />
                        <div className={`${Style.CiSquareQuestion_editionOf_text} font-small`}>
                            <p>
                                The number of editions that have not yet been collected.
                                Once all editions are collected, the secondary market will start.
                            </p>
                        </div>
                    </div>
                </div>
                <div className={Style.NFTDetails_box_content}>
                    <p className="font-small">{typeof listed !== "undefined" ? listed : "----"}</p>
                </div>
            </div>

            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title2}>
                    <h4 className="font-small">Resale Royalty</h4>
                    <div className={Style.NFTDetails_box_title2_icon}>
                        <CiSquareQuestion className={Style.CiSquareQuestion_editionOf} />
                        <div className={`${Style.CiSquareQuestion_editionOf_text} font-small`}>
                            <p>
                                Royalties are a percentage of the resale value that goes to the original creator, providing ongoing compensation for their digital artworks.
                                This ensures artists receive a share of the profits each time their tracks are resold between different users.<br />
                                <br />This percentage is setted at <span style={{ color: "var(--main-color)" }}>5%</span> by default
                            </p>
                        </div>
                    </div>
                </div>
                <div className={Style.NFTDetails_box_content}>
                    <p className="font-small">{typeof nft.royalties !== "undefined" ? `${nft.royalties}%` : "----"}</p>
                </div>
            </div>

            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title}>
                    <h4 className="font-small">Token ID</h4>
                </div>
                <div className={Style.NFTDetails_box_content}>
                    <p className="font-small">{nft.token_id || "----"}</p>
                </div>
            </div>

            <div className={Style.NFTDetails_box}>
                <div className={Style.NFTDetails_box_title}>
                    <h4 className="font-small">Contract address</h4>
                </div>
                <div style={{ color: "var(--main-color)" }} className={Style.NFTDetails_box_content}>
                    <a href={`${scanner}/address/${nft.token_address}`} className={`${Style.NFTDetails_url} font-small`} target="_blank">
                        {nft.token_address || "----"}
                    </a>
                </div>
            </div>
        </div>

    )
}

export default NFTDetails;