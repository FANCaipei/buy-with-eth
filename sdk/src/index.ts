import WalletManager from "./WalletManager";
import BuyWithCrypto from "./BuyWithCrypto";
import EthereumProvider from "./EthereumProvider";

BuyWithCrypto.utils = {
    walletManager: WalletManager,
    ethereumProvider: EthereumProvider,
};
(window as any).buyWithCrypto = BuyWithCrypto;
