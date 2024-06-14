import React, { useContext } from 'react';
import Link from "next/link";


//INRTERNAL IMPORTS
import Style from "./SideBar.module.css";
import img from "./../../../img/index";
import { ButtonConnectWallet } from "../../componentsIndex"

const SideBar = ({ setOpenSideBar, user }) => {

    return (
        <div className={Style.sidebar}>
            <div className={`${Style.sidebar_center} font-medium`}>
                <Link href={"https://lirmusic.notion.site/Lir-Music-info-694b4a6252224f9fba741bc2397f6212?pvs=4"} onClick={() => setOpenSideBar(false)}>
                    <div className={Style.sidebar_center_element}>info</div>
                </Link>
            </div>
        </div>
    )
}

export default SideBar;