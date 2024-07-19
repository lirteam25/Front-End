import React, { useState, useContext } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import { CiSquareQuestion } from "react-icons/ci";
import { useActiveWalletChain } from "thirdweb/react";

import Style from "./CreateSmartContract.module.css";
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';
import { ActionButton, InfoButton, ButtonConnectWallet } from '../../../components/componentsIndex';

const CreateSmartContract = ({ closeCreateSmartContract }) => {

    const chainId = useActiveWalletChain()?.id;
    const targetChainId = process.env.ACTIVE_CHAIN == "polygon" ? 137 : 80002

    const { user, address, createEditionDrop } = useContext(NFTMarketplaceContext);

    const [nameOfToken, setNameOfToken] = useState();
    const [symbolOfToken, setSymbolOfToken] = useState();
    const royalties = 5;

    const mintSmartContract = async (editionDrop) => {
        closeCreateSmartContract();
        await createEditionDrop(nameOfToken, symbolOfToken, royalties, user);
    };

    return (
        <div className={Style.CreateSmartContract}>
            <div className={`${Style.CreateSmartContract_top} font-normal`}>
                <div className={Style.CreateSmartContract_bottom_95_titleWithTutorial}>
                    <label className='font-normal' htmlFor='token name'> CREATE YOUR SMART CONTRACT</label>
                    <div className={Style.CreateSmartContract_bottom_95_titleWithTutorial_icon}>
                        <CiSquareQuestion className={Style.CreateSmartContract_bottom_95_titleWithTutorial_icon_icon} size={22} />
                        <div className={`${Style.CreateSmartContract_bottom_95_titleWithTutorial_icon_appear} font-small`}>
                            <p>
                                What is and why do I need a smart contract?
                            </p>
                            <p>
                                You are creating your first <span style={{ color: "var(--main-color)" }}>smart contract</span>. Smart contracts are digital agreements formed on the blockchain
                                that autonomously execute when predefined conditions are fulfilled.<br />
                                In this context, we will be generating a customized contract tailored to your needs.
                                This contract serves as the foundation for creating tokens, representing access to your tracks.
                                Through it, you gain the capability to distribute your music, monitor individuals who are accessing your exclusive content and give them the possibility to exchange it.
                            </p>
                        </div>
                    </div>
                </div>
                <AiOutlineClose className={Style.CreateSmartContract_top_x} onClick={closeCreateSmartContract} />
            </div>
            <div className={Style.CreateSmartContract_bottom}>
                <div className={Style.CreateSmartContract_bottom_95}>
                    <div className={Style.CreateSmartContract_bottom_95_titleWithTutorial}>
                        <label className='font-normal' htmlFor='token name'> Name your tokens</label>
                        <div className={Style.CreateSmartContract_bottom_95_titleWithTutorial_icon}>
                            <CiSquareQuestion className={Style.CreateSmartContract_bottom_95_titleWithTutorial_icon_icon} size={22} />
                            <div className={`${Style.CreateSmartContract_bottom_95_titleWithTutorial_icon_appear} font-small`}>
                                <p>
                                    To digitize music collecting, tokens are employed and their transactions are recorded on the blockchain to identify those who can access the audio file.
                                    Tokens on the blockchain are given names and symbols. <br />
                                    You can choose your token's name. Once selected, it will be shared in all your collections. It is suggested to use your artist name plus "token".
                                </p>
                                <p><span style={{ color: "var(--main-color)" }}>E.g.</span> Artist name: "Red Hot Chili Peppers" ={'>'} <span style={{ color: "var(--main-color)" }}>Token name</span>: "Red Hot Chili Peppers Token".</p>
                            </div>
                        </div>
                    </div>
                    <input
                        className={Style.user_box_input_input}
                        style={{ margin: "0.5rem 0rem" }}
                        id="token name"
                        placeholder={"Once saved your token name cannot be changed"}
                        onChange={(e) => setNameOfToken(e.target.value)}
                    />
                </div>

                <div className={Style.CreateSmartContract_bottom_95}>
                    <div className={Style.CreateSmartContract_bottom_95_titleWithTutorial}>
                        <label className='font-normal' htmlFor='token symbol'>Token symbol</label>
                        <div className={Style.CreateSmartContract_bottom_95_titleWithTutorial_icon}>
                            <CiSquareQuestion className={Style.CreateSmartContract_bottom_95_titleWithTutorial_icon_icon} size={22} />
                            <div className={`${Style.CreateSmartContract_bottom_95_titleWithTutorial_icon_appear} font-small`}>
                                <p>The symbol is an abbrevation of the token name. Once selected, it will be shared in all your collections.</p>
                                <p><span style={{ color: "var(--main-color)" }}>E.g.</span> Token name: "Red Hot Chili Peppers Token" ={'>'} <span style={{ color: "var(--main-color)" }}>Symbol</span>: "RHCP"</p>
                            </div>
                        </div>
                    </div>
                    <input
                        className={Style.user_box_input_input}
                        style={{ margin: "0.5rem 0rem" }}
                        id="token symbol"
                        placeholder={"Once saved your token symbol cannot be changed"}
                        onChange={(e) => setSymbolOfToken(e.target.value)}
                    />
                </div>
                <div className={Style.CreateSmartContract_bottom_95}>
                    <div className={Style.CreateSmartContract_bottom_95_titleWithTutorial}>
                        <label className='font-normal' htmlFor='token name'> Royalties: <span style={{ color: "var(--background-grey3)" }} className="font-small">5%</span></label>
                        <div className={Style.CreateSmartContract_bottom_95_titleWithTutorial_icon}>
                            <CiSquareQuestion className={Style.CreateSmartContract_bottom_95_titleWithTutorial_icon_icon} size={22} />
                            <div className={`${Style.CreateSmartContract_bottom_95_titleWithTutorial_icon_appear} font-small`}>
                                <p>
                                    Royalties are a percentage of the resale value that goes to the original creator, providing ongoing compensation for their digital artworks.
                                    This ensures artists receive a share of the profits each time their tracks are resold between different users.<br />
                                    <br />This percentage is setted at <span style={{ color: "var(--main-color)" }}>5%</span> by default
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={Style.CreateSmartContract_bottom_95}>
                    <div className={Style.CreateSmartContract_bottom_95_titleWithTutorial}>
                        <div className='font-normal'> First sale fee: <span style={{ color: "var(--background-grey3)" }} className="font-small">{user.artist_first_sale_fee}%</span></div>
                        <div className={Style.CreateSmartContract_bottom_95_titleWithTutorial_icon}>
                            <CiSquareQuestion className={Style.CreateSmartContract_bottom_95_titleWithTutorial_icon_icon} size={22} />
                            <div className={`${Style.CreateSmartContract_bottom_95_titleWithTutorial_icon_appear} font-small`}>
                                <p>
                                    Platform's share when a user purchase your track. Cannot be manually modified. <br />
                                    If it does not align with the agreed-upon terms or for any inquiries, please contact us at <a href="mailto:info@lirmusic.com" style={{ color: "var(--main-color)", textDecoration: "underline" }}>info@lirmusic.com</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${Style.CreateSmartContract_bottom_95} ${Style.bottom}`}>
                    {address && chainId == targetChainId ? (<>{nameOfToken && symbolOfToken && royalties ?
                        <ActionButton text="Deploy contract" action={mintSmartContract} />
                        :
                        <InfoButton text="INSERT ALL DATA TO CREATE SMART CONTRACT" fontSize="0.9rem" />
                    }</>) : (<ButtonConnectWallet user={user} />)}
                </div>
            </div>
        </div>
    )
}

export default CreateSmartContract