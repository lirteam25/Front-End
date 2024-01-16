import React, { useState } from "react";
import Switch from '@mui/material/Switch';


//INTERNAL IMPORT
import Style from "./NewSongUpload.module.css";
import DropZone from "./DropZone/DropZone";
import { InfoButton, ActionButton } from "../../components/componentsIndex";

const NewSongUpload = ({ pinFileToIPFS, createNFT, user, cloudinaryUploadVideo, cloudinaryUploadImage, setOpenLoading, setLoading }) => {
    const [song, setSong] = useState(null);
    const [version, setVersion] = useState(null);
    const [description, setDescription] = useState(null);
    const [royalties, setRoyalties] = useState(null);
    const [supply, setSupply] = useState(null);
    const [amount, setAmount] = useState(null);
    const [date, setDate] = useState(null);
    const [hour, setHour] = useState(null);

    const [price, setPrice] = useState(null);
    const [firstSaleFees, setFirstSaleFees] = useState(null);
    const [duration, setDuration] = useState(null);
    const [urlPinata, setUrlPinata] = useState(null);
    const [urlCloudinary, setUrlCloudinary] = useState(null)
    const [imageSongPinata, setImageSongPinata] = useState(null);
    const [imageSongCloudinary, setImageSongCloudinary] = useState(null);

    const [schedule, setSchedule] = useState(false);

    const mintNFT = () => {
        let combinedDateISOString;
        if (schedule) {
            const [year, month, day] = date.split('-');
            const [hours, minutes] = hour.split(':');

            const combinedDate = new Date(year, month - 1, day);
            combinedDate.setHours(hours, minutes);
            combinedDateISOString = combinedDate.toISOString();
        } else {
            combinedDateISOString = false;
        }

        createNFT(
            user.artist_minting_contract,
            user.artist_name,
            song,
            version,
            price,
            urlPinata,
            urlCloudinary,
            imageSongPinata,
            imageSongCloudinary,
            description,
            royalties,
            firstSaleFees,
            supply,
            amount,
            combinedDateISOString,
            duration
        )
    }

    const options1 = [
        { label: "Yes", value: true },
        { label: "No", value: false }
    ]

    return (
        <div className={Style.upload}>
            <div className={Style.upload_songAndVersion}>
                <div>
                    <label htmlFor="song name">Song name</label>
                    <input
                        id="song name"
                        type="text"
                        placeholder="Name of the song"
                        onChange={(e) => setSong(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="version">Version</label>
                    <input
                        id="version"
                        type="text"
                        placeholder="Describe your version in a couple words (e.g. acoustic, live,..)"
                        onChange={(e) => setVersion(e.target.value)}
                    />
                </div>
            </div>
            <div className={Style.upload_description}>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    cols="30"
                    rows="6"
                    placeholder="Description of the song version"
                    onChange={(e) => setDescription(e.target.value)}
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
            <div className={Style.upload_description}>
                <label htmlFor="royalties">Royalties</label>
                <input
                    id="royalties"
                    type="number"
                    placeholder="Insert the royalties percentage. The numer is already in percentage (e.g. insert 10 for 10% royalties)."
                    onChange={(e) => setRoyalties(e.target.value)}
                />
            </div>
            <div className={Style.upload_description}>
                <label htmlFor="supply">Supply</label>
                <input
                    id="supply"
                    type="number"
                    placeholder="Select the supply of the tokens."
                    onChange={(e) => setSupply(parseInt(e.target.value))}
                />
            </div>
            <div className={Style.upload_description}>
                <label htmlFor="amount">Amount</label>
                <input
                    id="amount"
                    type="number"
                    placeholder="Select the number of token you would like to sell."
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                />
            </div>
            <div className={Style.upload_description}>
                <label htmlFor="price">Price</label>
                <input
                    id="price"
                    type="string"
                    placeholder="Insert the price of the unpublish version"
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>

            <div className={Style.upload_description}>
                <label htmlFor="first sale fees">First sale fees</label>
                <input
                    id="first sale fees"
                    type="string"
                    placeholder="Insert the % of first sale fees"
                    onChange={(e) => setFirstSaleFees(e.target.value)}
                />
            </div>

            <div className={Style.upload_description}>
                <label htmlFor="duration">Duration</label>
                <input
                    id="duration"
                    type="string"
                    placeholder="Insert the length of your song. Suggested format: 03:21"
                    onChange={(e) => setDuration(e.target.value)}
                />
            </div>

            <div className={Style.yesOrNo2}>
                <label>Would you like to schedule the drop of the version?</label>
                <div className={Style.selectContainer2}>
                    <Switch onChange={() => { setSchedule(!schedule) }} />
                </div>
            </div>

            {schedule && (
                <div className={Style.upload_songAndVersion}>
                    <div>
                        <label htmlFor="date">Day</label>
                        <input
                            id="date"
                            type="date"
                            placeholder="Insert the date"
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div>
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

            <div className={Style.upload_box_btn}>
                {(song && version && price && urlPinata && urlCloudinary && imageSongPinata && imageSongCloudinary && description && royalties && supply && amount && firstSaleFees && duration) ? (
                    <div>
                        {(amount > supply) ? (<InfoButton text="The amount is higher than the supply" />) : (
                            <ActionButton action={mintNFT} text="Create tokens" />
                        )
                        }
                    </div>
                ) : (<InfoButton text="Insert all data to mint tokens" />)}
            </div>
        </div>
    );
};

export default NewSongUpload;