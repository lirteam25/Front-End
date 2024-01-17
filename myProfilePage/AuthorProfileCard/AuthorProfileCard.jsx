import React, { useContext } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./AuthorProfileCard.module.css";
import { ActionButton } from "../../components/componentsIndex";
import img from "../../img/index";
import { NFTMarketplaceContext } from '../../Context/NFTMarketplaceContext';

const AuthorProfileCard = ({ user, userWallet, joiningDate }) => {


    const { setOpenToast, setToast, setOpenArtistSettings } = useContext(NFTMarketplaceContext);


    function copyToClipboard(text) {
        if (!navigator.clipboard) {
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setOpenToast(true);
            setToast("Copied to clipboard");
        } else {
            navigator.clipboard.writeText(text).then(
                function () {
                    setOpenToast(true);
                    setToast("Copied to clipboard");
                })
                .catch(
                    function () {
                        alert("err"); // error
                    });
        }
    }

    const handleCopyClick = () => {
        copyToClipboard(user.wallet);
    };

    const openCreateArtistProfile = () => {
        setOpenArtistSettings(true);
    }

    return (
        <div className={Style.AuthorProfileCard}>
            <div className={Style.AuthorProfileCard_box} >
                <div className={Style.AuthorProfileCard_box_right}>
                    <h1 className="font-large">{user ? user.displayName : ("----")}</h1>
                    {user && user.role == "artist" && !user.artist_name && !user.artist_description && !user.artist_photo &&
                        <div className={Style.AuthorProfileCard_box_right_button}>
                            <ActionButton text="Create your artist profile" action={openCreateArtistProfile} fontSize="0.9rem" />
                        </div>
                    }
                </div>
                <div className={Style.AuthorProfileCard_box_left}>
                    <div className={`${Style.AuthorProfileCard_box_left_box} font-small`} onClick={handleCopyClick}>{userWallet ? (<div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}><Image alt="copy" src={img.copy} height={13} width={13} /> <div>{userWallet}<span style={{ fontFamily: "Space Grotesk" }}>...</span></div></div>) : "----"}</div>
                    <div className={`${Style.AuthorProfileCard_box_left_box} ${Style.hide} font-small`} >{joiningDate || "----"}</div>
                </div>
            </div>
        </div>
    );
};

export default AuthorProfileCard;