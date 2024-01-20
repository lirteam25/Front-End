import React, { useState, useContext } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import { CiSquareQuestion } from "react-icons/ci";

import Style from "./CreateSmartContract.module.css";
import { NFTMarketplaceContext } from '../../../Context/NFTMarketplaceContext';
import { ActionButton, InfoButton } from '../../../components/componentsIndex';

const CreateSmartContract = ({ closeCreateSmartContract }) => {

    const { user, connectWallet, currentAccount, createNFTMintSmartContract } = useContext(NFTMarketplaceContext);

    const [nameOfToken, setNameOfToken] = useState();
    const [symbolOfToken, setSymbolOfToken] = useState();

    const mintSmartContract = async () => {
        closeCreateSmartContract();
        await createNFTMintSmartContract(nameOfToken, symbolOfToken, user.accessToken);
    };

    return (
        <div className={Style.CreateSmartContract}>
            <div className={`${Style.CreateSmartContract_top} font-normal`}>
                <div className={Style.CreateSmartContract_top_title}>
                    create your smart contract
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
                                    <span style={{ color: "var(--main-color)" }}>CAREFUL!</span>...technical explanation...an artist might find this very boring!
                                </p>
                                <p>
                                    To digitize music collecting, token are employed and their transactions are recorded on the blockchain to identify those who can access the audio file.
                                    Tokens on the blockchain are given names and symbols. You can choose your token's name. It is suggested to use your artist name plus "token".
                                </p>
                                <p>E.g. your artist name is "Pink Floyd"; your token name could be "Pink Floyd Token".</p>
                            </div>
                        </div>
                    </div>
                    <input
                        className={Style.user_box_input_input}
                        style={{ margin: "0.5rem 0rem" }}
                        id="token name"
                        placeholder={"Your token name once saved cannot be changed"}
                        onChange={(e) => setNameOfToken(e.target.value)}
                    />
                </div>

                <div className={Style.CreateSmartContract_bottom_95}>
                    <div className={Style.CreateSmartContract_bottom_95_titleWithTutorial}>
                        <label className='font-normal' htmlFor='token symbol'>Token symbol</label>
                        <div className={Style.CreateSmartContract_bottom_95_titleWithTutorial_icon}>
                            <CiSquareQuestion className={Style.CreateSmartContract_bottom_95_titleWithTutorial_icon_icon} size={22} />
                            <div className={`${Style.CreateSmartContract_bottom_95_titleWithTutorial_icon_appear} font-small`}>
                                <p>The symbol is just an abbrevation of the token name.</p>
                                <p>E.g. your artist name is "Red Hot Chili Peppers"; your token name could be "Red Hot Chili Peppers Token"; your symbol could be "RHCP"</p>
                            </div>
                        </div>
                    </div>
                    <input
                        className={Style.user_box_input_input}
                        style={{ margin: "0.5rem 0rem" }}
                        id="token symbol"
                        placeholder={"Your token name once saved cannot be changed"}
                        onChange={(e) => setSymbolOfToken(e.target.value)}
                    />
                </div>
                <div className={Style.CreateSmartContract_bottom_95}>
                    {currentAccount ? <div>
                        {nameOfToken && symbolOfToken ?
                            <ActionButton action={mintSmartContract} text="CREATE SMART CONTRACT" fontSize="0.9rem" /> :
                            <InfoButton text="CREATE SMART CONTRACT" fontSize="0.9rem" />
                        }</div> : <ActionButton action={connectWallet} text="CONNECT WALLET" fontSize="0.9rem" />}

                </div>
            </div>
        </div>
    )
}

export default CreateSmartContract