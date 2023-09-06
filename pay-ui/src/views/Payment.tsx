import { Button, Divider, Input, Select, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { createGlobalStyle, styled } from "styled-components";
import { send } from "../messageManager/MessageManager";
import { Utils, ResponseErrorType } from "../common/Utils";
import RestService from "../common/restService/RestService";
import useUrlParamsConfig from "../common/golbalStates/urlParamsConfigState";
import SelfLogo from "../assets/images/logos/logo.svg";
import DotLoading from "../assets/images/icons/dot-loading.svg";

const PaymentPage = () => {
    // const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const paramsFromUrl = useUrlParamsConfig((state: any) => state.paramsFromUrl);
    const { state: params } = useLocation();
    const [payProgress, setPayProgress] = useState<string | null>();
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
    const [isFetchingPrice, setIsFetchingPrice] = useState<boolean>(false);
    const [isPaying, setIsPaying] = useState<boolean>(false);

    const [responseToOrigin, setResponseToOrigin] = useState(params?.responseToOrigin);
    const [responseToId, setResponseToId] = useState(params?.responseToId);

    const [targetAddress, setTargetAddress] = useState();
    const [logoUrl, setLogoUrl] = useState();

    const [paymentConfigParams, setPaymentConfigParams] = useState(params?.params ?? paramsFromUrl ?? {});
    const [preSetValueInUSD, setPreSetValueInUSD] = useState(paymentConfigParams?.valueInUSD);
    const [currencyTypeCode, setCurrencyTypeCode] = useState(paymentConfigParams?.defaultTokenCode);
    const [currencyPaymentConfig, setCurrencyPaymentConfig] = useState<any>();

    const [currentCurrencyPrice, setCurrentCurrencyPrice] = useState<any>();
    const getCurrentCurrencyPrice = useCallback(
        (currencyConfig: any) => {
            if (!currencyConfig?.symbol || currencyConfig?.symbol === "") {
                return;
            }
            setIsFetchingPrice(true);
            setCurrentCurrencyPrice(null);
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
                })
                .finally(() => {
                    setIsFetchingPrice(false);
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

    const [sendValue, setSendValue] = useState<string>();
    const onSendValueChange = useCallback((event: any) => {
        setSendValue(event?.target?.value);
    }, []);

    const totalInUSD = useCallback(() => {
        try {
            const result = parseFloat(sendValue ?? "") * currentCurrencyPrice;
            return isNaN(result) ? null : result.toFixed(2);
        } catch (error) {
            return null;
        }
    }, [sendValue, currentCurrencyPrice]);

    const clearConnectInfo = useCallback(() => {
        (window as any).buyWithCrypto.utils.walletManager.clearConnectInfo();
        navigate("/connect-wallet", { replace: true, state: params });
    }, [navigate, params]);

    const navToResult = useCallback(
        (success: boolean, receiptId: string) => {
            navigate("/result", {
                state: {
                    type: success ? "success" : "failed",
                    receiptId: receiptId,
                },
            });
        },
        [navigate]
    );

    const onPaymentProgressChanged = useCallback((currentProgress: string) => {
        setPayProgress(currentProgress);
    }, []);

    const pay = useCallback(async () => {
        setIsPaying(true);
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
                    paymentConfigParams?.productId,
                    onPaymentProgressChanged
                );
                console.log("request transfer ok: ", tx);
                send("buy-with-crypto-response", responseToId, tx, responseToOrigin);
                navToResult(true, tx.receiptId);
            } catch (error: any) {
                console.error(error);
                send(
                    "buy-with-crypto-response",
                    responseToId,
                    {
                        error: Utils.generateErrorMsg(ResponseErrorType.PaymentError, (error as any)?.message),
                    },
                    responseToOrigin
                );
                // messageApi.open({
                //     type: "error",
                //     content: error?.toString() ?? "",
                // });
                if (error?.receiptId) {
                    // receiptId generated, maybe the transaction not be confirmed
                    navToResult(false, error.receiptId);
                }
            }
            setPayProgress(null);
        }
        setIsPaying(false);
    }, [
        navigate,
        navToResult,
        onPaymentProgressChanged,
        params,
        targetAddress,
        sendValue,
        responseToId,
        responseToOrigin,
        currencyPaymentConfig,
        paymentConfigParams?.productId,
    ]);
    // const cancel = useCallback(() => {
    //     send(
    //         "buy-with-crypto-response",
    //         responseToId,
    //         {
    //             error: Utils.generateErrorMsg(ResponseErrorType.UserDenyPayment),
    //         },
    //         responseToOrigin
    //     );
    // }, [responseToId, responseToOrigin]);

    useEffect(() => {
        setResponseToOrigin(params?.responseToOrigin);
        setResponseToId(params?.responseToId);
    }, [params?.responseToOrigin, params?.responseToId]);

    useEffect(() => {
        console.log("state: ", params);
        const tempParams = params?.params ?? paramsFromUrl ?? {};
        setPaymentConfigParams(tempParams);
        setPreSetValueInUSD(tempParams.valueInUSD);
    }, [params, paramsFromUrl]);

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

        const cid = (window as any).buyWithCrypto.onReady(onPaySDKReady);
        if (cid) {
            return () => {
                (window as any).buyWithCrypto.cancelOnReadyCallback(cid);
            };
        }
    }, [navigate, paymentConfigParams, getCurrentCurrencyPrice]);

    // refresh price every minute
    useEffect(() => {
        const intervalId = setInterval(() => {
            getCurrentCurrencyPrice(currencyPaymentConfig);
        }, 60000);

        return () => {
            clearInterval(intervalId);
        };
    }, [getCurrentCurrencyPrice, currencyPaymentConfig]);

    return (
        <Spin spinning={isLoading} size="large">
            {/* {contextHolder} */}
            <StyledContainer>
                <GlobalStyle />

                <div className="logo-container">
                    <img className="logo-img" src={logoUrl} alt="" />
                    <Divider type="vertical" className="divider" />
                    <img className="logo-img" src={SelfLogo} alt="" />
                </div>
                <div className="token-selector-container">
                    <div className="token-selector">
                        <Select
                            size="large"
                            value={currencyTypeCode}
                            style={{ maxWidth: 180 }}
                            onChange={onCurrencyTypeChange}
                            disabled={isFetchingPrice}
                        >
                            {((window as any).buyWithCrypto.tokenConfigs ?? []).map((item: any) => (
                                <Select.Option value={item.code} key={item.code}>
                                    <div className="token-option">
                                        <img className="token-logo" src={item.iconUrl} alt="" />
                                        <span className="token-symbol">{item.symbol}</span>
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <Spin
                        spinning={isFetchingPrice}
                        indicator={<img src={DotLoading} alt="" width="80px" />}
                        // className="price-block-spin"
                    >
                        <div className="price-block">
                            <span className="price">
                                {currentCurrencyPrice == null ? "-" : `$${currentCurrencyPrice?.toFixed(4)}`}
                            </span>
                            <ReloadOutlined
                                className="refresh-icon"
                                onClick={() => getCurrentCurrencyPrice(currencyPaymentConfig)}
                            />
                        </div>
                    </Spin>
                </div>
                <div className="item-wrapper">
                    <Input
                        size="large"
                        addonBefore="Send To"
                        value={Utils.maskAddress(targetAddress ?? "")}
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
                    <div className="total-value-container">
                        <span className="label">Total (gas fee not counted):</span>
                        <span className="value">{totalInUSD() != null ? `$${totalInUSD()}` : "-"}</span>
                    </div>
                </div>
                <div className="item-wrapper">
                    {!currentCurrencyPrice && !isFetchingPrice ? (
                        <div className="no-price">Get price failed, please refresh price manually</div>
                    ) : null}

                    <Button
                        size="large"
                        type="primary"
                        onClick={pay}
                        style={{ width: "100%", marginTop: "20px" }}
                        disabled={!currentCurrencyPrice || !sendValue}
                        loading={isPaying}
                    >
                        {payProgress ? payProgress : "Pay"}
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
                    <Button type="link" onClick={clearConnectInfo} disabled={isPaying}>
                        Reconnect Wallet
                    </Button>
                </div>
                <div className="spacer"></div>
                <div className="bottom-block">
                    <span className="text">Powered by xxxx</span>
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
    height: 100%;

    .logo-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 50px;

        .divider {
            margin: 0 20px;
            height: 40px;
            background-color: rgba(0, 0, 0, 0.1);
        }

        .logo-img {
            width: 50px;
            /* height: 50px; */
            /* border-radius: 12px; */
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

        .ant-spin-container {
            display: flex;
            align-items: center;
            justify-content: center;
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
    .total-value-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
    }
    .item-wrapper {
        margin-top: 30px;

        .no-price {
            text-align: center;
            color: rgba(0, 0, 0, 0.45);
        }
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
        color: rgba(0, 0, 0, 0.45);

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
