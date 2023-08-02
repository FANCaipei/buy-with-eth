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
                params: { valueInUSD: 1, defaultTokenCode: "usdt-sepolia" },
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
    }, [notifyApi]);

    useEffect(() => {
        (window as any).buyWithCrypto.init({ appId: "rBBXvVZq0eSnZZ2pliYiCfeOkx43-jcUrmUedFydsUfr2itcR" });
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
