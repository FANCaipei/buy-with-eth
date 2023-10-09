## Introduction

Ocelot Pay is a payment tool with which user can pay in several crypto coins.

Unlike traditional 3rd party payment tool, we don't hold any assets traded and all payments are sent directly to your cryptocurrency account.

Ocelot Pay is very easy to integrate, all you need to do is:

1. Create and configure your project on [Ocelot Pay console](https://console.ocelotpay.com/dashboard/projects)
2. Get integration link or code, integrate with iframe or Ocelot Pay SDK

---

## Create and configure project

At project menu on [Ocelot Pay console](https://console.ocelotpay.com/dashboard/projects), click "Add Project", fill all fields and save. The newly created project will display on your projects panel.

![new project](https://firebasestorage.googleapis.com/v0/b/paywithcrypto-9283c.appspot.com/o/docImages%2FnewProject.png?alt=media&token=0952fee5-e9e6-4cc7-a7be-d0437284df28&_gl=1*1qinefw*_ga*MTgzOTI5ODcyOS4xNjg1MzUzMzA2*_ga_CW55HF8NVT*MTY5NjY2NDY1MC4xNjkuMS4xNjk2NjY0NzA4LjIuMC4w)

---

## Get payment url

To get your payment url or appId, click your project at projects panel, your will see the follwing page:

![payment config](https://firebasestorage.googleapis.com/v0/b/paywithcrypto-9283c.appspot.com/o/docImages%2FconfigPayment.png?alt=media&token=4e3b2f05-9ee1-4039-8e4f-dde548712e3e&_gl=1*2f9ns1*_ga*MTgzOTI5ODcyOS4xNjg1MzUzMzA2*_ga_CW55HF8NVT*MTY5NjY2NzA3OC4xNzAuMS4xNjk2NjY3MDg4LjUwLjAuMA..)

Your can find your appId at left (which is required for SDK integration).

Configure your payment params at left, click "Generate url" button the payment preview ui will update at right.
The follwing url and iframe code will update too. Thus you can use the url or iframe code to integrate Ocelot Pay.

---

## Integration Without SDK

We highly recommend you to use OcelotPay SDK. But if you just want to provide a crypto token payment way for single product lightweight integration is a good option.

### Integrate using iframe

-   Get your payment url or iframe code by following previous [guide](#heading-2)
-   Custom your iframe with payment url or based on our iframe code
-   Integrate iframe into your page

### Listen payment result message

You can get payment result by listening "message" event from Ocelot Pay.

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

    Coming soon  
    You can get OcelotPay under window object

    ```
    const OcelotPay = window.OcelotPay;
    ```

-   use npm ([npm package link](https://www.npmjs.com/package/ocelot-pay-sdk))

    **npm i ocelot-pay-sdk**

    ```
    import { OcelotPay } from "ocelot-pay-sdk";
    ```

### Init SDK with AppId

-   Get your appId by following [previous guide](#heading-2)
-   Init OcelotPay with your appId

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

OcelotPay init is an async function, it returns a boolean type promise.
But event init finished there may be some async http requests running, at this moment OcelotPay is not ready to be used. You can check OcelotPay ready status by calling `OcelotPay.isReady()`.

For your convenient, we provide the onReady callback. The onReady callback will be called once OcelotPay is ready.

For example you can just init OcelotPay at the root of your app, and use onReady callback in your components.

Here is an example code of react

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

To integrate our payment ui, you must generate payment url first

```
const url = OcelotPay.generatePaymentUrl({});
```

The param structure

```
{
    valueInUSD?: number; // fixed payment value; if null, user can edit the payment amount by them self
    defaultTokenCode?: "eth" | "matic" | "usdt-eth" | "usdt-polygon"; // default selected token type
    productId?: string; // your product id, helps you to identify which product be consumed
    extraInfo?: string; // your custom info, will be returned in response, can be a json format string. For example, you can put user id here to identify which user owns this payment
}
```

### Update or create iframe

### Launch payment & wait for result

### Payment success callback api

### Build your own payment ui

---

## SDK APIS
