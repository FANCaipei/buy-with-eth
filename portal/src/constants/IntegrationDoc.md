## Introduction

Ocelot Pay offers a convenient way for users to make payments using various cryptocurrencies.

In contrast to conventional third-party payment solutions, we do not retain any assets during transactions. Instead, all payments are directly transferred to your cryptocurrency account.

Integrating Ocelot Pay is a breeze. Simply follow these steps:

1. Begin by setting up and customizing your project on the [Ocelot Pay console](https://console.ocelotpay.com/dashboard/projects)
2. Once your project is configured, you can obtain an integration link or code. You can easily integrate it into your system using an iframe or the Ocelot Pay SDK.

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

-   Obtain your payment URL or iframe code as instructed in the previous [guide](#heading-2)
-   Customize your iframe using the payment URL or our provided iframe code
-   Seamlessly integrate the iframe into your webpage

### Listen payment result message

You can receive the payment result by listening for the "message" event from Ocelot Pay.

```
window.addEventListener("message", (event) => {
    if (event.origin !== "https://app.ocelotpay.com"){
        return;
    }
    if (event?.data?.type === "buy-with-crypto" && event?.data?.subType === "buy-with-crypto-request") {
        switch (event?.data?.data?.method) {
            case "request_payment":
                // your code here
                ...
                return;
            default:
                return;
        }
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

See the [following part](#heading-14)

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

-   Obtain your App ID by following the instructions in the [previous guide](#heading-2)
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

> -   **utils**: {walletManager: typeof [WalletManager](#heading-20); ethereumProvider: typeof [EthereumProvider](#heading-19) }

> **_Methods_**
>
> -   **init**: (option: [InitOption](#heading-21)) => void
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
> -   **generatePaymentUrl**: (config: [PaymentConfig](#heading-21)) => string

> -   **checkPayUIIframeReady**: (iframeEle: HTMLIFrameElement) => Promise<boolean>

> -   **request**: ({ method, params }: { method: string; params: [PaymentConfig](#heading-21) },iframeEle: HTMLIFrameElement) => Promise<any>

### EthereumProvider

> **_Methods_**
>
> -   **detectProviders**: () => [WalletTypes](#heading-21)

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
