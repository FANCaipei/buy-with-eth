import { ethers } from "ethers";
import EthereumProvider from "./EthereumProvider";

const WalletManager = {
    async connectWallet(provider: any, providerType: "metamask" | "coinbase"): Promise<string> {
        if (!provider) {
            return Promise.reject("no provider");
        }
        const account = await provider.request({
            // eth_requestAccounts not compatible with WalletConnect; at the same time eth_accounts is decrypted by metamask & coinbase
            method: provider.isWalletConnect ? "eth_accounts" : "eth_requestAccounts",
        });
        const address = account?.[0];
        if (address) {
            localStorage.setItem("buywithcrypto-provider-type", providerType);
            return Promise.resolve(address);
        } else {
            return Promise.reject("get account failed");
        }
    },
    async requestTransfer(value: number /**in eth */, fromAddr: string, toAddr: string): Promise<any> {
        const currentProvider = EthereumProvider.getCurrentConnectedProvider();
        if (!currentProvider) {
            return Promise.reject("no selected provider");
        }
        const valueInWei = ethers.utils.parseEther(`${value}`);
        console.log("send value: ", valueInWei);
        // const params = [
        //     {
        //         from: fromAddr,
        //         to: toAddr,
        //         //   gas: '0x76c0', // 30400
        //         //   gasPrice: '0x9184e72a000', // 10000000000000
        //         value: valueInWei,
        //         data: null,
        //     },
        // ];
        // const tx = await currentProvider.request({
        //     method: "eth_sendTransaction",
        //     params,
        // });
        // console.log(tx);

        const txParams = {
            from: fromAddr,
            to: toAddr,
            //   gas: '0x76c0', // 30400
            //   gasPrice: '0x9184e72a000', // 10000000000000
            value: valueInWei,
            data: null,
        };
        const provider = new ethers.providers.Web3Provider(currentProvider, "any");
        const signer = provider.getSigner();
        const tx = await signer.sendTransaction(txParams);
        try {
            const receipt = tx.wait();

            console.log("recep: ", receipt);
            // TODO: save transaction to server
            return Promise.resolve(receipt);
        } catch (error) {
            return Promise.reject(
                "transaction not confirmed, if success in wallet, please send the transaction id to support"
            );
        }
    },
    async getAccountWithCurrentProvider(): Promise<string> {
        const provider = EthereumProvider.getCurrentConnectedProvider();
        if (!provider) {
            return Promise.reject("no provider");
        }
        const account = await provider.request({
            // eth_requestAccounts not compatible with WalletConnect; at the same time eth_accounts is decrypted by metamask & coinbase
            method: provider.isWalletConnect ? "eth_accounts" : "eth_requestAccounts",
        });
        const address = account?.[0];
        if (address) {
            return Promise.resolve(address);
        } else {
            return Promise.reject("get account failed");
        }
    },
};

export default WalletManager;
