import WalletTypes from "./types/WalletTypes"

const EthereumProvider:{
    detectProviders: () => WalletTypes,
    getCurrentConnectedProvider: () => any
} = {
    detectProviders: (): WalletTypes => {
        if ((window as any).ethereum?.providerMap) {
            // multi wallet
            return {
                metamask: (window as any).ethereum.providerMap.get("MetaMask"),
                coinbase: (window as any).ethereum.providerMap.get("CoinbaseWallet"),
            };
        } else if ((window as any).ethereum?.isMetaMask) {
            // only metamask case
            return {
                metamask: (window as any).ethereum,
                coinbase: null
            };
        } else if ((window as any).ethereum?.isCoinbaseWallet) {
            // only coinbase case
            return {
                coinbase: (window as any).ethereum,
                metamask: null,
            };
        } else {
            return {
                metamask: null,
                coinbase: null
            };
        }
    },
    getCurrentConnectedProvider: () => {
        const connectedProviderType = localStorage.getItem('buywithcrypto-provider-type');
        if(!connectedProviderType){
            return null;
        }
        const availableProviders = EthereumProvider.detectProviders();
        switch (connectedProviderType) {
            case 'metamask':
                return availableProviders.metamask;
            case 'coinbase':
                return availableProviders.coinbase;
            default:
                return null;
        }
    }
}

export default EthereumProvider