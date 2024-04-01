var myHeaders = new Headers();
myHeaders.append("x-api-key", "I9sYotfzF8dhJgn9");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "network": "devnet",
  "from_address": "CwjzdbuVDHRKmwRSrRmeUfgeuxZe6aAhT3VfH7dWjcPX",
  "to_address": "63GCHLqAFewHQY2U1eMQTuEXP5NWCZ6SNz1r9CpXyFQy",
  "amount": 1
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.shyft.to/sol/v1/wallet/send_sol", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));