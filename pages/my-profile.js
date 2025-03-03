import React, { useState, useEffect, useContext } from "react";
import { NextSeo } from 'next-seo';

//INTERNAL IMPORT
import Style from "../styles/myprofile.module.css";
import Style2 from "../styles/artist.module.css";
import { UserProfileCard, SongDisplay } from "../myProfilePage/myProfilePageIndex";
import { ArtistProfileCard, ArtistInformation } from "../artistPage/artistPageIndex";

//Import smart contract
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";


const MyProfile = () => {

    //Import smart contract
    const { fetchMyNFTs, user, renderString, openAccountSetting, setOpenAccountSetting, openArtistSettings, setOpenArtistSettings, fetchArtistNFT } = useContext(NFTMarketplaceContext);

    const [myNFTs, setMyNFTs] = useState(null);
    const [userWallet, setUserWallet] = useState(null);
    const [joiningDate, setJoiningDate] = useState(null);
    const [isArtist, setIsArtist] = useState(false);
    const [mintingContract, setMintingContract] = useState(false);
    const [artistTokenInfos, setArtistTokenInfos] = useState([]);

    const fetchOwnedNFTs = async () => {
        const MyNFTs = await fetchMyNFTs();
        console.log("MyNFTs", MyNFTs);
        setMyNFTs(MyNFTs);
    }

    function formatDateToMonthYear(timestamp) {
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: 'long' };
        const formattedDate = date.toLocaleString('en-US', options);
        const string = `Joined in ${formattedDate}`;
        return string;
    }

    useEffect(() => {
        if (user) {
            fetchOwnedNFTs();
            if (user.uid) { const walletNumber = renderString(user.uid, 6); setUserWallet(walletNumber) };
            const formattedJoiningDate = formatDateToMonthYear(parseInt(user.reloadUserInfo.createdAt));
            setJoiningDate(formattedJoiningDate);
            if (user.role == "artist") {
                setIsArtist(true);
                if (user.artist_minting_contract) {
                    setMintingContract(true);
                    fetchArtistNFT(user.uid).then((result) => {
                        setArtistTokenInfos(result);
                    });
                }
            }
        }
    }, [user]);

    const closeWindow = () => {
        if (openAccountSetting) {
            setOpenAccountSetting(false);
        }
        if (openArtistSettings) {
            setOpenArtistSettings(false);
        }
    }

    if (isArtist && user.artist_description && user.artist_photo) {
        return (
            <div className={Style2.Vh_artist}>
                <NextSeo title="Profile | LIR" description="Your personal collection of unreleased limited editions tracks. Listen, download and manage your collection." />
                <div className={Style2.artist} onClick={closeWindow}>
                    <ArtistProfileCard artist={user} myArtistProfile={true} setOpenArtistSettings={setOpenArtistSettings} />
                    <div className={Style2.artist_bottom}>
                        <ArtistInformation tokenInfos={artistTokenInfos} artistDescription={user.artist_description} myArtistProfile={true} myNFTs={myNFTs} />
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <NextSeo title="Profile | LIR" description="Your personal sanctuary of digital collectibles. Listen to your unique music treasures, manage your collection, and immerse yourself in your musical legacy." />
                <div className={Style.author} onClick={closeWindow}>
                    <UserProfileCard user={user} userWallet={userWallet} joiningDate={joiningDate} />
                    <div className={Style.author_song}>
                        <SongDisplay
                            myNFTs={myNFTs}
                            artist={false}
                        />
                    </div>
                </div>
            </div>
        );
    }
};

export default MyProfile;

