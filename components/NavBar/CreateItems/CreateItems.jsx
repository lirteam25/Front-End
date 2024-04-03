import React, { useState, useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Switch from '@mui/material/Switch';
import { CiSquareQuestion } from "react-icons/ci";

//INTERNAL IMPORT
import Style from "./CreateItems.module.css";
import DropZone from "./DropZone/DropZone";
import { InfoButton, SmartContractButton } from "../../componentsIndex";
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

const CreateItem = ({ closeCreateItems }) => {
    const { pinFileToIPFS, createNFT, user, cloudinaryUploadVideo, cloudinaryUploadImage, connectWallet, currentAccount } = useContext(NFTMarketplaceContext);

    const [song, setSong] = useState(null);
    const [description, setDescription] = useState(null);
    const [supply, setSupply] = useState(null);
    const [date, setDate] = useState(null);
    const [hour, setHour] = useState(null);

    const [price, setPrice] = useState(null);
    const [duration, setDuration] = useState(null);
    const [urlPinata, setUrlPinata] = useState(null);
    const [urlCloudinary, setUrlCloudinary] = useState(null)
    const [imageSongPinata, setImageSongPinata] = useState(null);
    const [imageSongCloudinary, setImageSongCloudinary] = useState(null);

    const [schedule, setSchedule] = useState(false);

    const mintNFT = async (nftMintArtistContract) => {
        let combinedDateISO;
        if (schedule) {
            const [year, month, day] = date.split('-');
            const [hours, minutes] = hour.split(':');
            const combinedDateISO = new Date(year, month - 1, day, hours, minutes);
            console.log(combinedDateISO);
        } else {
            combinedDateISO = false;
        }

        closeCreateItems();
        await createNFT(nftMintArtistContract, user.artist_name, song, price, urlPinata, urlCloudinary, imageSongPinata, imageSongCloudinary, description, supply, user.artist_royalties, combinedDateISO, duration);
    }

    const numberInputOnWheelPreventChange = (e) => {
        // Prevent the input value change
        e.target.blur()

        // Prevent the page/container scrolling
        e.stopPropagation()
        setTimeout(() => {
            e.target.focus()
        }, 0)
    }

    const switchStyle = {
        color: 'var(--main-color)',  // Replace with your actual variable or color value
    };

    return (
        <div className={Style.CreateItems}>
            <div className={`${Style.CreateItems_top} font-normal`}>
                <div className={Style.CreateItems_top_title}>
                    CREATE A DIGITAL COLLECTIBLE
                </div>
                <AiOutlineClose className={Style.CreateItems_top_x} onClick={closeCreateItems} />
            </div>
            <div className={Style.CreateItems_bottom}>
                <div className={Style.CreateItems_bottom_element}>
                    <label className='font-normal' htmlFor="song name">Track name</label>
                    <input
                        id="song name"
                        type="text"
                        placeholder="Track name."
                        onChange={(e) => setSong(e.target.value)}
                    />
                </div>
                <div className={Style.CreateItems_bottom_element}>
                    <label className='font-normal' htmlFor="description">Track description</label>
                    <textarea
                        id="description"
                        cols="30"
                        rows="3"
                        placeholder="Track description."
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className={Style.CreateItems_bottom_element}>
                    <label className='font-normal' htmlFor="duration">Track length</label>
                    <input
                        id="duration"
                        type="text"
                        pattern="\d{2}:\d{2}"
                        placeholder="Track length. Suggested format: 03:21."
                        onChange={(e) => setDuration(e.target.value)}
                    />
                </div>
                <DropZone
                    user={user}
                    urlPinata={urlPinata}
                    setUrlPinata={setUrlPinata}
                    setUrlCloudinary={setUrlCloudinary}
                    imageSongPinata={imageSongPinata}
                    setImageSongPinata={setImageSongPinata}
                    pinFileToIPFS={pinFileToIPFS}
                    cloudinaryUploadVideo={cloudinaryUploadVideo}
                    cloudinaryUploadImage={cloudinaryUploadImage}
                    setImageSongCloudinary={setImageSongCloudinary}
                />
                <div className={Style.CreateItems_bottom_element}>
                    <div className={Style.CreateItems_bottom_element_titleWithTutorial}>
                        <label className='font-normal' htmlFor="supply">Supply</label>
                        <div className={Style.CreateItems_bottom_element_titleWithTutorial_icon}>
                            <CiSquareQuestion className={Style.CreateItems_bottom_element_titleWithTutorial_icon_icon} size={22} />
                            <div className={`${Style.CreateItems_bottom_element_titleWithTutorial_icon_appear} font-small`}>
                                <p>
                                    The supply denotes the predefined quantity of editions you intend to create, representing the maximum number of users who can collect your track before the secondary market.
                                </p>
                            </div>
                        </div>
                    </div>
                    <input
                        id="supply"
                        type="number"
                        min="1"
                        required
                        onWheel={numberInputOnWheelPreventChange}
                        placeholder="Track supply."
                        onChange={(e) => setSupply(parseInt(e.target.value))}
                    />
                </div>
                <div className={Style.CreateItems_bottom_element}>
                    <div className={Style.CreateItems_bottom_element_titleWithTutorial}>
                        <label className='font-normal' htmlFor="price">Price</label>
                        <div className={Style.CreateItems_bottom_element_titleWithTutorial_icon}>
                            <CiSquareQuestion className={Style.CreateItems_bottom_element_titleWithTutorial_icon_icon} size={22} />
                            <div className={`${Style.CreateItems_bottom_element_titleWithTutorial_icon_appear} font-small`}>
                                <p>
                                    The price of your edition.
                                </p>
                                <p>
                                    <span style={{ color: "var(--main-color)" }}>IMPORTANT</span>: the price setted is in US dollars.
                                </p>
                            </div>
                        </div>
                    </div>
                    <input
                        id="price"
                        type="number"
                        min="0"
                        required
                        step="0.1"
                        onWheel={numberInputOnWheelPreventChange}
                        placeholder="Price in US dollars."
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div className={Style.CreateItems_bottom_element}>
                    <div className={Style.CreateItems_bottom_element_titleWithTutorial}>
                        <div className='font-normal'>Royalties: <span style={{ color: "var(--background-grey3)" }} className="font-small">{user.artist_royalties}%</span></div>
                        <div className={Style.CreateItems_bottom_element_titleWithTutorial_icon}>
                            <CiSquareQuestion className={Style.CreateItems_bottom_element_titleWithTutorial_icon_icon} size={22} />
                            <div className={`${Style.CreateItems_bottom_element_titleWithTutorial_icon_appear} font-small`}>
                                <p>
                                    Royalties are a percentage of the resale value that goes to the original creator, providing ongoing compensation for their digital artworks.
                                    This ensures artists receive a share of the profits each time their tracks are resold between different users.<br />
                                    Normally this percentage varies between <span style={{ color: "var(--main-color)" }}>5%</span> to <span style={{ color: "var(--main-color)" }}>10%</span>
                                </p>
                                <p>
                                    <span style={{ color: "var(--main-color)" }}>IMPORTANT</span>: The number is already in percentage format- e.g. insert 5 for 5% royalties.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={Style.CreateItems_bottom_element}>
                    <div className={Style.CreateItems_bottom_element_titleWithTutorial}>
                        <div className='font-normal'>First sale fees: <span style={{ color: "var(--background-grey3)" }} className="font-small">{user.artist_first_sale_fee}%</span></div>
                        <div className={Style.CreateItems_bottom_element_titleWithTutorial_icon}>
                            <CiSquareQuestion className={Style.CreateItems_bottom_element_titleWithTutorial_icon_icon} size={22} />
                            <div className={`${Style.CreateItems_bottom_element_titleWithTutorial_icon_appear} font-small`}>
                                <p>
                                    Platform's share when a user purchase your track. Cannot be manually modified. <br />
                                    If it does not align with the agreed-upon terms or for any inquiries, please contact us at <a href="mailto:info@lirmusic.com" style={{ color: "var(--main-color)", textDecoration: "underline" }}>info@lirmusic.com</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={Style.CreateItems_bottom_yesOrNo}>
                    <div className='font-normal'>Would you like to schedule the drop of the track?</div>
                    <Switch style={switchStyle} color="default" onChange={() => { setSchedule(!schedule) }} />
                </div>

                {schedule && (
                    <div>
                        <div className={Style.CreateItems_bottom_element}>
                            <label htmlFor="date">Day</label>
                            <input
                                id="date"
                                type="date"
                                placeholder="Insert the date"
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className={Style.CreateItems_bottom_element}>
                            <label htmlFor="hour">Hour</label>
                            <input
                                id="hour"
                                type="time"
                                placeholder="Insert the hour"
                                onChange={(e) => setHour(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div className={Style.CreateItems_bottom_btn}>
                    {(song && price && urlPinata && urlCloudinary && imageSongPinata && imageSongCloudinary && description && supply && duration) ? (

                        <SmartContractButton text="Create a digital collectible" contractAddress={user.artist_minting_contract}
                            action={mintNFT}
                            toast="successfully "
                        />
                    ) : (
                        <InfoButton text="Insert all data to mint tokens" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateItem;