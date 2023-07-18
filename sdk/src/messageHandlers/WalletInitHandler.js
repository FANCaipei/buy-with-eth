import { _CambrianWalletBack } from "../cambrianWallet";

const WalletInitHandler = () => {
    if (window._cambrianWalletBack) {
        window._cambrianWalletBack.isReady = true;
    }
};

export default WalletInitHandler;
