import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineUpload, AiOutlineCheck } from "react-icons/ai";
import CircularProgress from '@mui/material/CircularProgress';
import { CiSquareQuestion } from "react-icons/ci";

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
    setImageSongCloudinary,
    setDuration
}) => {

    const [audioLoading, setAudioLoading] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);

    function secondsToMMSS(secondsInput) {
        const totalSeconds = Math.round(secondsInput); // Round the total seconds
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // Convert minutes and seconds to two-digit format
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(seconds).padStart(2, '0');

        return `${minutesStr}:${secondsStr}`;
    }

    const onDropAudio = useCallback(async (file) => {
        setAudioLoading(20);
        console.log(file);
        const response = await cloudinaryUploadVideo(file, user._id);
        setAudioLoading(80);
        console.log(response);
        const duration = secondsToMMSS(response.duration);
        console.log(duration);
        setDuration(duration);
        const path = response.secure_url.replace(process.env.CLOUDINARY_URL, "");
        console.log("URL CLOUDINARY", path);
        setUrlCloudinary(path);
        const urlAudio = await pinFileToIPFS(file[0], user._id);
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
        const response = await cloudinaryUploadImage(file, user._id);
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
            <div className={Style.DropZone_titleWithTutorial}>
                <label className="font-normal" htmlFor="audio">Audio File</label>
                <div className={Style.DropZone_titleWithTutorial_icon}>
                    <CiSquareQuestion className={Style.DropZone_titleWithTutorial_icon_icon} size={22} />
                    <div className={`${Style.DropZone_titleWithTutorial_icon_appear} font-small`}>
                        <p>Two different file formats are accepted: <span style={{ color: "var(--main-color)" }}>MP3</span> and <span style={{ color: "var(--main-color)" }}>WAV</span>.<br />
                            To enhance audio quality and user experience, we recommend using the WAV file format.</p>
                        <p>Currently, the maximum allowed file size is <span style={{ color: "var(--main-color)" }}>100MB</span>. If the file you wish to upload exceeds this limit or for any inquiries, please contact us at <a href="mailto:info@lirmusic.com" style={{ color: "var(--main-color)", textDecoration: "underline" }}>info@lirmusic.com</a>.</p>
                    </div>
                </div>
            </div>
            {audioLoading ? (
                <div className={Style.DropZone_box_done}>
                    <div className="font-small" >The Audio is being loaded</div>
                    <div className={Style.DropZone_box_done_loading}>
                        <CircularProgress size={20} variant="determinate" color="inherit" value={audioLoading} />
                    </div>
                </div>
            ) : (<div>
                {urlPinata ? (
                    <div className={Style.DropZone_box_done} {...getRootAudioProps()}>
                        <input {...getInputAudioProps()} id="audio" />
                        <div className="font-small">File Audio Dropped</div>
                        <AiOutlineCheck size={20} />
                    </div>
                ) : (
                    <div className={Style.DropZone_box} {...getRootAudioProps()}>
                        <input {...getInputAudioProps()} id="audio" />
                        <div className="font-small">Drop the File Audio</div>
                        <AiOutlineUpload size={20} />
                    </div>
                )}
            </div>)}

            <div className={Style.DropZone_titleWithTutorial}>
                <label className="font-normal" htmlFor="image song">Cover Image</label>
                <div className={Style.DropZone_titleWithTutorial_icon}>
                    <CiSquareQuestion className={Style.DropZone_titleWithTutorial_icon_icon} size={22} />
                    <div className={`${Style.DropZone_titleWithTutorial_icon_appear} font-small`}>
                        <p>The maximum allowed file size is <span style={{ color: "var(--main-color)" }}>20MB</span>. If the file you wish to upload exceeds this limit or for any inquiries, please contact us at <a href="mailto:info@lirmusic.com" style={{ color: "var(--main-color)", textDecoration: "underline" }}>info@lirmusic.com</a>.</p>
                    </div>
                </div>
            </div>
            {imgLoading ? (<div className={Style.DropZone_box_done}>
                <div className="font-small">The Image is being loaded</div>
                <div className={Style.DropZone_box_done_loading}>
                    <CircularProgress size={20} variant="indeterminate" color="inherit" />
                </div>
            </div>) : (<div>
                {imageSongPinata ? (
                    <div className={Style.DropZone_box_done} {...getRootProps()}>
                        <input {...getInputProps()} id="image song" />
                        <div className="font-small">Image Dropped</div>
                        <AiOutlineCheck size={20} className={Style.DropZone_box_icon} />
                    </div>
                ) : (
                    <div className={Style.DropZone_box} {...getRootProps()}>
                        <input {...getInputProps()} id="image song" />
                        <div className="font-small">Drop the Cover Image</div>
                        <AiOutlineUpload size={20} className={Style.DropZone_box_icon} />
                    </div>
                )}
            </div>)}
        </div>
    );
};

export default DropZone;