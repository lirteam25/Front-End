import React, { useState, useContext, useEffect } from "react";
import { NextSeo } from 'next-seo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["_app", "create"])),
        }
    }
}
import { useTranslation } from "next-i18next";

//INTERNAL IMPORT
import Style from "../styles/upload-nft.module.css";
import { NewSongUpload } from "../uploadNFT/uploadNFTIndex";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const Create = () => {
    const { pinFileToIPFS, createNFT, convertAudioToBuffer, user, cloudinaryUploadVideo, cloudinaryUploadImage, setOpenLoading, setLoading } = useContext(NFTMarketplaceContext);

    const [isArtist, setIsArtist] = useState(false);

    const { t } = useTranslation("create");

    useEffect(() => {
        if (user) {
            if (user.role == "artist") {
                setIsArtist(true);
            }
        }
    }, [user])

    if (!isArtist) {
        return (
            <div>
                Only artist can use this page
            </div>
        )
    } else {
        return (
            <div>
                <NextSeo title="Mint Token | LIR" description="Mint your exclusive content" />
                <div className={Style.create}>
                    <h1 className="font-large">{t("title")}</h1>
                    <p>{t("title_expl")}</p>
                    <div className={Style.uploadNFT_box_form}>
                        <NewSongUpload pinFileToIPFS={pinFileToIPFS} createNFT={createNFT} convertAudioToBuffer={convertAudioToBuffer} user={user} cloudinaryUploadVideo={cloudinaryUploadVideo} cloudinaryUploadImage={cloudinaryUploadImage} setOpenLoading={setOpenLoading} setLoading={setLoading} />
                    </div>
                </div>
            </div>
        );
    }
};

export default Create;