import { useState } from "react";
import axios from "axios";
import { signAndConfirmTransactionFe } from '../utilityfunc';


function Test_3(){

    const [addressPhantom, setAddressPhanTom] = useState();
    const [minted, setMinted] = useState();
    const [status, setStatus] = useState("Awaiting Upload");
    const [saveMinted, setSaveMinted] = useState();
    const [dispResponse, setDispResp] = useState("");

    let publicKey;
    // AUTO CONNECT 
    (async () => {
        await window.phantom.solana.connect();
        publicKey = window.phantom.solana.publicKey.toBase58();  
        setAddressPhanTom(publicKey);
    })();
    console.log("auto connect when reload page : " + addressPhantom );
    
    // MANUAL CONNECT => xảy ra khi bấn button 
    const connectWallet = async()=> {
        await window.phantom.solana.connect();
        publicKey = window.phantom.solana.publicKey.toBase58();  
        // setAddressPhanTom(publicKey);  
        console.log("Lấy address khi bấn nút : " + addressPhantom );
    }

    var apiKeyShyft = "I9sYotfzF8dhJgn9";

    // solanaWeb3.Transaction.from 
    // const toTransaction = (encodedTransaction) => solanaWeb3.Transaction.from(Uint8Array.from(atob(encodedTransaction),c => c.charCodeAt(0))) ;


    let attrib = [{ "trait_type": "speed", "value": 100 },
    { "trait_type": "aggression", "value": "crazy" },
    { "trait_type": "energy", "value": "very high" }];



    //Here we have created 3 attributes for our NFT, namely:
    //1. speed = 100
    //2. aggression = "crazy"
    //3. energy = "very high"
    const callback = (signature, result) => {
        console.log("Signature ", signature);
        console.log("result ", result);
        if (signature.err === null) {
            setMinted(saveMinted);
            setStatus("success: Successfully Signed and Minted.");
        }
    }


    // mint NFT 
    const mintNFT = async (e) => {
        e.preventDefault();
        setStatus("Loading");

        var myHeaders = new Headers();
            myHeaders.append("x-api-key", apiKeyShyft);

            var formdata = new FormData();
            formdata.append("network", "devnet");

            var fileInput = document.querySelector("#myFileUpload");
            console.log(fileInput.files[0]);

            // // wallet : là địa chỉ ví sẽ trả phí cho cái giao dịch này 
            formdata.append("wallet", addressPhantom);
            formdata.append("name", "Hoan NFT");
            formdata.append("symbol", "Bro");
            formdata.append("description", "Shyft makes Web3 so easy!");
            formdata.append("attributes", '[{"trait_type":"dev power","value":"over 900"}]');
            formdata.append("external_url", "https://shyft.to");
            formdata.append("max_supply", "0");  // có bao nhiêu cái NFT được mint từ NFT này 
            formdata.append("royalty", "5");  // nhận 5% phí giao dịch khi dùng NFT
            formdata.append("file", fileInput.files[0], "index.png");
            formdata.append("nft_receiver", "5KW2twHzRsAaiLeEx4zYNV35CV2hRrZGw7NYbwMfL4a2");

           axios({
            // Endpoint to send files
            url: "https://api.shyft.to/sol/v1/nft/create_detach",
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                "x-api-key": "0Y3eR8m-wYwyoZYS",
                Accept: "*/*",
                "Access-Control-Allow-Origin": "*",
            },

            // Attaching the form data
            data: formdata,
        })
            // Handle the response from backend here
            .then(async (res) => {
                console.log(res);
                if (res.data.success === true) {
                    setStatus("success: Transaction Created. Signing Transactions. Please Wait.");
                    const transaction = res.data.result.encoded_transaction; //encoded transaction
                    setSaveMinted(res.data.result.mint);
                    const ret_result = await signAndConfirmTransactionFe("devnet", transaction, callback); //signing the encoded transaction
                    console.log(ret_result);
                    setDispResp(res.data);

                }
            })

            // Catch errors if any
            .catch((err) => {
                console.warn(err);
                setStatus("success: false");
            });

    }
    

    return (
        <div>
            <p>Address of phantom: {addressPhantom} </p>
            <button onClick={connectWallet} >Connect phantom</button>
            <button onClick={mintNFT}>Mint NFT</button>
            <input type="file" id="myFileUpload" />
        </div>
    );
}

export default Test_3;