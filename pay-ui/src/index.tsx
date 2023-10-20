import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import useAuthorityCheck from "./common/golbalStates/authorityCheckState";

// get configs from url
let appConfigs: any = {};
try {
    const searchParams = new URLSearchParams(window.location.search);
    const params = searchParams.get("params");
    const hideProjectLogo = searchParams.get("noProjectLogo") === "true";
    console.log("searched params: ", params);
    if (params) {
        const decodedParams = decodeURIComponent(params);
        appConfigs = JSON.parse(decodedParams);
    }
    appConfigs.hideProjectLogo = hideProjectLogo;
} catch (error) {
    // do nothing
}

if (appConfigs.appId) {
    (window as any).OcelotPay.init({
        appId: appConfigs.appId,
    }).catch((err: any) => {
        console.error("init error: ", err);
        if (err.errorCode === 4003) {
            useAuthorityCheck.setState({ canAccessProject: false });
        }
    });
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <App appConfigs={appConfigs} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
