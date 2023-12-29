## Introduction

Welcome to Ocelot Pay: Revolutionizing E-commerce Payments with Web 3 and Cryptocurrency Integration

Discover the future of seamless e-commerce transactions with Ocelot Pay—a cutting-edge solution at the forefront of Web 3. Empowering online businesses, Ocelot Pay offers a robust platform that simplifies and accelerates cryptocurrency payments for e-commerce ventures worldwide.

Our innovative platform seamlessly integrates Web 3 technologies, enabling secure and swift crypto transactions, eliminating traditional barriers, and unlocking a world of possibilities for online merchants. With Ocelot Pay, businesses can embrace the decentralized future of commerce while offering customers unparalleled convenience and security.

Key Features:

-   Crypto Payment Integration: Accept a diverse range of cryptocurrencies securely, expanding your customer base globally.
-   Web 3 Compatibility: Harness the power of decentralized networks for transparent, trustless transactions.
-   Streamlined Checkout: Effortlessly implement Ocelot Pay's user-friendly interface to enhance the checkout experience and increase conversions.
-   Security and Reliability: Utilize state-of-the-art encryption and blockchain technology for enhanced security and transactional reliability.
-   Future-Ready Solutions: Stay ahead in the ever-evolving e-commerce landscape by adopting Web 3 innovations and staying adaptable to emerging trends.

Join the movement toward a decentralized economy with Ocelot Pay. Experience the convenience, security, and innovation that redefine e-commerce transactions in the digital era.

Transform your e-commerce venture today with Ocelot Pay—a leader in Web 3 and crypto payment solutions.

---

## Get started

This comprehensive guide provides a step-by-step walkthrough for new users of **Ocelot Pay**, covering everything from account setup to project integration.

### **1. Setting Up an Ocelot Pay Account**

**1.1. Account Registration**

