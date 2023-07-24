import React, { useCallback, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, notification } from "antd";

function App() {
    const [notifyApi, contextHolder] = notification.useNotification();

    const requestPay = useCallback(async () => {
        try {
            (window as any).buyWithCrypto.showPayUI();
            const resp = await (window as any).buyWithCrypto.request({
                method: "request_payment",
                params: { value: 1 },
            });
            console.log("payment response: ", resp);
        } catch (error) {
            console.log("user canceled: ", error);
            notifyApi["error"]({
                message: (error as any)?.errorMsg,
                description: (error as any)?.errorDetail,
            });
            (window as any).buyWithCrypto.hidePayUI();
        }
    }, []);
    // const requestTransfer = useCallback(() => {
    //     (window as any).walletManager.requestTransfer(
    //         0.01,
    //         "0x6978De6532Cd2C94D47430C22B1bCddb53fB23aa",
    //         "0xA02bB13E8d360E9E3A1c07C3043BE140C2D8DA59"
    //     );
    // }, []);

    useEffect(() => {
        (window as any).buyWithCrypto.init({ appId: "xxx", appKey: "yyy" });
        (window as any).buyWithCrypto.initUI();
    }, []);

    return (
        <div className="App">
            {contextHolder}
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <Button type="primary" onClick={requestPay}>
                    request payment
                </Button>
                {/* <Button type='primary' onClick={requestTransfer}>request transfer</Button> */}
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
