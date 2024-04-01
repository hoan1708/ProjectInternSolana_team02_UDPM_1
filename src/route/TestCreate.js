import React, { useState } from 'react';

function TestCreate() {
    const [publicKey, setPublicKey] = useState(null);
    const [privateKey, setPrivateKey] = useState(null);

    const getPublicKet = async()=>{
        // lấy ra password và địa chỉ ví truyền vào 1 biến => có thể tạo 1 biến toàn cục 
        // lấy ra password current 
        const passwordCurrent = localStorage.getItem('passwordCurrentOfUser');
        const walletAddressOfUser = localStorage.getItem('walletAddressOfUser');

        // Kiểm tra xem dữ liệu có tồn tại không trước khi sử dụng
        if (passwordCurrent) {
            // Thực hiện các thao tác cần thiết với dữ liệu
            console.log('Password current:', passwordCurrent);
        } else {
            console.log('Không tìm thấy passwordCurrent trong localStorage');
        }

        // Kiểm tra xem dữ liệu có tồn tại không trước khi sử dụng
        if (walletAddressOfUser) {
            // Thực hiện các thao tác cần thiết với dữ liệu
            console.log('Address wallet:', walletAddressOfUser);
        } else {
            console.log('Không tìm thấy địa chỉ ví trong localStorage');
        }
        
        var myHeaders = new Headers();
        myHeaders.append("x-api-key", "I9sYotfzF8dhJgn9");

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };


        fetch("https://api.shyft.to/sol/v1/semi_wallet/get_keypair?wallet="+walletAddressOfUser+"&password="+passwordCurrent, requestOptions)
        .then(response => response.text())
        .then(result => {
            const data = JSON.parse(result);
            // Truy cập vào wallet_address
            const publicKey = data.result.publicKey;
            const privateKey = data.result.secretKey;
            console.log(result);


            setPublicKey(publicKey);
            setPrivateKey(privateKey);
        })
        .catch(error => console.log('error', error));
            }
    

    const mintNFT = async() =>{

        // chạy hàm để lấy publicKey cho biến toàn cục 
        await getPublicKet();
        
        console.log("Public key lấy được : " + publicKey);
        console.log("Private key lấy được : " + privateKey);

        var myHeaders = new Headers();
        myHeaders.append("x-api-key", "I9sYotfzF8dhJgn9");


        // lấy ra hình ảnh truyền vào 
        const fileInput = document.querySelector("#fileUpload");

        // console ra xem lấy được đường dẫn file thành công chưa 
        // console.log(fileInput.files[0]);

        var formdata = new FormData();
        formdata.append("network", "devnet");
        formdata.append("wallet", publicKey);
        formdata.append("name", "SHYFT NFT");
        formdata.append("symbol", "SH");
        formdata.append("description", "Shyft makes Web3 so easy!");
        formdata.append("attributes", '[{"trait_type":"dev power","value":"over 900"}]');
        formdata.append("external_url", "https://shyft.to");
        formdata.append("max_supply", "0");
        formdata.append("royalty", "5");
        formdata.append("file", fileInput.files[0], "index.png");
        formdata.append("nft_receiver", "5KW2twHzRsAaiLeEx4zYNV35CV2hRrZGw7NYbwMfL4a2");
        formdata.append('service_charge', '{ "receiver": "499qpPLdqgvVeGvvNjsWi27QHpC8GPkPfuL5Cn2DtZJe",  "token": "DjMA5cCK95X333t7SgkpsG5vC9wMk7u9JV4w8qipvFE8",  "amount": 0.01}');

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
        };

        fetch("https://api.shyft.to/sol/v1/nft/create_detach", requestOptions)
        .then(response => response.text())
        .then(result => {
            // console.log("Create NFT thành công");
            console.log(result);
        })
        .catch(error => console.log('error', error));
    }

    return(
       <div>
            <input type='file' id='fileUpload'/>
            <button onClick={mintNFT}>Create My NFT</button>
       </div>
    );
} 

export default TestCreate;