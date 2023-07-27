import { Button, Input, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { send } from "../messageManager/MessageManager";
import { Utils, ResponseErrorType } from "../common/Utils";
import RestService from "../common/restService/RestService";

const AvailableCurrencyTypes = [
    {
        chainId: "0x1",
        type: "origin", // 'origin' or 'erc20'
        symbol: "ETH",
        code: "eth",
        priceRequestSymbol: "ETH",
        needRequestPrice: true, // if needRequestPrice, priceRequestSymbol must not be null
        isDefault: true,
    },
    {
        chainId: "0x89",
        type: "origin", // 'origin' or 'erc20'
        symbol: "MATIC",
        code: "matic",
        priceRequestSymbol: "MATIC",
        needRequestPrice: true, // if needRequestPrice, priceRequestSymbol must not be null
    },
    {
        chainId: "0x1",
        type: "erc20", // 'origin' or 'erc20'
        symbol: "USDT-ETH",
        code: "usdt-eth",
        contractAddr: "",
    },
    {
        chainId: "0x89",
        type: "origin", // 'origin' or 'erc20'
        symbol: "USDT-Polygon",
        code: "usdt-polygon",
        contractAddr: "",
    },
    {
        chainId: "0xaa36a7",
        type: "origin", // 'origin' or 'erc20'
        symbol: "SepoliaETH",
        code: "sepolia-eth",
    },
];

const PaymentPage = () => {
    const navigate = useNavigate();
    const { state: params } = useLocation();
    const [responseToOrigin] = useState(params?.responseToOrigin);
    const [responseToId] = useState(params?.responseToId);

    const [targetAddress, setTargetAddress] = useState();

    const [currencyTypeCode, setCurrencyTypeCode] = useState(params?.params?.currencyCode ?? "eth");
    const [currencyPaymentConfig, setCurrencyPaymentConfig] = useState<any>();

    const [currentCurrencyPrice, setCurrentCurrencyPrice] = useState();
    const getCurrentCurrencyPrice = useCallback((currencyConfig: any) => {
        if (currencyConfig?.priceRequestSymbol) {
            RestService.getCryptoPrice(currencyConfig.priceRequestSymbol).then((res: any) => {
                if (res?.data?.data?.amount) {
                    setCurrentCurrencyPrice(res.data.data.amount);
                }
            });
        }
    }, []);

    const onCurrencyTypeChange = useCallback(
        (selectCode: string) => {
            console.log(selectCode);
            setCurrencyTypeCode(selectCode);
            const currencyConfig = AvailableCurrencyTypes.find(item => item.code === selectCode);
            setCurrencyPaymentConfig(currencyConfig);
            getCurrentCurrencyPrice(currencyConfig);
        },
        [getCurrentCurrencyPrice]
    );

    const [sendValue, setSendValue] = useState(params?.params?.value);
    const onSendValueChange = useCallback((event: any) => {
        console.log(event);
        setSendValue(event?.target?.value);
    }, []);

    const pay = useCallback(async () => {
        if (!currencyPaymentConfig) {
            console.error("not payment config: TODO: send error back");
            return;
        }
        const goConnectWallet = () => {
            navigate("/connect-wallet", {
                replace: true,
                state: params,
            });
        };
        let fromAddr: string | null = null;
        try {
            fromAddr = await (window as any).buyWithCrypto.utils.walletManager.getAccountWithCurrentProvider();
        } catch (error) {
            goConnectWallet();
        }

        if (!fromAddr) {
            goConnectWallet();
        } else {
            // transaction
            try {
                const tx = await (window as any).buyWithCrypto.utils.walletManager.requestTransfer(
                    currencyPaymentConfig.chainId,
                    sendValue,
                    fromAddr,
                    targetAddress
                );
                console.log("request transfer ok: ", tx);
                send("buy-with-crypto-response", responseToId, tx, responseToOrigin);
            } catch (error) {
                send(
                    "buy-with-crypto-response",
                    responseToId,
                    {
                        error: Utils.generateErrorMsg(ResponseErrorType.PaymentError, (error as any)?.message),
                    },
                    responseToOrigin
                );
            }
        }
    }, [navigate, params, targetAddress, sendValue, responseToId, responseToOrigin, currencyPaymentConfig]);
    const cancel = useCallback(() => {
        send(
            "buy-with-crypto-response",
            responseToId,
            {
                error: Utils.generateErrorMsg(ResponseErrorType.UserDenyPayment),
            },
            responseToOrigin
        );
    }, [responseToId, responseToOrigin]);

    useEffect(() => {
        console.log("payment params: ", params);
        const currentProvider = (window as any).buyWithCrypto.utils.ethereumProvider.getCurrentConnectedProvider();
        if (!currentProvider) {
            // nav to connect wallet with params
            navigate("/connect-wallet", { replace: true, state: params });
        }
        setTargetAddress((window as any).buyWithCrypto.targetAddr);

        const currencyConfig =
            AvailableCurrencyTypes.find(item => item.code === params?.params?.currencyCode) ??
            AvailableCurrencyTypes.find(item => item.isDefault) ??
            AvailableCurrencyTypes[0];
        setCurrencyPaymentConfig(currencyConfig);
        setCurrencyTypeCode(currencyConfig.code);
        getCurrentCurrencyPrice(currencyConfig);
    }, [navigate, params, getCurrentCurrencyPrice]);

    return (
        <StyledContainer>
            <div>{targetAddress}</div>
            <div>current price: ~{currentCurrencyPrice} USD</div>
            <Select
                defaultValue={currencyTypeCode}
                style={{ width: 120 }}
                onChange={onCurrencyTypeChange}
                options={AvailableCurrencyTypes.map(item => ({
                    value: item.code,
                    label: item.symbol,
                }))}
            />
            <Input placeholder="Send value" type="number" value={sendValue} onChange={onSendValueChange} />
            <div className="btn-line">
                <Button onClick={cancel}>Cancel</Button>
                <Button type="primary" onClick={pay}>
                    Pay
                </Button>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "payment-page" })`
    .btn-line {
        margin-top: 40px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
`;

export default PaymentPage;
