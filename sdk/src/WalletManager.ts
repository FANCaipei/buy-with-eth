import { BigNumber, ethers } from "ethers";
import EthereumProvider from "./EthereumProvider";

class WalletManager {
    static async connectWallet(provider: any, providerType: 'metamask' | 'coinbase'): Promise<string> {
        if(!provider){
            return Promise.reject('no provider');
        }
        const account = await provider.request({
            // eth_requestAccounts not compatible with WalletConnect; at the same time eth_accounts is decrypted by metamask & coinbase
            method: provider.isWalletConnect ? "eth_accounts" : "eth_requestAccounts",
        });
        const address = account?.[0];
        if(address){
            localStorage.setItem('buywithcrypto-provider-type', providerType);
            return Promise.resolve(address);
        }
        else{
            return Promise.reject('get account failed');
        }
    }
    static async requestTransfer(value: number /**in eth */, fromAddr: string, toAddr: string): Promise<any> {
        const currentProvider = EthereumProvider.getCurrentConnectedProvider();
        if(!currentProvider){
            return Promise.reject('no selected provider')
        }
        const valueInWei = ethers.utils.parseEther(`${value}`).toHexString();
        console.log('send value: ', valueInWei);
        const params = [
            {
              from: fromAddr,
              to: toAddr,
            //   gas: '0x76c0', // 30400
            //   gasPrice: '0x9184e72a000', // 10000000000000
              value: valueInWei,
              data: null,
            },
        ];
        const tx = await currentProvider.request({
            method: 'eth_sendTransaction',
            params,
        });
        console.log(tx);
        // TODO: save transaction to server
    }
}

export default WalletManager;