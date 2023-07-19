import { IframeOrigin } from "./constant";
import InitOption from "./types/InitOption";
import Utils from "./utils";

class BuyWithCrypto{
    static appId: string;
    static appKey: string;
    static logoUrl: string;
    static targetAddr: string;
    static iframeEle: HTMLIFrameElement;
    //.. other configs

    static async init(option: InitOption){
        if(!option.appId || !option.appKey){
            Utils.throwError('No appId or appKey provided');
        }
        BuyWithCrypto.appId = option.appId;
        BuyWithCrypto.appKey = option.appKey;
        // TODO: get config with appId & appKey
        BuyWithCrypto.logoUrl='';
        BuyWithCrypto.targetAddr='0x6978De6532Cd2C94D47430C22B1bCddb53fB23aa';
        
    }

    static isReady(): boolean {
        if(!BuyWithCrypto.appId || !BuyWithCrypto.appKey){
            Utils.throwError('No appId or appKey provided');
            return false;
        }

        return true;
    }

    static connectWallet() {
        if(!BuyWithCrypto.isReady()){
            return;
        }
        //
    }

    static initUI() {
        if(BuyWithCrypto.iframeEle){
            return;
        }
        else{
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

            const paymentIframe = document.createElement("iframe");
            paymentIframe.src = `${IframeOrigin}?from=${encodeURIComponent(window.location.origin)}`;
            paymentIframe.style.position = 'fixed';
            paymentIframe.style.left = '0';
            paymentIframe.style.top = '0';
            paymentIframe.style.width = '0';
            paymentIframe.style.height = '0';
            paymentIframe.style.zIndex = '9999';
            paymentIframe.style.border = 'none';
            paymentIframe.style.borderWidth = '0';

            document.body.appendChild(paymentIframe);
            BuyWithCrypto.iframeEle = paymentIframe;
        }
    }
    static showPayUI() {
        BuyWithCrypto.iframeEle.style.height = "100%";
        BuyWithCrypto.iframeEle.style.width = "100%";
        BuyWithCrypto.iframeEle.style.animation = "cambrianWalletShow 0.2s forwards";
    }
    static hidePayUI() {
        BuyWithCrypto.iframeEle.style.animation = "cambrianWalletHide 0.2s forwards";
        setTimeout(() => {
            BuyWithCrypto.iframeEle.style.height = "0";
            BuyWithCrypto.iframeEle.style.width = "0";
        }, 300);
    }

}

export default BuyWithCrypto;