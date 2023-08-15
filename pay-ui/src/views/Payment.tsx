import { Button, Input, Select, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { createGlobalStyle, styled } from "styled-components";
import { send } from "../messageManager/MessageManager";
import { Utils, ResponseErrorType } from "../common/Utils";
import RestService from "../common/restService/RestService";
import useUrlParamsConfig from "../common/golbalStates/urlParamsConfigState";

const PaymentPage = () => {
    const navigate = useNavigate();
    const paramsFromUrl = useUrlParamsConfig((state: any) => state.paramsFromUrl);
    const { state: params } = useLocation();
    /**
     * state format: {
     *      responseToOrigin?: string,
     *      responseToId?: string,
     *      params?: {
     *          valueInUSD?: number,
     *          defaultTokenCode?: string,
     *      },
     * }
     */
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [responseToOrigin] = useState(params?.responseToOrigin);
    const [responseToId] = useState(params?.responseToId);

    const [targetAddress, setTargetAddress] = useState();
    const [logoUrl, setLogoUrl] = useState();

    const [paymentConfigParams, setPaymentConfigParams] = useState(params?.params ?? paramsFromUrl ?? {});
    const [preSetValueInUSD, setPreSetValueInUSD] = useState(paymentConfigParams?.valueInUSD);
    const [currencyTypeCode, setCurrencyTypeCode] = useState(paymentConfigParams?.defaultTokenCode ?? "eth");
    const [currencyPaymentConfig, setCurrencyPaymentConfig] = useState<any>();

    const [currentCurrencyPrice, setCurrentCurrencyPrice] = useState<any>();
    const getCurrentCurrencyPrice = useCallback(
        (currencyConfig: any) => {
            if (!currencyConfig?.symbol || currencyConfig?.symbol === "") {
                return;
            }
            const symbol = currencyConfig.symbol.includes("USDT") ? "USDT" : currencyConfig.symbol;
            RestService.getCryptoPrice(symbol)
                .then((res: any) => {
                    const price = parseFloat(`${res?.data?.data?.amount}`);

                    if (price && !isNaN(price)) {
                        setCurrentCurrencyPrice(price);
                        if (paymentConfigParams?.valueInUSD) {
                            setSendValue((parseFloat(`${paymentConfigParams.valueInUSD}`) / price).toFixed(4));
                        }
                    } else {
                        setCurrentCurrencyPrice(null);
                        setSendValue(undefined);
                    }
                })
                .catch(() => {
                    setCurrentCurrencyPrice(null);
                    setSendValue(undefined);
                });
        },
        [paymentConfigParams?.valueInUSD]
    );

    const onCurrencyTypeChange = useCallback(
        (selectCode: string) => {
            console.log(selectCode);
            setCurrencyTypeCode(selectCode);
            const currencyConfig = (window as any).buyWithCrypto.tokenConfigs.find(
                (item: any) => item.code === selectCode
            );
            setCurrencyPaymentConfig(currencyConfig);
            getCurrentCurrencyPrice(currencyConfig);
        },
        [getCurrentCurrencyPrice]
    );

    const [sendValue, setSendValue] = useState<number | string | undefined>();
    const onSendValueChange = useCallback((event: any) => {
        setSendValue(event?.target?.value);
    }, []);

    const clearConnectInfo = useCallback(() => {
        (window as any).buyWithCrypto.utils.walletManager.clearConnectInfo();
        navigate("/connect-wallet", { replace: true, state: params });
    }, [navigate, params]);

    const pay = useCallback(async () => {
        const currentProvider = (window as any).buyWithCrypto.utils.ethereumProvider.getCurrentConnectedProvider();
        if (!currentProvider) {
            // nav to connect wallet with params
            navigate("/connect-wallet", { replace: true, state: params });
        }
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
                    targetAddress,
                    currencyPaymentConfig?.symbol?.includes("USDT"),
                    paymentConfigParams?.productId
                );
                console.log("request transfer ok: ", tx);
                send("buy-with-crypto-response", responseToId, tx, responseToOrigin);
            } catch (error) {
                console.error(error);
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
        const tempParams = params?.params ?? paramsFromUrl ?? {};
        setPaymentConfigParams(tempParams);
        setPreSetValueInUSD(tempParams.valueInUSD);
    }, [params?.params, paramsFromUrl]);

    useEffect(() => {
        console.log("payment params: ", paymentConfigParams);
        setIsLoading(true);
        const onPaySDKReady = () => {
            setTargetAddress((window as any).buyWithCrypto.targetAddr);
            setLogoUrl((window as any).buyWithCrypto.logoUrl);
            const AvailableCurrencyTypes: Array<any> = (window as any).buyWithCrypto.tokenConfigs ?? [];
            const currencyConfig =
                AvailableCurrencyTypes.find(item => item.code === paymentConfigParams?.defaultTokenCode) ??
                AvailableCurrencyTypes.find(item => item.isDefault) ??
                AvailableCurrencyTypes[0];
            setCurrencyPaymentConfig(currencyConfig);
            setCurrencyTypeCode(currencyConfig?.code);
            getCurrentCurrencyPrice(currencyConfig);
            setIsLoading(false);
        };

        if ((window as any).buyWithCrypto.isReady()) {
            onPaySDKReady();
        } else {
            (window as any).buyWithCrypto.onReady(onPaySDKReady);
        }
    }, [navigate, paymentConfigParams, getCurrentCurrencyPrice]);

    return (
        <Spin spinning={isLoading} size="large">
            <StyledContainer>
                <GlobalStyle />

                <div className="logo-container">
                    <img className="logo-img" src={logoUrl} alt="" />
                </div>
                <div className="token-selector-container">
                    <div className="token-selector">
                        <Select
                            size="large"
                            value={currencyTypeCode}
                            style={{ maxWidth: 180 }}
                            onChange={onCurrencyTypeChange}
                        >
                            {((window as any).buyWithCrypto.tokenConfigs ?? []).map((item: any) => (
                                <Select.Option value={item.code}>
                                    <div className="token-option">
                                        <img className="token-logo" src={item.iconUrl} alt="" />
                                        <span className="token-symbol">{item.symbol}</span>
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <div className="price-block">
                        <span className="price">
                            {currentCurrencyPrice == null ? "-" : `$${currentCurrencyPrice?.toFixed(4)}`}
                        </span>
                        <ReloadOutlined className="refresh-icon" onClick={getCurrentCurrencyPrice} />
                    </div>
                </div>
                <div className="item-wrapper">
                    <Input
                        size="large"
                        addonBefore="Send To"
                        value={targetAddress}
                        placeholder="Receive address"
                        disabled
                    />
                </div>
                <div className="item-wrapper">
                    <Input
                        size="large"
                        addonBefore="Amount"
                        placeholder="Amount"
                        type="number"
                        value={sendValue}
                        onChange={onSendValueChange}
                        disabled={preSetValueInUSD != null}
                    />
                </div>
                <div className="item-wrapper">
                    <Button size="large" type="primary" onClick={pay} style={{ width: "100%", marginTop: "20px" }}>
                        Pay
                    </Button>
                </div>
                {/* <div className="btn-line">
                    <Button onClick={cancel}>Cancel</Button>
                    <Button type="primary" onClick={pay}>
                        Pay
                    </Button>
                </div> */}
                {/* <Button type="dashed" onClick={clearConnectInfo}>
                    Disconnect
                </Button> */}
                <div className="reconnect-wallet">
                    <Button type="link" onClick={clearConnectInfo}>
                        Reconnect Wallet
                    </Button>
                </div>
                <div className="spacer"></div>
                <div className="bottom-block">
                    <span className="text">Power by xxxx</span>
                    <img className="logo-img" src="" alt="" />
                </div>
            </StyledContainer>
        </Spin>
    );
};

const GlobalStyle = createGlobalStyle`
    .token-option {
        display: flex;
        align-items: center;
        width: 120px;

        .token-logo {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            border-radius: 50%;
        }
        .token-symbol {
        }
    }

    .ant-spin-nested-loading{
        height: 100%;

        .ant-spin-container{
            height: 100%;
        }
    }
`;

const StyledContainer = styled.div.attrs({ className: "payment-page" })`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
    height: calc(100% - 40px);

    .logo-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 50px;

        .logo-img {
            width: 60px;
            height: 60px;
            border-radius: 12px;
        }
    }
    .token-selector-container {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .token-selector {
            .token-option {
                display: flex;
                align-items: center;

                .token-logo {
                    width: 16px;
                    height: 16px;
                    margin-right: 8px;
                    border-radius: 50%;
                }
                .token-symbol {
                }
            }
        }

        .price-block {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.6);

            .price {
                margin-right: 8px;
            }
            .refresh-icon {
                font-size: 12px;
                cursor: pointer;
                color: #1677ff;
            }
        }
    }
    .item-wrapper {
        margin-top: 30px;
    }
    .reconnect-wallet {
        margin-top: 10px;
        font-size: 16px;
        display: flex;
        justify-content: center;
    }
    .spacer {
        flex-grow: 1;
    }
    .bottom-block {
        display: flex;
        align-items: center;
        justify-content: center;

        .text {
            font-size: 14px;
            margin-right: 8px;

            .logo-img {
                height: 20px;
            }
        }
    }
`;

export default PaymentPage;
