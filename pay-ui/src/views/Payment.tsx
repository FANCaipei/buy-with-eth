import { Button, Divider, Input, Select, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { createGlobalStyle, styled } from "styled-components";
import { send } from "../messageManager/MessageManager";
import { Utils, ResponseErrorType } from "../common/Utils";
import RestService from "../common/restService/RestService";
import useUrlParamsConfig from "../common/golbalStates/urlParamsConfigState";
import SelfLogo from "../assets/images/logos/logo.png";
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
    const [paymentExtraInfo, setPaymentExtraInfo] = useState(paymentConfigParams?.extraInfo);
    const [hideProjectLogo, setHideProjectLogo] = useState(paramsFromUrl?.hideProjectLogo);

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
            const currencyConfig = (window as any).OcelotPay.tokenConfigs.find((item: any) => item.code === selectCode);
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
        (window as any).OcelotPay.utils.walletManager.clearConnectInfo();
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
        const currentProvider = (window as any).OcelotPay.utils.ethereumProvider.getCurrentConnectedProvider();
        if (!currentProvider) {
            // nav to connect wallet with params
            navigate("/connect-wallet", { replace: true, state: params });
        }
        if (!currencyPaymentConfig) {
            console.error("not payment config");
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
            fromAddr = await (window as any).OcelotPay.utils.walletManager.getAccountWithCurrentProvider();
        } catch (error) {
            goConnectWallet();
        }

        if (!fromAddr) {
            goConnectWallet();
        } else {
            // transaction
            try {
                const tx = await (window as any).OcelotPay.utils.walletManager.requestTransfer(
                    currencyPaymentConfig.chainId,
                    sendValue,
                    fromAddr,
                    targetAddress,
                    currencyPaymentConfig?.symbol?.includes("USDT"),
                    paymentConfigParams?.productId,
                    onPaymentProgressChanged,
                    paymentExtraInfo
                );
                // console.log("request transfer ok: ", tx);
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
        paymentExtraInfo,
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
        setPaymentExtraInfo(paymentConfigParams?.extraInfo);
    }, [paymentConfigParams?.extraInfo]);

    useEffect(() => {
        setHideProjectLogo(paramsFromUrl?.hideProjectLogo);
    }, [paramsFromUrl?.hideProjectLogo]);

    useEffect(() => {
        console.log("payment params: ", paymentConfigParams);
        setIsLoading(true);
        const onPaySDKReady = () => {
            setTargetAddress((window as any).OcelotPay.targetAddr);
            setLogoUrl((window as any).OcelotPay.logoUrl);
            const AvailableCurrencyTypes: Array<any> = (window as any).OcelotPay.tokenConfigs ?? [];
            const currencyConfig =
                AvailableCurrencyTypes.find(item => item.code === paymentConfigParams?.defaultTokenCode) ??
                AvailableCurrencyTypes.find(item => item.isDefault) ??
                AvailableCurrencyTypes[0];
            setCurrencyPaymentConfig(currencyConfig);
            setCurrencyTypeCode(currencyConfig?.code);
            getCurrentCurrencyPrice(currencyConfig);
            setIsLoading(false);
        };

        const cid = (window as any).OcelotPay.onReady(onPaySDKReady);
        if (cid) {
            return () => {
                (window as any).OcelotPay.cancelOnReadyCallback(cid);
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
                    {hideProjectLogo ? null : <img className="logo-img" src={logoUrl} alt="" />}
                    {/* <img className="logo-img" src={logoUrl} alt="" /> */}
                    {/* <Divider type="vertical" className="divider" /> */}
                    {hideProjectLogo ? null : <Divider type="vertical" className="divider" />}
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
                            {((window as any).OcelotPay.tokenConfigs ?? []).map((item: any) => (
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
                    <span className="text">
                        Powered by{" "}
                        <a target="_blank" rel="noreferrer" href="https://ocelotpay.com">
                            Ocelot Pay
                        </a>
                    </span>
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
            width: 20px;
            height: 20px;
            margin-right: 10px;
            border-radius: 50%;
        }
        .token-symbol {
            font-weight: 500;
            color: var(--apple-text-primary);
        }
    }

    .ant-spin-nested-loading {
        height: 100%;

        .ant-spin-container {
            height: 100%;
        }
    }

    .ant-select {
        .ant-select-selector {
            border-radius: var(--apple-radius-sm) !important;
            border-color: var(--apple-border) !important;
            transition: all var(--apple-duration-normal) var(--apple-ease) !important;
            height: 44px !important;
            padding: 0 12px !important;

            &:hover {
                border-color: var(--apple-blue) !important;
            }
        }

        &.ant-select-focused .ant-select-selector {
            border-color: var(--apple-blue) !important;
            box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.15) !important;
        }
    }

    .ant-input-affix-wrapper,
    .ant-input {
        border-radius: var(--apple-radius-sm) !important;
        border-color: var(--apple-border) !important;
        transition: all var(--apple-duration-normal) var(--apple-ease) !important;
        height: 44px !important;
        font-size: 15px !important;

        &:hover {
            border-color: var(--apple-gray-500) !important;
        }

        &:focus,
        &-focused {
            border-color: var(--apple-blue) !important;
            box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.15) !important;
        }
    }

    .ant-input-group-addon {
        border-radius: var(--apple-radius-sm) 0 0 var(--apple-radius-sm) !important;
        border-color: var(--apple-border) !important;
        background: var(--apple-gray-200) !important;
        font-weight: 500 !important;
        color: var(--apple-text-secondary) !important;
        font-size: 14px !important;
    }

    .ant-input:disabled {
        background: var(--apple-gray-200) !important;
        color: var(--apple-text-secondary) !important;
    }

    .ant-btn-primary {
        background: var(--apple-blue) !important;
        border: none !important;
        border-radius: var(--apple-radius-sm) !important;
        height: 48px !important;
        font-size: 16px !important;
        font-weight: 500 !important;
        letter-spacing: -0.01em !important;
        transition: all var(--apple-duration-normal) var(--apple-ease) !important;
        box-shadow: 0 1px 3px rgba(0, 113, 227, 0.3) !important;

        &:hover {
            background: var(--apple-blue-hover) !important;
            box-shadow: 0 2px 8px rgba(0, 113, 227, 0.4) !important;
            transform: translateY(-1px);
        }

        &:active {
            background: var(--apple-blue-active) !important;
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0, 113, 227, 0.3) !important;
        }

        &:disabled {
            background: var(--apple-gray-400) !important;
            box-shadow: none !important;
            transform: none !important;
            opacity: 0.7;
        }
    }

    .ant-btn-link {
        color: var(--apple-blue) !important;
        font-weight: 500 !important;
        transition: all var(--apple-duration-fast) var(--apple-ease) !important;

        &:hover {
            color: var(--apple-blue-hover) !important;
        }
    }

    .ant-divider-vertical {
        border-color: var(--apple-border-light) !important;
        border-width: 1.5px !important;
    }
`;

const StyledContainer = styled.div.attrs({ className: "payment-page" })`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 32px 28px 20px;
    height: 100%;
    animation: apple-fade-in var(--apple-duration-slow) var(--apple-ease);

    .logo-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 40px;

        .divider {
            margin: 0 16px;
            height: 32px;
            border-color: var(--apple-border-light);
        }

        .logo-img {
            width: 44px;
            height: 44px;
            border-radius: var(--apple-radius-sm);
            object-fit: contain;
            transition: transform var(--apple-duration-normal) var(--apple-ease);

            &:hover {
                transform: scale(1.05);
            }
        }
    }

    .token-selector-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;

        .token-selector {
            flex: 1;
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
            font-size: 15px;
            color: var(--apple-text-secondary);
            font-weight: 500;

            .price {
                margin-right: 8px;
                font-variant-numeric: tabular-nums;
            }

            .refresh-icon {
                font-size: 14px;
                cursor: pointer;
                color: var(--apple-blue);
                padding: 6px;
                border-radius: 50%;
                transition: all var(--apple-duration-normal) var(--apple-ease);

                &:hover {
                    background: rgba(0, 113, 227, 0.1);
                    transform: rotate(180deg);
                }

                &:active {
                    transform: rotate(180deg) scale(0.9);
                }
            }
        }
    }

    .total-value-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 15px;
        padding: 16px 20px;
        background: var(--apple-gray-200);
        border-radius: var(--apple-radius-sm);

        .label {
            color: var(--apple-text-secondary);
            font-weight: 500;
        }

        .value {
            font-weight: 600;
            color: var(--apple-text-primary);
            font-size: 18px;
            font-variant-numeric: tabular-nums;
        }
    }

    .item-wrapper {
        margin-top: 20px;

        .no-price {
            text-align: center;
            color: var(--apple-text-tertiary);
            font-size: 14px;
            padding: 12px;
            background: rgba(255, 149, 0, 0.08);
            border-radius: var(--apple-radius-sm);
            border: 1px solid rgba(255, 149, 0, 0.2);
        }
    }

    .reconnect-wallet {
        margin-top: 12px;
        font-size: 14px;
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
        padding-top: 16px;
        border-top: 1px solid var(--apple-border-light);

        .text {
            font-size: 13px;
            color: var(--apple-text-tertiary);
            font-weight: 500;

            a {
                color: var(--apple-blue);
                text-decoration: none;
                transition: color var(--apple-duration-fast) var(--apple-ease);

                &:hover {
                    color: var(--apple-blue-hover);
                }
            }
        }
    }
`;

export default PaymentPage;
