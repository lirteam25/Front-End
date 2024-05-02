import React, { useState, useContext, useCallback } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import DOMPurify from "dompurify";
import { useDropzone } from "react-dropzone";
import CircularProgress from '@mui/material/CircularProgress';
import { FaInstagram, FaSpotify, FaSoundcloud } from "react-icons/fa";

import Style from "./ArtistSettings.module.css";
import { ActionButton, InfoButton } from '../../../components/componentsIndex';
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';

const ArtistSettings = ({ closeArtistSettings }) => {
    const { user, updateUserInformations, openErrorAuth, cloudinaryUploadImage } = useContext(NFTMarketplaceContext);

    const [artistName, setArtistName] = useState();
    const [image, setImage] = useState();
    const [imgLoading, setImgLoading] = useState(false);
    const [description, setDescription] = useState();
    const [instagram, setInstagram] = useState();
    const [spotify, setSpotify] = useState();
    const [soundCloud, setSoundCloud] = useState();

    const onDropImage = useCallback(async (file) => {
        setImgLoading(true);
        const response = await cloudinaryUploadImage(file, user._id);
        console.log(response);
        const path = response.secure_url.replace(process.env.CLOUDINARY_URL, "");
        console.log("Image URL CLOUDINARY", path);
        setImage(path);
        setImgLoading(false);
    });

    const { getRootProps: getRootImageProps, getInputProps: getInputImageProps } = useDropzone({
        onDrop: onDropImage,
        accept: "Image/*",
        maxSize: 20000000,
    });

    const handleDescriptionChange = (e) => {
        const plainText = e.target.value;
        const htmlText = plainText.replace(/\n/g, '<br>');
        setDescription(htmlText);
    };

    const updateInformation = async () => {
        await updateUserInformations(artistName, description, instagram, spotify, soundCloud, image);
    }

    const decodeHtmlEntities = (html) => {
        const sanitizedHTML = DOMPurify.sanitize(html);
        const txt = document.createElement('textarea');
        txt.innerHTML = sanitizedHTML;
        return txt.value;
    };

    return (
        <div className={Style.ArtistSettings}>
            <div className={`${Style.ArtistSettings_top} font-normal`}>
                <div className={Style.ArtistSettings_top_title}>
                    {user.artist_name && user.artist_photo && user.artist_description ? "Edit your profile" : "Create your profile"}
                </div>
                <AiOutlineClose className={Style.ArtistSettings_top_x} onClick={closeArtistSettings} />
            </div>
            <div className={Style.ArtistSettings_bottom}>
                {!user.artist_name &&
                    <div className={Style.ArtistSettings_bottom_ArtistName}>
                        <div className={Style.ArtistSettings_bottom_ArtistName_95}>
                            <div className='font-normal'>
                                Insert Your Artist Name
                            </div>
                            <input
                                className={Style.user_box_input_input}
                                style={{ margin: "0.5rem 0rem" }}
                                type="name"
                                placeholder={"Carefull! Your artist name once saved cannot be changed"}
                                onChange={(e) => setArtistName(e.target.value)}
                            />
                        </div>
                    </div>}
                <div className={Style.ArtistSettings_bottom_cover}>
                    <div className={Style.ArtistSettings_bottom_cover_95}>
                        <div
                            className={`${Style.artist_background_image} font-normal`}
                            style={image ? { backgroundImage: `url(${image})` } : (user.artist_photo ? { backgroundImage: `url(${user.artist_photo})` } : { backgroundColor: "var(--background-grey)" })}
                            {...getRootImageProps()}>
                            <input {...getInputImageProps()} id="audio" />
                            {imgLoading ? (
                                <div className={Style.artist_background_image_loading}>
                                    <div className={Style.artist_background_image_loading_box}>
                                        <div>The image is being loaded</div>
                                        <div className={Style.artist_background_image_loading_box_circular}>
                                            <CircularProgress variant="indeterminate" color="inherit" />
                                        </div>
                                    </div>
                                </div>
                            ) : (<div className={Style.artist_background_image_button}>
                                <div className={Style.artist_background_image_button_button}>
                                    {user.artist_photo ? "UPLOAD A NEW PROFILE PICTURE" : "UPLOAD A PROFILE PICTURE"}
                                </div>
                            </div>)}
                        </div>
                        <div className='font-small' style={{ paddingTop: "0.5rem" }}>For best results on all devices, use an image with a resolution of at least 1920 x 384 pixels and whose size does not exceed 10 MB.
                        </div>
                    </div>
                </div>
                <div className={Style.ArtistSettings_bottom_info}>
                    <div className={Style.ArtistSettings_bottom_info_description}>
                        <div className='font-normal'>Description</div>
                        <textarea
                            id="description"
                            cols="30"
                            rows="3"
                            placeholder={user.artist_description ? decodeHtmlEntities(user.artist_description) : "Let fans know about your artistic journey"}
                            onChange={handleDescriptionChange}
                        />
                    </div>
                </div>
                <div className={Style.ArtistSettings_bottom_link}>
                    <div className={Style.ArtistSettings_bottom_info_description}>
                        <div className='font-normal'>Links</div>
                        <div className={Style.login_container_bottom_about_links}>
                            <FaInstagram size={18} />
                            <input
                                className={Style.user_box_input_input}
                                style={{ margin: "0.5rem 0rem" }}
                                type="name"
                                placeholder={user.artist_instagram ? user.artist_instagram : "Insert the link to your Instagram"}
                                onChange={(e) => setInstagram(e.target.value)}
                            />
                        </div>
                        <div className={Style.login_container_bottom_about_links}>
                            <FaSpotify size={18} />
                            <input
                                className={Style.user_box_input_input}
                                style={{ margin: "0.5rem 0rem" }}
                                type="name"
                                placeholder={user.artist_spotify ? user.artist_spotify : "Insert the link to your Spotify"}
                                onChange={(e) => setSpotify(e.target.value)}
                            />
                        </div>
                        <div className={Style.login_container_bottom_about_links}>
                            <FaSoundcloud size={18} />
                            <input
                                className={Style.user_box_input_input}
                                style={{ margin: "0.5rem 0rem" }}
                                type="name"
                                placeholder={user.artist_soundcloud ? user.artist_soundcloud : "Insert the link to your SoundCloud"}
                                onChange={(e) => setSoundCloud(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {openErrorAuth &&
                    <div className={`${Style.incorrectEmail} font-small`}>
                        {errorAuth}
                    </div>
                }
                <div className={Style.login_box_button}>
                    {user.artist_photo && user.artist_description ? <div>
                        {image || description || instagram || spotify || soundCloud ?
                            <ActionButton action={updateInformation} text="UPDATE INFORMATION" fontSize="0.9rem" /> :
                            <InfoButton text="UPDATE INFORMATION" fontSize="0.9rem" />}</div> : <div>
                        {artistName && description && image ?
                            <ActionButton action={updateInformation} text="CREATE PROFILE" fontSize="0.9rem" /> :
                            <InfoButton text="artist name, picture and description are required" fontSize="0.9rem" />}
                    </div>}

                </div>
            </div>
        </div >
    )
}

export default ArtistSettings;