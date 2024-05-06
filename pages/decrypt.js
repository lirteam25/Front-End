import React, { useState, useContext } from 'react';
import * as LitJsSdk from "@lit-protocol/lit-node-client"
import { NFTMarketplaceContext } from '../Context/NFTMarketplaceContext';

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
        <div>
            <h1>Decrypt File</h1>
            <input
                type="text"
                value={cid}
                onChange={(e) => setCid(e.target.value)}
                placeholder="Enter CID"
            />
            <button onClick={handleDecrypt}>Decrypt</button>
        </div>
    );
}

export default DecryptFilePage;