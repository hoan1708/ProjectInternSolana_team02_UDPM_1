import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './route/home';
// import CreateEvent from './route/CreateEvent';
// import TestCreate from './route/TestCreate';
// import TestCreate_2 from './route/TestCreate_2';
import Test_3 from './route/Test_3';
import CreateEvent from './route/CreateEvent';
import TestCreate from './route/TestCreate';

function App() {
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');
  // const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = () => {

    // console.log("Xóa object test trong localstore");
    // localStorage.removeItem("objectList_test_2");
    const myHeaders = new Headers();
    myHeaders.append("x-api-key", "I9sYotfzF8dhJgn9");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "password": password
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://api.shyft.to/sol/v1/wallet/create_semi_wallet/", requestOptions)
      .then(response => response.text())
      .then(ketQua => {
        // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
        const data = JSON.parse(ketQua);
        // Truy cập vào wallet_address
        const walletAddress = data.result.wallet_address;
        // console.log("Ket qua:" + ketQua);

        // console.log("kết quả sau submit :" + ketQua);
        // Lấy wallet_address từ result
        // const walletAddress = ketQua.result.wallet_address;
        console.log("Gia tri cua biến walletAddress: " + walletAddress);
        console.log("Password current :" + password);

        // Lưu wallet_address vào Local Storage
        localStorage.setItem('walletAddressOfUser', walletAddress);
        // sau khi tạo được ví semi => cần lưu password và địa chỉ ví => tạo được NFT
        localStorage.setItem('passwordCurrentOfUser', password);

        // Lấy dữ liệu từ localStorage
        // const walletAddressOfUser = localStorage.getItem('walletAddressOfUser');

        // // Kiểm tra nếu dữ liệu tồn tại trong localStorage
        // if (walletAddressOfUser) {
        //     // In ra dữ liệu đã lưu trong localStorage
        // console.log("Adderess Wallet store in LocalStore: " + walletAddress);
        // } else {
        //     // Nếu không tìm thấy dữ liệu trong localStorage
        //     console.log('No wallet address found in localStorage');
        // }


        


        // Lưu kết quả response vào state 
        setResponse(ketQua);
        
        // Sau khi nhận được kết quả từ server, chuyển hướng tới trang chủ
        // setRedirect(true);
      })
      .catch(error => console.log('error', error));
  };

  return (
    <div>
      {/* Bao gồm Routes và Redirect bên trong Router */}
      <Router>
        <Routes>
          {/* Route cho phần nhập password */}
          <Route path="/" element={
            <div>
                  <header >
                        <div class="header-area " style={{ marginTop: '20px' }}>
                            <div id="sticky-header" class="main-header-area ">
                                <div class="container-fluid p-0">
                                    <div class="row align-items-center justify-content-between no-gutters">
                                        <div class="col-xl-2 col-lg-2">
                                            <div class="logo-img">
                                                <a href="index.html">
                                                    <img src="../img/logo.png" alt=""/>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="col-xl-6 col-lg-6">
                                            
                                        </div>
                                        <div class="col-xl-4 col-lg-4 d-none d-lg-block">
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
                                        <div class="col-xl-12">
                                            <div class="title_text title_text2 ">
                                                <h3>Sign in here</h3>
                                                <div class="col-lg-8">
                                                    <input type="password"  class="boxed-btn-white" placeholder='Enter your password'
                                                                            onfocus="this.placeholder = ''"
                                                                            onblur="this.placeholder = 'Enter your password'" style={{width: '500px'}}
                                                                            value={password}
                                                                            onChange={handlePasswordChange}
                                                                            />
                                                    
                                                    <button className="boxed-btn-white" onClick={handleSubmit}>Login</button>
                                                    {response && <div><a href='/home' className='boxed-btn-white' style={{marginTop: '20px', marginLeft: '150px'}}>Go to Home</a></div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="countDOwn_area">
                            <div class="container">
                                <div class="row align-items-center">
                                    <div class="col-xl-8 col-md-6 col-lg-6">
                                        <div class="single_date">
                                            <i class="ti-location-pin"></i>
                                            <span>You can find investment capital in our application</span>
                                        </div>
                                    </div>
                                    <div class="col-xl-4 col-md-6 col-lg-6">
                                        <div class="single_date">
                                            <i class="ti-alarm-clock"></i>
                                            <span>Join now</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
            </div>
          } />

          {/* Route cho phần nội dung trang Home */}
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<CreateEvent />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;