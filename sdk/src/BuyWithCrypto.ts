import EthereumProvider from "./EthereumProvider";
import WalletManager from "./WalletManager";
import { IframeOrigin } from "./constant";
import InitOption from "./types/InitOption";
import Utils from "./utils";
import MessageIdManager from "./messageHandlers/MessageIdManager";
import RestService from "./restService/RestService";
import FirebaseManager from "./firebase/firebaseManager";
import { nanoid } from "nanoid";

interface PaymentConfig {
    valueInUSD?: number;
    defaultTokenCode?: "eth" | "matic" | "usdt-eth" | "usdt-polygon";
    productId?: string;
    extraInfo?: string;
}

const BuyWithCrypto: {
    appId?: string;
    tokenConfigs?: Array<any>;
    isFetchingTokenConfigOrFailed: boolean;
    isFetchingAppConfigOrFailed: boolean;
    // appKey?: string;
    logoUrl?: string;
    targetAddr?: string;
    iframeEle?: HTMLIFrameElement;
    init: (option: InitOption) => void;
    utils: {
        walletManager: typeof WalletManager;
        ethereumProvider: typeof EthereumProvider;
    };
    isReady: () => boolean;
    onReady: (callback: Function) => string | null;
    cancelOnReadyCallback: (cid: string) => void;
    readyCallbacks: { [key: string]: Function | null };
    connectWallet: (walletType: "metamask" | "coinbase") => void;
    initUI: () => void;
    showPayUI: () => void;
    hidePayUI: () => void;
    getTokenConfigs: () => void;
    getTokenPriceInUSD: (tokenSymbol: string) => Promise<number>;
    generatePaymentUrl: (config: PaymentConfig) => string;
    checkPayUIIframeReady: (iframeEle: HTMLIFrameElement) => Promise<boolean>;
    request: (
        { method, params }: { method: string; params: PaymentConfig },
        iframeEle: HTMLIFrameElement
    ) => Promise<any>;
} = {
    utils: {
        walletManager: WalletManager,
        ethereumProvider: EthereumProvider,
    },
    isFetchingTokenConfigOrFailed: true,
    isFetchingAppConfigOrFailed: true,
    readyCallbacks: {},

    init: async (option: InitOption): Promise<boolean> => {
        if (!option.appId) {
            Utils.throwError("appId must be provided");
        }
        BuyWithCrypto.appId = option.appId;
        // get config with appId
        try {
            BuyWithCrypto.isFetchingAppConfigOrFailed = true;
            const configData = await FirebaseManager.getAppConfig(option.appId);
            if (!configData?.paymentAddress) {
                Utils.throwError("app config not correct, please verify your app config");
                return Promise.reject();
            }
            BuyWithCrypto.isFetchingAppConfigOrFailed = false;
            BuyWithCrypto.targetAddr = configData.paymentAddress;
            BuyWithCrypto.logoUrl = configData.logoUrl;
            // other configs here

            // run readyCallbacks when ready
            const runReadyCallbacks = () => {
                if (BuyWithCrypto.isReady()) {
                    const cbs = Object.keys(BuyWithCrypto.readyCallbacks).map(key => BuyWithCrypto.readyCallbacks[key]);
                    cbs.forEach(callback => {
                        callback?.();
                    });
                    return;
                }
                setTimeout(() => {
                    runReadyCallbacks();
                }, 100);
            };
            runReadyCallbacks();
        } catch (error) {
            Utils.throwError("get app config failed");
            return Promise.reject();
        }
    },

    isReady(): boolean {
        if (BuyWithCrypto.isFetchingAppConfigOrFailed || BuyWithCrypto.isFetchingTokenConfigOrFailed) {
            return false;
        }

        return true;
    },

    async getTokenConfigs() {
        BuyWithCrypto.isFetchingTokenConfigOrFailed = true;
        try {
            let configs = (await RestService.getTokenConfig()).data ?? [];
            if (typeof configs === "string") {
                configs = JSON.parse(configs);
            }
            BuyWithCrypto.tokenConfigs = configs;
            BuyWithCrypto.isFetchingTokenConfigOrFailed = false;
        } catch (error) {
            Utils.throwError("get app config failed");
            BuyWithCrypto.tokenConfigs = [];
        }
    },
    async getTokenPriceInUSD(tokenSymbol: string): Promise<number> {
        try {
            const res = await RestService.getCryptoPrice(tokenSymbol);
            if (res?.data?.data?.amount) {
                return res.data.data.amount;
            } else {
                return Promise.reject();
            }
        } catch (error) {
            return Promise.reject();
        }
    },

    connectWallet(walletType: "metamask" | "coinbase") {
        if (!BuyWithCrypto.isReady()) {
            return;
        }
        //
    },

    onReady(callback: Function): string | null {
        if (BuyWithCrypto.isReady()) {
            callback();
            return null;
        }
        // const timeoutID = window.setTimeout(() => {
        //     BuyWithCrypto.onReady(callback);
        // }, 100);
        const cid: string = nanoid(8);
        BuyWithCrypto.readyCallbacks[cid] = callback;
        return cid;
    },

    cancelOnReadyCallback(cid: string): void {
        if (!BuyWithCrypto.readyCallbacks[cid]) {
            return;
        } else {
            BuyWithCrypto.readyCallbacks[cid] = null;
        }
    },

    // ui controllers
    initUI() {
        if (!BuyWithCrypto.appId) {
            Utils.throwError("app id not set, please call init first");
            return;
        }
        if (BuyWithCrypto.iframeEle) {
            return;
        } else {
            const animationStyle = document.createElement("style");
            animationStyle.innerText = `
                @keyframes paymentIframeShow {
                    from {
                        transform: scale(0);
                    }
                    to {
                        transform: scale(1);
                    }
                }

                @keyframes paymentIframeHide {
                    from {
                        transform: scale(1);
                    }
                    to {
                        transform: scale(0);
                    }
                }
            `;
            document.body.appendChild(animationStyle);

            const encodedParams = encodeURIComponent(JSON.stringify({ appId: BuyWithCrypto.appId }));
            const paymentIframe = document.createElement("iframe");
            paymentIframe.src = `${IframeOrigin}?from=${encodeURIComponent(
                window.location.origin
            )}&params=${encodedParams}`;
            paymentIframe.style.position = "fixed";
            paymentIframe.style.left = "0";
            paymentIframe.style.top = "0";
            paymentIframe.style.width = "0";
            paymentIframe.style.height = "0";
            paymentIframe.style.zIndex = "9999";
            paymentIframe.style.border = "none";
            paymentIframe.style.borderWidth = "0";

            document.body.appendChild(paymentIframe);
            BuyWithCrypto.iframeEle = paymentIframe;
        }
    },
    showPayUI() {
        BuyWithCrypto.iframeEle.style.height = "100%";
        BuyWithCrypto.iframeEle.style.width = "100%";
        BuyWithCrypto.iframeEle.style.animation = "cambrianWalletShow 0.2s forwards";
    },
    hidePayUI() {
        BuyWithCrypto.iframeEle.style.animation = "cambrianWalletHide 0.2s forwards";
        setTimeout(() => {
            BuyWithCrypto.iframeEle.style.height = "0";
            BuyWithCrypto.iframeEle.style.width = "0";
        }, 300);
    },
    generatePaymentUrl(config: PaymentConfig): string | null {
        if (config.productId && config.productId.includes("#")) {
            console.error(`product id should not contain '#' `);
            return null;
        }
        if (!BuyWithCrypto.appId) {
            return null;
        }
        try {
            const paramObj = {
                appId: BuyWithCrypto.appId,
            };
            if (config.valueInUSD) {
                (paramObj as any).valueInUSD = config.valueInUSD;
            }
            if (config.defaultTokenCode) {
                (paramObj as any).defaultTokenCode = config.defaultTokenCode;
            }
            if (config.productId) {
                (paramObj as any).productId = config.productId;
            }

            const encodedParams = encodeURIComponent(JSON.stringify(paramObj));
            return `${IframeOrigin}/payment?params=${encodedParams}`;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    async checkPayUIIframeReady(iframeEle: HTMLIFrameElement): Promise<boolean> {
        if (!iframeEle) {
            return Promise.reject("No iframe element provided, please generatePaymentUrl and apply it to iframe first");
        }
        if (!iframeEle.contentWindow) {
            return Promise.reject("Iframe content window not detected");
        }
        if (iframeEle.contentWindow) {
            const currentMsgId = MessageIdManager.id;

            const result = new Promise<boolean>((resolve, reject) => {
                const responseHandler = event => {
                    if (event?.origin === IframeOrigin && event?.data?.type === "buy-with-crypto") {
                        if (event?.data?.subType === "check-ready-response" && event?.data?.respTo === currentMsgId) {
                            if (event?.data?.data?.isReady) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                            // remove current event listener
                            window.removeEventListener("message", responseHandler);
                        }
                    }
                };
                window.addEventListener("message", responseHandler);

                // reject as false if timeout; no complex process so set 300 ms as max time
                setTimeout(() => {
                    reject("request pay ui ready state timeout");
                    window.removeEventListener("message", responseHandler);
                }, 300);
            });

            iframeEle.contentWindow.postMessage(
                {
                    type: "buy-with-crypto",
                    subType: "check-ready-request",
                    requestId: currentMsgId,
                },
                IframeOrigin
            );

            return result;
        }
    },
    async request({ method, params }, iframeEle: HTMLIFrameElement): Promise<any> {
        if (!iframeEle) {
            return Promise.reject("No iframe element provided, please generatePaymentUrl and apply it to iframe first");
        }
        if (!iframeEle.contentWindow) {
            return Promise.reject("Iframe content window not detected");
        }
        try {
            const isUIReady = await BuyWithCrypto.checkPayUIIframeReady(iframeEle);
            if (!isUIReady) {
                return Promise.reject("Payment UI not ready");
            }
        } catch (error) {
            return Promise.reject("Payment UI not ready");
        }
        if (iframeEle.contentWindow) {
            const currentMsgId = MessageIdManager.id;

            const result = new Promise((resolve, reject) => {
                const responseHandler = event => {
                    if (event?.origin === IframeOrigin && event?.data?.type === "buy-with-crypto") {
                        if (
                            event?.data?.subType === "buy-with-crypto-response" &&
                            event?.data?.respTo === currentMsgId
                        ) {
                            if (event?.data?.data?.error) {
                                reject(event?.data?.data?.error);
                            } else {
                                resolve(event?.data?.data);
                            }
                            // remove current event listener
                            window.removeEventListener("message", responseHandler);
                        }
                    }
                };
                window.addEventListener("message", responseHandler);
            });

            iframeEle.contentWindow.postMessage(
                {
                    type: "buy-with-crypto",
                    subType: "buy-with-crypto-request",
                    requestId: currentMsgId,
                    data: {
                        method: method,
                        params: params,
                    },
                },
                IframeOrigin
            );

            return result;
        }
    },
};

export default BuyWithCrypto;
