import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineUpload, AiOutlineCheck } from "react-icons/ai";
import CircularProgress from '@mui/material/CircularProgress';


//INTRNAL IMPORT
import Style from "./DropZone.module.css";

const DropZone = ({
    user,
    urlPinata,
    setUrlPinata,
    setUrlCloudinary,
    imageSongPinata,
    setImageSongPinata,
    pinFileToIPFS,
    cloudinaryUploadVideo,
    cloudinaryUploadImage,
    setImageSongCloudinary
}) => {

    const [audioLoading, setAudioLoading] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);

    const onDropAudio = useCallback(async (file) => {
        setAudioLoading(20);
        console.log(file);
        const response = await cloudinaryUploadVideo(file, user.artist_name);
        setAudioLoading(80);
        console.log(response);
        const path = response.secure_url.replace(process.env.CLOUDINARY_URL, "");
        console.log("URL CLOUDINARY", path);
        setUrlCloudinary(path);
        const urlAudio = await pinFileToIPFS(file[0]);
        setUrlPinata(urlAudio);
        setAudioLoading(false);
        console.log(urlAudio);
    });
    const { getRootProps: getRootAudioProps, getInputProps: getInputAudioProps } = useDropzone({
        onDrop: onDropAudio,
        accept: "audio/*",
        maxSize: 100000000,
    });

    const onDropImg = useCallback(async (file) => {
        setImgLoading(true);
        console.log(file);
        const response = await cloudinaryUploadImage(file, user.artist_name);
        console.log(response);
        const path = response.secure_url.replace(process.env.CLOUDINARY_URL, "");
        console.log("Image URL CLOUDINARY", path);
        setImageSongCloudinary(path);
        const urlImg = await pinFileToIPFS(file[0]);
        setImageSongPinata(urlImg);
        setImgLoading(false);
    });

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onDropImg,
        accept: "Image/*",
        maxSize: 20000000,
    });

    return (
        <div className={Style.DropZone}>
            <label htmlFor="audio">Audio File</label>
            {audioLoading ? (
                <div className={Style.DropZone_box_done}>
                    <div>The Audio is being loaded</div>
                    <div className={Style.DropZone_box_done_loading}>
                        <CircularProgress variant="determinate" color="inherit" value={audioLoading} />
                    </div>
                </div>
            ) : (<div>
                {urlPinata ? (
                    <div className={Style.DropZone_box_done} {...getRootAudioProps()}>
                        <input {...getInputAudioProps()} id="audio" />
                        <div>File Audio Dropped</div>
                        <AiOutlineCheck className={Style.DropZone_box_icon} />
                    </div>
                ) : (
                    <div className={Style.DropZone_box} {...getRootAudioProps()}>
                        <input {...getInputAudioProps()} id="audio" />
                        <div>Drop the File Audio</div>
                        <AiOutlineUpload className={Style.DropZone_box_icon} />
                    </div>
                )}
            </div>)}

            <label htmlFor="image song">Cover Image of the song</label>
            {imgLoading ? (<div className={Style.DropZone_box_done}>
                <div>The Image is being loaded</div>
                <div className={Style.DropZone_box_done_loading}>
                    <CircularProgress variant="indeterminate" color="inherit" />
                </div>
            </div>) : (<div>
                {imageSongPinata ? (
                    <div className={Style.DropZone_box_done} {...getRootProps()}>
                        <input {...getInputProps()} id="image song" />
                        <div>Image Dropped</div>
                        <AiOutlineCheck className={Style.DropZone_box_icon} />
                    </div>
                ) : (
                    <div className={Style.DropZone_box} {...getRootProps()}>
                        <input {...getInputProps()} id="image song
                        
                        " />
                        <div>Drop the Cover Image</div>
                        <AiOutlineUpload className={Style.DropZone_box_icon} />
                    </div>
                )}
            </div>)}
        </div>
    );
};

export default DropZone;