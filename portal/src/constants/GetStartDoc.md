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

This comprehensive guide provides a step-by-step walkthrough for new users of **Ocelot Pay**, covering everything from account setup to project integration.

## Setting Up an Ocelot Pay Account

### Account Registration

Navigate to the Ocelot Pay console at [Ocelot Pay Signup](https://console.ocelotpay.com/auth), and select the 'Sign Up' option to begin the registration process.

### Entering Registration Details

Fill in the required fields with your personal information to create your account.

**1.3. Email Confirmation**

After submitting the registration form, please check your email, including the spam folder, for a confirmation message from Ocelot Pay. Click on the confirmation link in the email to activate your account.

**1.4. Account Activation**

Upon clicking the confirmation link, your account will be activated, and you can begin using Ocelot Pay.

## Creating a New Project

### Accessing the Console

Click on 'Go to Console' to enter the Ocelot Pay management console.

### Starting a New Project

Initially, the console will show that you have no existing projects. Please select 'Create Project' to start a new project.

### Project Details

On the project creation page, fill in the necessary information about your project, and submit the form to create your project.

-   Receiving Address (Please select the address corresponding to the Ethereum network): In general, you can obtain your Ethereum network address from the web3 wallet or exchange that you use. Here are some methods for obtaining your Ethereum address from some well-known wallets and exchanges:
    1. Coinbase wallet: https://help.coinbase.com/en/coinbase/getting-started/crypto-education/where-is-my-crypto-address
    2. Metamask: https://support.metamask.io/hc/en-us/articles/360015488791-How-to-view-your-account-details-and-public-address
    3. OKX: https://www.okx.com/help/how-do-i-manage-my-assets-in-my-okx-wallet-app
    4. Binance: https://everybithelps.io/binance-wallet-address/

> Please fill in the receiving address carefully, as all payments from end users will be directly transferred to the address you provide. Please ensure the accuracy of the receiving address you fill in.

-   Callback API: This is your API interface for receiving successful payment results. It must support the POST method and does not require authentication. We will use this interface to send successful payment data to your application every time a user makes a payment. You can also leave it blank if not needed, and you can retrieve the payment results on your website.

-   Secret Phrase: When using the callback API to return payment results to your application, we will use the passphrase as a salt to hash the user's payment information. This way, when your system receives the payment results, it can use the same method to hash the information we return to ensure that it indeed comes from us. You can enter any phrase and change it at any time.

### Project Confirmation

After successful submission, the newly created project will be visible in your project list.

## Configuring Payment Parameters

### Parameter Selection

-   Choose the specific parameters you wish to configure for your payment setup.

### Configuring Parameters

-   Adjust and set your desired payment parameters on the configuration screen.

### Generating Payment URL

Click 'Generate URL' to update the payment preview based on your configurations. The generated payment link will also be updated accordingly.

## Integrating Ocelot Pay into Your Project

### Copying Integration Code

Click the 'Copy' button in the code section to copy the Ocelot Pay integration code.

### Code Integration

Paste the copied code into your project where you want to integrate Ocelot Pay.

## Quick Integration Example

### Creating an Example Project

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

### Embedding the Integration Code

Insert the previously copied Ocelot Pay integration code into the designated area of your HTML file.

```jsx
<div class="pay-panel" id="pay-panel">
<!-- ocelot pay integration code will be placed here -->
	<iframe
	    src="https://app.ocelotpay.com/payment?params=%7B%22appId%22%3A%22yQeOXcNEO5RCNsKPFgW2uaO4mZr2-8rnLkOS36AWQfbD6eCEL%22%2C%22valueInUSD%22%3A%220.1%22%2C%22defaultTokenCode%22%3A%22usdt-polygon%22%2C%22productId%22%3A%22xxxx%22%7D"
	    style="border: none;width: 480px;height: 550px;overflow: hidden;" />
</div>
```

### Setting Up Payment Result Listener

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

### Finalizing and Testing

After integrating the code, run the example to test the payment process.

Here is a demonstration of the complete payment process:

![Screen Recording 2023-11-20 at 16.35.06 (1).gif](https://firebasestorage.googleapis.com/v0/b/paywithcrypto-9283c.appspot.com/o/docImages%2Focelotpay-demo.gif?alt=media&token=34aa5310-506b-4b1f-a248-0d92f89cbce7)

### Complete Example Code

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

---

> Note: This guide offers a basic tutorial for integrating Ocelot Pay. For advanced features and custom UI integration, refer to the official [Ocelot Pay Documentation](/doc).
