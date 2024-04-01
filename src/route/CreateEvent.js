import React, { useState } from 'react';
import axios from "axios";
import { signAndConfirmTransactionFe } from '../utilityfunc';



function CreateEvent() {
    const [addressPhantom, setAddressPhanTom] = useState();
    const [minted, setMinted] = useState();
    const [status, setStatus] = useState("Awaiting Upload");
    const [saveMinted, setSaveMinted] = useState();
    const [dispResponse, setDispResp] = useState("");

    const [eventName, setEventName] = useState();
    const [eventDescription, setEventDescription] = useState();   
    const [eventActivities, setEventActivities] = useState();
    const [eventStartDate, setEventStartDate] = useState();
    const [eventEndDate, setEventEndDate] = useState();
    const [eventLocation, setEventLocation] = useState();
    const [eventImage, setEventImage] = useState(); // State để lưu trữ file ảnh 

    let publicKey;
    // AUTO CONNECT 
    (async () => {
        await window.phantom.solana.connect();
        publicKey = window.phantom.solana.publicKey.toBase58();  
        setAddressPhanTom(publicKey);
    })();
    console.log("auto connect when reload page : " + addressPhantom );
    
    // MANUAL CONNECT => xảy ra khi bấn button 
    // const connectWallet = async()=> {
    //     await window.phantom.solana.connect();
    //     publicKey = window.phantom.solana.publicKey.toBase58();  
    //     // setAddressPhanTom(publicKey);  
    //     console.log("Lấy address khi bấn nút : " + addressPhantom );
    // }

    var apiKeyShyft = "I9sYotfzF8dhJgn9";

    // solanaWeb3.Transaction.from 
    // const toTransaction = (encodedTransaction) => solanaWeb3.Transaction.from(Uint8Array.from(atob(encodedTransaction),c => c.charCodeAt(0))) ;


    // let attrib = [{ "trait_type": "speed", "value": 100 },
    // { "trait_type": "aggression", "value": "crazy" },
    // { "trait_type": "energy", "value": "very high" }];



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
            // setEventImage(e.target.files)

            // const [eventName, setEventName] = useState();
            // const [eventDescription, setEventDescription] = useState();
            // const [eventActivities, setEventActivities] = useState();
            // const [eventStartDate, setEventStartDate] = useState();
            // const [eventEndDate, setEventEndDate] = useState();
            // const [eventLocation, setEventLocation] = useState();
            // const [eventImage, setEventImage] = useState(); // State để lưu trữ file ảnh 

            // // wallet : là địa chỉ ví sẽ trả phí cho cái giao dịch này 
            formdata.append("wallet", addressPhantom);
            formdata.append("name", eventName);

            
            formdata.append("eventActivities", eventActivities);
            formdata.append("eventStartDate", eventStartDate);
            formdata.append("eventEndDate", eventEndDate);
            formdata.append("eventLocation", eventLocation);

            formdata.append("symbol", "Pro");
            formdata.append("description", eventDescription);
            formdata.append("attributes", '[{"trait_type":"dev power","value":"over 1"}]');
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
                "x-api-key": "I9sYotfzF8dhJgn9",
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


                    // lưu các NFT của bất kỳ người dùng nào tạo vào Localstore 
                    // Bước 1: Lấy danh sách đối tượng hiện có từ localStorage (nếu có)
                    // let objectList = JSON.parse(localStorage.getItem("objectList_test_2")) || [];

                    // // Bước 2: Thêm đối tượng mới vào danh sách
                    // const newObject = { 
                    //     netword: "devnet",
                    //     wallet: addressPhantom,
                    //     name: eventName,
                    //     eventActivities: eventActivities,
                    //     eventStartDate : eventStartDate ,
                    //     eventEndDate : eventEndDate,
                    //     eventLocation : eventLocation,
                    //     symbol: "Pro",
                    //     description: eventDescription,
                    //     attributes : '[{"trait_type":"dev power","value":"over 1"}]',
                    //     external_url : "https://shyft.to",
                    //     max_supply : "0" ,
                    //     royalty : "5",
                    //     file : fileInput.files[0],
                    //     nft_receiver : "5KW2twHzRsAaiLeEx4zYNV35CV2hRrZGw7NYbwMfL4a2"
                    // };
                    // objectList.push(newObject);

                    // // Bước 3: Lưu lại danh sách mới vào localStorage
                    // localStorage.setItem("objectList_test_2", JSON.stringify(objectList));

                    // // In ra danh sách mới
                    // console.log("Lấy ra danh sách NFT được lưu vào localstore : ");
                    // console.log(objectList);

                }
            })

            // Catch errors if any
            .catch((err) => {
                console.warn(err);
                setStatus("success: false");
            });

    }

    
    return(
       <div>
            <div class="container">
                <div class="row justify-content-center " style={{marginTop: '20px'}}>
                    <div class="col-lg-8">
                        <form action="" class="row form-control d-flex " onSubmit={mintNFT}> 
                            <div class="col-lg-12">
                                <h2 class="text-center">Tạo sự kiện</h2>
                            </div>
                         
                            <div class="col-lg-12">
                                <span>Tên sự kiện</span> <br/>
                                <input type="text" value={eventName} class="col-lg-12 form-control" onChange={(e) => { setEventName(e.target.value) }}  />
                            </div>
                            <div class="col-lg-12 mt-3">
                                <span>Loại sự kiện</span> <br/>   
                                <input type="text" value={eventActivities}  class="col-lg-12 form-control" onChange={(e) => { setEventActivities(e.target.value) }} />
                            </div>
                            <div class="col-lg-12 mt-3" >
                                <span>Hoạt động chương trình</span> <br/>
                                <textarea rows="4" cols="50" value={eventDescription} class="form-control" onChange={(e) => { setEventDescription(e.target.value) }} ></textarea>
                            </div> 
                            <div class="col-lg-6 mt-3">
                                <span>Thời gian bắt đầu</span> <br/>
                                <input type="date" value={eventStartDate}  class="form-control" onChange={(e) => { setEventStartDate(e.target.value) }} />
                            </div>
                            <div class="col-lg-6 mt-3">
                                <span>Thời gian kết thúc</span> <br/>
                                <input type="date" value={eventEndDate} class="form-control"  onChange={(e) => { setEventEndDate(e.target.value) }}/>
                            </div>
                            <div class="col-lg-6 mt-3">
                                <span>Địa điểm</span> <br/>
                                <input type="text" value={eventLocation}  class="form-control" onChange={(e) => { setEventLocation(e.target.value) }} />
                            </div>
                            <div class="col-lg-6 mt-3">
                                <span>Hình ảnh sự kiện</span> <br/>
                                <input type="file"  class="form-control" id="myFileUpload" onChange={(e) => { setEventImage(e.target.value) }}/>
                            </div>

                            <div class="col-lg-12 mt-4 mb-4" >
                                <div>
                                    <button type="submit" class="genric-btn primary-border"  >Create Event</button>
                                    <a href="/home" class="genric-btn info-border" style={{ marginLeft: '20px' }}>Go home</a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
       </div>
    );
} 

export default CreateEvent