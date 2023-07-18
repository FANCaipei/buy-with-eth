import IframeVisibleHandler from "./IframeVisibleHandler";
import WalletInitHandler from "./WalletInitHandler";

const HandleMessage = msg => {
    switch (msg?.subType) {
        case "cambrian-wallet-ready":
            WalletInitHandler();
            break;

        case "cambrian-wallet-visible":
            IframeVisibleHandler(msg?.data);
            break;

        case "cambrian-wallet-chain-id-changed":
            if (window.cambrianWallet) {
                window.cambrianWallet.chainId = msg?.data;
            }
            break;

        case "cambrian-wallet-event":
            if (window.cambrianWallet) {
                if (msg?.data?.eventType) {
                    window.cambrianWallet.emit(msg.data.eventType, msg.data?.eventData);
                }
            }
            break;

        default:
            break;
    }
};

export default HandleMessage;
