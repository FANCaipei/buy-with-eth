import { WalletOrigin } from "./constant";
import { _CambrianWalletBack, CambrianWallet } from "./cambrianWallet";

window._cambrianWalletBack = _CambrianWalletBack;
window._cambrianWalletBack.init();

const animationStyle = document.createElement("style");
animationStyle.innerText = `
    @keyframes cambrianWalletShow {
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }

    @keyframes cambrianWalletHide {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(0);
        }
    }
`;
document.body.appendChild(animationStyle);

const walletIframe = document.createElement("iframe");
walletIframe.src = `${WalletOrigin}?from=${encodeURIComponent(window.location.origin)}`;
walletIframe.style = `
    position: fixed;
    left:0;
    top:0;
    width: 0;
    height: 0;
    z-index: 9999;
    border: none;
    border-width: 0;
`;
document.body.appendChild(walletIframe);

window._cambrianWalletBack.iframeEle = walletIframe;

window.cambrianWallet = new CambrianWallet();
