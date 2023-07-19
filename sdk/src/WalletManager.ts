import EthereumProvider from "./EthereumProvider";

class WalletManager {
    static async connectWallet(provider: any): Promise<string> {
        if(!provider){
            return Promise.reject('no provider');
        }
        const account = await provider.request({
            // eth_requestAccounts not compatible with WalletConnect; at the same time eth_accounts is decrypted by metamask & coinbase
            method: provider.isWalletConnect ? "eth_accounts" : "eth_requestAccounts",
        });
        const address = account?.[0];
        if(address){
            return Promise.resolve(address);
        }
        else{
            return Promise.reject('get account failed');
        }
    }
    static async requestTransfer(value: string): Promise<any> {
        const currentProvider = EthereumProvider.getCurrentConnectedProvider();
        if(!currentProvider){
            return Promise.reject('no selected provider')
        }
        const params = [
            {
            //   from: '0xb60e8dd61c5d32be8058bb8eb970870f07233155',
              to: '0xd46e8dd67c5d32be8058bb8eb970870f07244567',
              gas: '0x76c0', // 30400
              gasPrice: '0x9184e72a000', // 10000000000000
              value: '0x9184e72a', // 2441406250
              data:
                '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
            },
        ];
        const tx = await currentProvider.request({
            method: 'eth_sendTransaction',
            params,
        });
        console.log(tx);
    }
}

export default WalletManager;