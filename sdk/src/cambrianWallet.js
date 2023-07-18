import EventEmitter from "events";
import { WalletOrigin } from "./constant";
import HandleMessage from "./messageHandlers/HandleMessage";
import MessageIdManager from "./messageHandlers/MessageIdManager";
import Utils from "./utils";

class _CambrianWalletBack {
    static isReady = false;
    static iframeEle;
    static iconUrl;
    static init() {
        window.addEventListener("message", event => {
            if (event?.origin === WalletOrigin && event?.data?.type === "cambrian-wallet") {
                // console.log("get message:");
                // console.log(event);
                // init all type event
                HandleMessage(event.data);
            }
        });
    }
    static showWallet() {
        window._cambrianWalletBack.iframeEle.style.height = "100%";
        window._cambrianWalletBack.iframeEle.style.width = "100%";
        window._cambrianWalletBack.iframeEle.style.animation = "cambrianWalletShow 0.2s forwards";
    }
    static hideWallet() {
        window._cambrianWalletBack.iframeEle.style.animation = "cambrianWalletHide 0.2s forwards";
        setTimeout(() => {
            window._cambrianWalletBack.iframeEle.style.height = "0";
            window._cambrianWalletBack.iframeEle.style.width = "0";
        }, 300);
    }

    static request({ method, params }) {
        if (window._cambrianWalletBack?.iframeEle?.contentWindow) {
            const currentMsgId = MessageIdManager.id;

            const result = new Promise((resolve, reject) => {
                const responseHandler = event => {
                    if (event?.origin === WalletOrigin && event?.data?.type === "cambrian-wallet") {
                        if (
                            event?.data?.subType === "cambrian-wallet-response" &&
                            event?.data?.respTo === currentMsgId
                        ) {
                            // console.warn("received cambrian-wallet response: ", event?.data?.data);
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

            if (!window._cambrianWalletBack?.iconUrl) {
                window._cambrianWalletBack.iconUrl = Utils.getCurrentIcon();
            }

            window._cambrianWalletBack.iframeEle.contentWindow.postMessage(
                {
                    type: "cambrian-wallet",
                    subType: "cambrian-wallet-request",
                    requestId: currentMsgId,
                    iconUrl: window._cambrianWalletBack.iconUrl,
                    data: {
                        method: method,
                        params: params,
                    },
                },
                WalletOrigin
            );

            return result;
        }
    }
}

//extends ethers.providers.ExternalProvider
class CambrianWallet extends EventEmitter {
    isCambrianWallet = true;
    chainId = "";
    constructor() {
        super();
    }

    // with request means support EIP-1193
    request({ method, params }) {
        return window._cambrianWalletBack.request({ method, params });
    }
}

export { _CambrianWalletBack, CambrianWallet };
