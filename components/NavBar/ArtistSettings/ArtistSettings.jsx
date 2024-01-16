import React, { useState, useContext, useCallback } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import DOMPurify from "dompurify";
import { useDropzone } from "react-dropzone";
import CircularProgress from '@mui/material/CircularProgress';
import { FaInstagram, FaSpotify, FaSoundcloud } from "react-icons/fa";

import Style from "./ArtistSettings.module.css";
import { ActionButton, InfoButton, LinkButton } from '../../../components/componentsIndex';
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';

const ArtistSettings = ({ closeArtistSettings }) => {
    const { user, updateUserInformations, openErrorAuth, cloudinaryUploadImage } = useContext(NFTMarketplaceContext);

    const [imgLoading, setImgLoading] = useState(false);
    const [description, setDescription] = useState();
    const [instagram, setInstagram] = useState();
    const [spotify, setSpotify] = useState();
    const [soundCloud, setSoundCloud] = useState();

    const onDropImage = useCallback(async (file) => {
        setImgLoading(true);
        const response = await cloudinaryUploadImage(file, user.artist_name);
        console.log(response);
        const path = response.secure_url.replace(process.env.CLOUDINARY_URL, "");
        console.log("Image URL CLOUDINARY", path);
        const response2 = await updateUserInformations(null, null, null, null, path, user.accessToken);
        console.log(response2);
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
        await updateUserInformations(description, instagram, spotify, soundCloud, null, user.accessToken);
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
                    Edit your profile
                </div>
                <AiOutlineClose className={Style.ArtistSettings_top_x} onClick={closeArtistSettings} />
            </div>
            <div className={Style.ArtistSettings_bottom}>
                <div className={Style.ArtistSettings_bottom_cover}>
                    <div
                        className={`${Style.artist_background_image} font-normal`}
                        style={user.artist_photo && { backgroundImage: `url(${user.artist_photo})` }}
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
                                DROP A NEW PROFILE PICTURE
                            </div>
                        </div>)}
                    </div>
                </div>
                <div className={Style.ArtistSettings_bottom_info}>
                    <div className={Style.ArtistSettings_bottom_info_description}>
                        <div className='font-normal'>Description</div>
                        <textarea
                            id="description"
                            cols="30"
                            rows="3"
                            placeholder={decodeHtmlEntities(user.artist_description)}
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
                                placeholder={user.artist_instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                            />
                        </div>
                        <div className={Style.login_container_bottom_about_links}>
                            <FaSpotify size={18} />
                            <input
                                className={Style.user_box_input_input}
                                style={{ margin: "0.5rem 0rem" }}
                                type="name"
                                placeholder={user.artist_spotify}
                                onChange={(e) => setSpotify(e.target.value)}
                            />
                        </div>
                        <div className={Style.login_container_bottom_about_links}>
                            <FaSoundcloud size={18} />
                            <input
                                className={Style.user_box_input_input}
                                style={{ margin: "0.5rem 0rem" }}
                                type="name"
                                placeholder={user.artist_soundcloud}
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
                    {description || instagram || spotify || soundCloud ?
                        <ActionButton action={updateInformation} text="UPDATE INFORMATION" fontSize="0.9rem" /> :
                        <InfoButton text="Fill to save" fontSize="0.9rem" />}
                </div>
            </div>
        </div >
    )
}

export default ArtistSettings;