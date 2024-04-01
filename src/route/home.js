import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Home() {

    var apiKeyShyft = "I9sYotfzF8dhJgn9";


    const [items, setItems] = useState([]);
    const [addressPhantom, setAddressPhanTom] = useState();
    const [minted, setMinted] = useState();
    const [status, setStatus] = useState("Awaiting Upload");
    const [saveMinted, setSaveMinted] = useState();
    const [wallID, setWallID] = useState("");
    const [network, setNetwork] = useState("devnet");
    const [connStatus, setConnStatus] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [dataFetched, setDataFetched] = useState();
    // useEffect(() => {
    //     // Lấy danh sách items từ localStorage khi component được render
    //     const storedItems = localStorage.getItem('objectList_test_2');
    //     if (storedItems) {
    //     // Chuyển đổi chuỗi JSON thành mảng JavaScript và set vào state
    //     setItems(JSON.parse(storedItems));
    //     console.log("List - Các sự kiện được lưu trong Localstore :");
    //     console.log(items);
    //     }
    // }, []);

    let publicKey;
    // AUTO CONNECT 
    (async () => {
        await window.phantom.solana.connect();
        publicKey = window.phantom.solana.publicKey.toBase58();  
        setAddressPhanTom(publicKey);
        
    })();
    console.log("auto connect when reload page : " + addressPhantom );

    const callback = (signature, result) => {
        console.log("Signature ", signature);
        console.log("result ", result);
        if (signature.err === null) {
            setMinted(saveMinted);
            setStatus("success: Successfully Signed and Minted.");
        }
    }

    (async () => {
        await window.phantom.solana.connect();
        publicKey = window.phantom.solana.publicKey.toBase58();
        try {
            //const network = "devnet";
            const phantom = new PhantomWalletAdapter();
            await phantom.connect();
            const rpcUrl = clusterApiUrl(network);
            const connection = new Connection(rpcUrl, "confirmed");
            const wallet = {
                address: phantom.publicKey.toString(),
            };

            if (wallet.address) {
                console.log(wallet.address);
                setWallID(wallet.address);
                const accountInfo = await connection.getAccountInfo(new PublicKey(wallet.address), "confirmed");
                console.log(accountInfo);
                setConnStatus(true);
                let nftUrl = `https://api.shyft.to/sol/v1/nft/read_all?network=${network}&address=${wallID}`;
                axios({
                    // Endpoint to send files
                    url: nftUrl,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": apiKeyShyft,
                    },
                    // Attaching the form data
                })
                    // Handle the response from backend here
                    .then((res) => {
                        console.log(res.data);
                        setDataFetched(res.data);
                        setLoaded(true);
                    })

                    // Catch errors if any
                    .catch((err) => {
                        console.warn(err);
                    });
            }
        }
        catch (err) {
            console.log(err);


        }
        console.log(publicKey);

        return true;
    })();
    


    return(
       <div>
            <header >
                <div class="header-area " style={{marginTop: '20px'}}>
                    <div id="sticky-header" class="main-header-area ">
                        <div class="container-fluid p-0">
                            <div class="row align-items-center justify-content-between no-gutters">
                                <div class="col-xl-2 col-lg-2">
                                    <div class="logo-img">
                                        <a href="index.html">
                                            <img src="img/logo.png" alt=""/>
                                        </a>
                                    </div>
                                </div>
                                <div class="col-xl-6 col-lg-6">
                                </div>
                                <div class="col-xl-4 col-lg-4 d-none d-lg-block">
                                    <div class="buy_ticket">
                                        <a href="/" class="boxed-btn-white">Logout</a>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="mobile_menu d-block d-lg-none"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div class="slider_area slider_bg_1">
                <div class="slider_text">
                    <div class="container">
                        <div class="position_relv">
                            <div class="row">
                                <div class="col-xl-8">
                                    <div class="title_text title_text2 ">
                                        <h3>Event</h3>
                                        <a href="/create" class="boxed-btn-white">Create Event New</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="countDOwn_area">
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-xl-6 col-md-6 col-lg-6">
                                <div class="single_date">
                                    <i class="ti-location-pin"></i>
                                    <span>Where you can find investment capital</span>
                                </div>
                            </div>
                            <div class="col-xl-6 col-md-6 col-lg-6">
                                <div class="single_date">
                                    <i class="ti-alarm-clock"></i>
                                    <span>Create now</span>
                                </div>
                            </div>
                            

                        </div>
                    </div>
                </div>
            </div>


            <section class="blog_area section-padding">
                <div class="container">
                    <div class="row d-flex justify-content-between">
                        {isLoaded &&
                        dataFetched.result.map((item) => (
                            <div class="col-lg-6 mb-5 mb-lg-0">
                                <div class="blog_left_sidebar">
                                        <article class="blog_item" key={item.mint}>
                                                <div class="blog_item_img">
                                                    <img class="card-img rounded-0" src={item.image_uri} alt="" width={540}  height={270}/>
                                                    <a href="/" class="blog_item_date">
                                                        <h3>{item.eventStartDate} </h3>
                                                        {/* <p>Mar</p> */}
                                                    </a>
                                                </div>

                                                <div class="blog_details">
                                                    <a class="d-inline-block" href="single-blog.html">
                                                        <h2>{item.name}</h2>
                                                    </a>
                                                    <p>{item.description}</p>
                                                    {/* <ul class="blog-info-link">
                                                        <li><a href="/"><i class="fa fa-user"></i>{item.eventActivities}</a></li>
                                                    </ul> */}
                                                </div>
                                            </article>
                                        </div>
                                    </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer class="footer footer_bg_1">
                <div class="circle_ball d-none d-lg-block">
                    <img src="img/banner/footer_ball.png" alt=""/>
                </div>
                    <div class="footer_top">
                        <div class="container">
                            <div class="row">
                                <div class="col-xl-4 col-md-4 col-lg-4">
                                    <div class="footer_widget">
                                        <h3 class="footer_title">
                                                Follow Us
                                        </h3>
                                        <ul>
                                            <li><a target="_blank" href="/">Facebook</a></li>
                                            <li><a target="_blank" href="/">Twitter</a></li>
                                            <li><a target="_blank" href="/">Instagram</a></li>
                                            <li><a target="_blank" href="/">Youtube</a></li>
                                        </ul>
            
                                    </div>
                                </div>
                                <div class="col-xl-4 col-md-4 col-lg-4">
                                    <div class="footer_widget">
                                        <h3 class="footer_title">
                                                Links
                                        </h3>
                                        <ul>
                                            <li><a target="_blank" href="schedule.html">Schedule</a></li>
                                            <li><a target="_blank" href="speakers.html">Speakers</a></li>
                                            <li><a target="_blank" href="contact.html">Contact</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-md-4 col-lg-4">
                                    <div class="footer_widget">
                                        <h3 class="footer_title">
                                                Venue
                                        </h3>
                                        <p>
                                            200, D-block, Green lane USA <br/>
                                            edumark@contact.com <br/>
                                            +10 367 467 8934
                                            
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="copy-right_text">
                        <div class="container">
                            <div class="footer_border"></div>
                            <div class="row">
                                <div class="col-xl-12">
                                    <p class="copy_right text-center">
                                       
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
       </div>
    );
} 

export default Home