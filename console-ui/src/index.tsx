import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import FirebaseManager from "./common/firebase/FirebaseManager";
import { BuyWithCrypto } from "payWithCrypto";

// init firebase
FirebaseManager.init();

BuyWithCrypto.init({ appId: "7eOuUvMKqhOiYjFBPgrxu050Wno1-zLO6MpxSlR0uL8IvDwRU" });

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