Navigate to the Ocelot Pay console at [Ocelot Pay Signup](https://console.ocelotpay.com/auth), and select the 'Sign Up' option to begin the registration process.

**1.2. Entering Registration Details**

Fill in the required fields with your personal information to create your account.

**1.3. Email Confirmation**

After submitting the registration form, please check your email, including the spam folder, for a confirmation message from Ocelot Pay. Click on the confirmation link in the email to activate your account.

**1.4. Account Activation**

Upon clicking the confirmation link, your account will be activated, and you can begin using Ocelot Pay.

### **2. Creating a New Project**

**2.1. Accessing the Console**

Click on 'Go to Console' to enter the Ocelot Pay management console.

**2.2. Starting a New Project**

Initially, the console will show that you have no existing projects. Please select 'Create Project' to start a new project.

**2.3. Project Details**

On the project creation page, fill in the necessary information about your project, and submit the form to create your project.

-   Receiving Address (Please select the address corresponding to the Ethereum network): In general, you can obtain your Ethereum network address from the web3 wallet or exchange that you use. Here are some methods for obtaining your Ethereum address from some well-known wallets and exchanges:
    1. Coinbase wallet: [https://help.coinbase.com/en/coinbase/getting-started/crypto-education/where-is-my-crypto-address](https://help.coinbase.com/en/coinbase/getting-started/crypto-education/where-is-my-crypto-address)
    2. Metamask: [https://support.metamask.io/hc/en-us/articles/360015488791-How-to-view-your-account-details-and-public-address](https://support.metamask.io/hc/en-us/articles/360015488791-How-to-view-your-account-details-and-public-address)
    3. OKX: [https://www.okx.com/help/how-do-i-manage-my-assets-in-my-okx-wallet-app](https://www.okx.com/help/how-do-i-manage-my-assets-in-my-okx-wallet-app)
    4. Binance: [https://everybithelps.io/binance-wallet-address/](https://everybithelps.io/binance-wallet-address/)

> Please fill in the receiving address carefully, as all payments from end users will be directly transferred to the address you provide. Please ensure the accuracy of the receiving address you fill in.

-   Callback API: This is your API interface for receiving successful payment results. It must support the POST method and does not require authentication. We will use this interface to send successful payment data to your application every time a user makes a payment. You can also leave it blank if not needed, and you can retrieve the payment results on your website.

-   Secret Phrase: When using the callback API to return payment results to your application, we will use the passphrase as a salt to hash the user's payment information. This way, when your system receives the payment results, it can use the same method to hash the information we return to ensure that it indeed comes from us. You can enter any phrase and change it at any time.

**2.4. Project Confirmation**

After successful submission, the newly created project will be visible in your project list.

### **3. Configuring Payment Parameters**

**3.1. Parameter Selection**

-   Choose the specific parameters you wish to configure for your payment setup.

**3.2. Configuring Parameters**

-   Adjust and set your desired payment parameters on the configuration screen.

**3.3. Generating Payment URL**

Click 'Generate URL' to update the payment preview based on your configurations. The generated payment link will also be updated accordingly.

### **4. Integrating Ocelot Pay into Your Project**

**4.1. Copying Integration Code**

Click the 'Copy' button in the code section to copy the Ocelot Pay integration code.

**4.2. Code Integration**

Paste the copied code into your project where you want to integrate Ocelot Pay.

### **5. Quick Integration Example**

**5.1. Creating an Example Project**

Start by creating an example HTML file with the provided code structure.

```jsx
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <title>Ocelot Pay Exapmle</title>
    <style>
        body {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .control-panel {
            width: 300px;
            padding-right: 20px;
            border-right: solid 1px grey;
        }

        .pay-btn {
            background-color: rgb(86, 102, 248);
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 18px;
        }

        .payment-result {
            margin-top: 12px;
            color: rgb(4, 167, 4);
            font-size: 16px;
            word-break: break-all;
        }

        .pay-panel {
            margin-left: 20px;
            display: none;
            align-items: center;
            border: solid 1px rgb(195, 194, 194);
        }
    </style>

</head>

<body>
    <script>
        function pay () {
            document.getElementById('pay-panel').style.display = 'flex';
        }
        function showPayResult (result) {
            document.getElementById('payment-result').innerText = result
        }
    </script>

    <div class="control-panel">
        <button class="pay-btn" onclick="pay()">Pay With Crypto</button>
        <div class="payment-result" id="payment-result">
        </div>
    </div>
    <div class="pay-panel" id="pay-panel">
        <!-- ocelot pay integration code will be placed here -->
    </div>
</body>

</html>
```

**5.2. Embedding the Integration Code**

Insert the previously copied Ocelot Pay integration code into the designated area of your HTML file.

```jsx
<div class="pay-panel" id="pay-panel">
<!-- ocelot pay integration code will be placed here -->
	<iframe
	    src="https://app.ocelotpay.com/payment?params=%7B%22appId%22%3A%22yQeOXcNEO5RCNsKPFgW2uaO4mZr2-8rnLkOS36AWQfbD6eCEL%22%2C%22valueInUSD%22%3A%220.1%22%2C%22defaultTokenCode%22%3A%22usdt-polygon%22%2C%22productId%22%3A%22xxxx%22%7D"
	    style="border: none;width: 480px;height: 550px;overflow: hidden;" />
</div>
```

**5.3. Setting Up Payment Result Listener**

Add JavaScript code to listen for payment results and handle them appropriately.

```jsx
window.addEventListener("message", event => {
    if (event.origin !== "https://app.ocelotpay.com") {
        return;
    }
    if (event?.data?.type === "buy-with-crypto" && event?.data?.subType === "buy-with-crypto-response") {
        // console.log(event?.data?.data);
        document.getElementById("payment-result").innerText = JSON.stringify(event?.data?.data);
    }
});
```

**5.4. Finalizing and Testing**

After integrating the code, run the example to test the payment process.

Here is a demonstration of the complete payment process:

![Screen Recording 2023-11-20 at 16.35.06 (1).gif](https://firebasestorage.googleapis.com/v0/b/paywithcrypto-9283c.appspot.com/o/docImages%2Focelotpay-demo.gif?alt=media&token=34aa5310-506b-4b1f-a248-0d92f89cbce7)

**5.5. Complete Example Code**

The full example code is available, providing a practical demonstration of integrating Ocelot Pay.

```jsx
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <title>Ocelot Pay Exapmle</title>
    <style>
        body {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .control-panel {
            width: 300px;
            padding-right: 20px;
            border-right: solid 1px grey;
        }

        .pay-btn {
            background-color: rgb(86, 102, 248);
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 18px;
        }

        .payment-result {
            margin-top: 12px;
            color: rgb(4, 167, 4);
            font-size: 16px;
            word-break: break-all;
        }

        .pay-panel {
            margin-left: 20px;
            display: none;
            align-items: center;
            border: solid 1px rgb(195, 194, 194);
        }
    </style>

</head>

<body>
    <script>
        function pay () {
            document.getElementById('pay-panel').style.display = 'flex';
        }
        function showPayResult (result) {
            document.getElementById('payment-result').innerText = result
        }

        window.addEventListener("message", (event) => {
            if (event.origin !== "https://app.ocelotpay.com") {
                return;
            }
            if (event?.data?.type === "buy-with-crypto" && event?.data?.subType === "buy-with-crypto-response") {
                // console.log(event?.data?.data);
                document.getElementById('payment-result').innerText = JSON.stringify(event?.data?.data);
            }
        });
    </script>

    <div class="control-panel">
        <button class="pay-btn" onclick="pay()">Pay With Crypto</button>
        <div class="payment-result" id="payment-result">
        </div>
    </div>
    <div class="pay-panel" id="pay-panel">
        <!-- ocelot pay integration code will be placed here -->
        <iframe
            src="https://app.ocelotpay.com/payment?params=%7B%22appId%22%3A%22yQeOXcNEO5RCNsKPFgW2uaO4mZr2-8rnLkOS36AWQfbD6eCEL%22%2C%22valueInUSD%22%3A%220.1%22%2C%22defaultTokenCode%22%3A%22usdt-polygon%22%2C%22productId%22%3A%22xxxx%22%7D"
            style="border: none;width: 480px;height: 550px;overflow: hidden;" />
    </div>
</body>

</html>
```

> _Note: This guide offers a basic tutorial for integrating Ocelot Pay. For advanced features and custom UI integration, refer to the official Ocelot Pay Documentation._

---

## Create and configure project

In the project menu on the [Ocelot Pay console](https://console.ocelotpay.com/dashboard/projects), click on "Add Project". Fill in all the required fields, and then save your changes. Your newly created project will now appear in your projects panel.

![new project](https://firebasestorage.googleapis.com/v0/b/paywithcrypto-9283c.appspot.com/o/docImages%2FnewProject.png?alt=media&token=0952fee5-e9e6-4cc7-a7be-d0437284df28&_gl=1*1qinefw*_ga*MTgzOTI5ODcyOS4xNjg1MzUzMzA2*_ga_CW55HF8NVT*MTY5NjY2NDY1MC4xNjkuMS4xNjk2NjY0NzA4LjIuMC4w)

---

## Get payment url

To obtain your payment URL or App ID, simply click on your project within the projects panel. This action will take you to the following page:

![payment config](https://firebasestorage.googleapis.com/v0/b/paywithcrypto-9283c.appspot.com/o/docImages%2FconfigPayment.png?alt=media&token=4e3b2f05-9ee1-4039-8e4f-dde548712e3e&_gl=1*2f9ns1*_ga*MTgzOTI5ODcyOS4xNjg1MzUzMzA2*_ga_CW55HF8NVT*MTY5NjY2NzA3OC4xNzAuMS4xNjk2NjY3MDg4LjUwLjAuMA..)

You can find your App ID on the left side (which is essential for SDK integration).

Next, on the left, configure your payment parameters. After that, click the "Generate URL" button, and you'll notice the payment preview UI updating on the right. Additionally, the following URL and iframe code will also be updated. You can then use the URL or iframe code for seamless integration with Ocelot Pay.

---

## Integration Without SDK

We strongly advise using the OcelotPay SDK for your integration needs. However, if you only need to offer a cryptocurrency payment option for a single product and prefer a more lightweight solution, it's a suitable choice.

### Integrate using iframe

-   Obtain your payment URL or iframe code as instructed in the previous [guide](#heading-8)
-   Customize your iframe using the payment URL or our provided iframe code
-   Seamlessly integrate the iframe into your webpage

### Listen payment result message

You can receive the payment result by listening for the "message" event from Ocelot Pay.

```
window.addEventListener("message", (event) => {
    if (event.origin !== "https://app.ocelotpay.com"){
        return;
    }
    if (event?.data?.type === "buy-with-crypto" && event?.data?.subType === "buy-with-crypto-response") {
        // you can access payment result from event.data.data
        console.log(event?.data?.data);
        // your code here
    }
});
```

The successful response:

```
appId: string;  // your appId
txHash: string; // on chain transaction hash
chainId: string; // hex string of payment chain, ex: 0x1
tokenSymbol: string; // payment token symbol
value: number; // amount of token
recordPrice: number; // token price(in USD) at record moment
recordValueInUSD: number; // value(in USD) calculated with recordPrice
recordTimestamp: number;
receiveAddress: string; // receiver crypto account address
productId: string | number; // the productId, maybe empty
extraInfo: string; // any custom info you set for this payment, maybe empty
receiptId: string; // unique receipt id
```

### Payment success callback api

See the [following part](#heading-20)

---

## Integration With SDK

### Install SDK

-   use CDN

    <script src="https://cdn.jsdelivr.net/npm/ocelot-pay-sdk@1.0.2/index.js"></script>

    You can access OcelotPay through the "window" object

    ```
    const OcelotPay = window.OcelotPay;
    ```

-   use npm ([npm package link](https://www.npmjs.com/package/ocelot-pay-sdk))

    **npm i ocelot-pay-sdk**

    ```
    import { OcelotPay } from "ocelot-pay-sdk";
    ```

### Init SDK with AppId

-   Obtain your App ID by following the instructions in the [previous guide](#heading-8)
-   Initialize OcelotPay with your App ID.

If installed with npm

```
import { OcelotPay } from "ocelot-pay-sdk";

const myAppId = ''; // your appId here
OcelotPay.init({ appId: myAppId });
```

If installed with CDN

```
const myAppId = ''; // your appId here
window.OcelotPay.init({ appId: myAppId });
```

### onReady callback

Initializing OcelotPay is an asynchronous operation, and it returns a promise of boolean type. However, even after the initialization is complete, there may be some ongoing asynchronous HTTP requests. During this period, OcelotPay may not be ready for use. You can check the readiness of OcelotPay by calling:

`OcelotPay.isReady()`

For your convenience, we offer the **onReady** callback. This callback will be triggered once OcelotPay is fully prepared for use.

For instance, you can initialize OcelotPay at the root of your application and utilize the onReady callback in your components.

Here's an example of React code:

```
// at your app root
OcelotPay.init({ appId: "" }); // your appId here

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

---------------------------------------------------------------------------------

// at your component
useEffect(() => {
    const generatePaymentUrl = () => {
        const url = OcelotPay.generatePaymentUrl({});
        setPaymentUrl(url);
    };
    const cid = OcelotPay.onReady(generatePaymentUrl);

    return () => {
        // Don't forget to cancelOnReadyCallback, or it may execute multi times
        if (cid) {
            OcelotPay.cancelOnReadyCallback(cid);
        }
    };
}, []);
```

### Generate payment url

To incorporate our payment user interface, you need to create a payment URL initially.

```
const url = OcelotPay.generatePaymentUrl({});
```

The parameter structure

```
{
    valueInUSD?: number; // fixed payment value; if null, user can edit the payment amount by them self
    defaultTokenCode?: "eth" | "matic" | "usdt-eth" | "usdt-polygon"; // default selected token type
    productId?: string; // your product id, helps you to identify which product be consumed
    extraInfo?: string; // your custom info, will be returned in response, can be a json format string. For example, you can put user id here to identify which user owns this payment
}
```

### Update or create iframe

Once you obtain the payment URL, you can update the iframe URL and display the payment interface to your users.

### Launch payment & wait for result

At this point, users can already access the payment interface and make payments to your account. However, if you need to modify payment configurations or retrieve payment results directly from the frontend, you can use OcelotPay.request().

```
try {
    const payResult = await OcelotPay.request(
        {
            method: "request_payment",  // do not change the method filed
            // params is the same as generatePaymentUrl method param
            params: {
                valueInUSD: 12,
                defaultTokenCode: "usdt-polygon",
                produckId: 'example product id',
                extraInfo: 'example extraInfo',
            },
        },
        payIframeRef.current // your payment iframe dom element, this code is just an example
    );

    if (payResult?.receiptId) {
        // payment success, your code here
        ...
    } else {
        // some thing wrong, you may notice user payment failed
        ...
    }
} catch (error) {
    if (error?.receiptId) {
        // transaction maybe validat on chain but not saved on OcelotPay
        // you can save the receiptId and verify receipId (see the following "Verify receiptId" block)
        ...
    } else {
        // some thing wrong, you may notice user payment failed
        ...
    }
}
```

### Payment success callback api

If you have set up the "Callback API" in your project, you'll be able to receive every successful payment result through this API. We strongly recommend configuring the "Callback API."

-   Configure on creating or editing project
    > Both the secret phrase and the Callback API must be configured.
    > The API URL should support the POST method and be able to accept two properties, namely resultJsonStr and checkHexStr, in the body parameters.
-   Verify the message is from OcelotPay

    > The Callback API request body will appear as follows:

    ```
    {
        resultJsonStr: string, // payment result in json format string
        checkHexStr: string, // hex string, hash result of project configured secret phrase + resultJsonStr
    }
    ```

    > To verify the hash string:
    >
    > 1. Compare the hashed result by using the secret phrase + resultJsonStr string as input for the SHA256 algorithm, generating a hashed hexString output. Then, compare this output with checkHexStr to confirm that the request is from OcelotPay.

    > 2. Parse the result JSON string.

    For example, here's some JavaScript code for reference. Note that you may require[CryptoJS](https://www.npmjs.com/package/crypto-js)

    ```
    // get data from request body
    const checkHexStr = ''; // get from request body
    const resultJsonStr = ''; // get from request body

    const secretPhrase = ''; // configured secret phrase for your project
    const checkHash = CryptoJS.SHA256(secretPhrase + resultJsonStr);

    // parse to hex string
    const hashHex = checkHash.toString(CryptoJS.enc.Hex);

    if(checkHexStr === hashHex){
        // request is from OcelotPay, you can trust it
        const result = JSON.parse(resultJsonStr);
        return result;
    }
    else{
        // request is not from OcelotPay!
        return null;
    }
    ```

### Verify receiptId

While it's a rare occurrence, certain network issues can sometimes result in a payment transaction being confirmed on the blockchain but not recorded by the OcelotPay server. In such cases, you will receive a unique receipt ID in the payment response. To address this situation, you can verify and store this payment by using the following API:
[https://verifypaymentreceiptandsave-cjurgglvma-uc.a.run.app](https://verifypaymentreceiptandsave-cjurgglvma-uc.a.run.app)

To proceed, make sure to use the **POST** method and include the **receiptId** in the request body:

```
{
    receiptId: '' // The receiptId you received
}
```

### Build your own payment ui (Advanced)

While using our provided payment interface is very convenient, you may wish to create a customized payment view. In such instances, you can leverage the OcelotPay SDK to construct your unique user interface. In fact, our payment interface is constructed using the OcelotPay SDK.

To build your own user interface, follow these steps:

-   Initialize OcelotPay with your App ID.

```
const myAppId = ''; // your appId here
OcelotPay.init({ appId: myAppId });
```

-   Utilize **ethereumProvider** and **walletManager** to identify and connect a wallet.

```
// currently support metamask and coinbase, here is an example of metamsk
const metamaskProvider = OcelotPay.utils.ethereumProvider.detectProviders()?.metamask;

if(metamaskProvider){
    const accountAddr = await OcelotPay.utils.walletManager.connectWallet(metamaskProvider, "metamask");
    if (accountAddr) {
        // wallet connected
    }
}

```

-   Retrieve the available tokens from **OcelotPay.tokenConfigs**

    Here's an example structure of a token configuration:

```
{
    "chainId": "0x1",
    "type": "erc20", // erc20 or origin
    "symbol": "USDT-ETH",
    "code": "usdt-eth",
    "contractAddr": "0xdAC17F958D2ee523a2206206994597C13D831ec7",  // only erc20 has contractAddr
    "decimals": 6,
    "iconUrl": "" // token icon url
}
```

-   Obtain the current token price in real-time

```
let tokenSymbol = '' // support 'USDT', 'ETH', 'MATIC'
OcelotPay.getTokenPriceInUSD(tokenSymbol);
```

-   Initiate a payment request

```
// Example code for reqest a payment
const tx = await OcelotPay.utils.walletManager.requestTransfer(
    chainId, // chain id
    value, // the amount of token to be sent
    fromAddr, // from which address (normally is the accountAddr you got after connecting wallet)
    OcelotPay.targetAddr, // your configured payment address
    isErc20, // is token is erc20, you can get from token configuration data
    productId, // your product id, can be null
    onPaymentProgressChanged, // callback function when payment progress changed. Function(progress: string) => void
    paymentExtraInfo // customed extra info, can be null
);
```

---

## SDK APIS

### OcelotPay

> **_Properties_**
>
> -   **appId**: string

> -   **tokenConfigs**: Array<any>

> -   **isFetchingTokenConfigOrFailed**: boolean

> -   **isFetchingAppConfigOrFailed**: boolean

> -   **logoUrl**: string

> -   **targetAddr**: string

> -   **iframeEle**: HTMLIFrameElement

> -   **readyCallbacks**: { [key: string]: Function | null }

> -   **utils**: {walletManager: typeof [WalletManager](#heading-26); ethereumProvider: typeof [EthereumProvider](#heading-25) }

> **_Methods_**
>
> -   **init**: (option: [InitOption](#heading-27)) => void
>
> -   **isReady**: () => boolean

> -   **onReady**: (callback: Function) => string | null
>     > Add callback functions for OcelotPay onready
> -   **cancelOnReadyCallback**: (cid: string) => void;
>     > Cancel callback, cid is the id returned by onReady function
> -   **connectWallet**: (walletType: "metamask" | "coinbase") => void

> -   **getTokenConfigs**: () => void

> -   **getTokenPriceInUSD**: (tokenSymbol: string) => Promise<number>
>     > Support token symbols: 'USDT', 'ETH', 'MATIC'
> -   **generatePaymentUrl**: (config: [PaymentConfig](#heading-27)) => string

> -   **checkPayUIIframeReady**: (iframeEle: HTMLIFrameElement) => Promise<boolean>

> -   **request**: ({ method, params }: { method: string; params: [PaymentConfig](#heading-27) },iframeEle: HTMLIFrameElement) => Promise<any>

### EthereumProvider

> **_Methods_**
>
> -   **detectProviders**: () => [WalletTypes](#heading-27)

> -   **getCurrentConnectedProvider**: () => any

### WalletManager

> **_Methods_**
>
> -   **connectWallet**: (provider: any, providerType: "metamask" | "coinbase") => Promise<string>

> -   **clearConnectInfo**: () => void

> -   **getAccountWithCurrentProvider**: () => Promise<string>

> -   **requestTransfer**:
>     > (
>     >
>     > > chainId: string /**in hex format \*/,  
>     > > value: number /**token amount\*/,  
>     > > fromAddr: string,  
>     > > toAddr: string,  
>     > > isErc20: boolean,  
>     > > productId?: string,  
>     > > onProgressChanged?: (progress: string) => void,  
>     > > extraInfo?: string
>     >
>     > ) => Promise<any>

### Types

**InitOption**

```
interface InitOption {
    appId: string;
}
```

**PaymentConfig**

```
interface PaymentConfig {
    valueInUSD?: number;
    defaultTokenCode?: "eth" | "matic" | "usdt-eth" | "usdt-polygon";
    productId?: string;
    extraInfo?: string;
}
```

**WalletTypes**

```
interface WalletTypes {
    metamask: any,
    coinbase: any
}
```
