import React, { useState, useContext } from 'react';
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext';

import Style from "./../styles/decrypt.module.css";
import { ActionButton } from '../components/componentsIndex';

const DecryptFilePage = () => {

    const { decryptFile } = useContext(NFTMarketplaceContext)

    const [cid, setCid] = useState('');

    const handleDecrypt = async () => {
        try {
            if (!cid) {
                alert('Please enter a CID.');
                return;
            }
            console.log("Decrpyting...")
            await decryptFile(cid);
        } catch (error) {
            alert("Trouble decrypting file")
            console.log(error)
        }
    }

    return (
        <div className={Style.vh_decrypt}>
            <div className={Style.decrypt}>
                <h1 className='font-huge'>Decrypt File</h1>
                <input
                    type="text"
                    value={cid}
                    onChange={(e) => setCid(e.target.value)}
                    placeholder="Enter CID"
                />
                <ActionButton text="decrypt" onClick={handleDecrypt} />
            </div>
        </div>
    );
}

export default DecryptFilePage;