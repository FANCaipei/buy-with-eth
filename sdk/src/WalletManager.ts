import { ethers } from "ethers";
import EthereumProvider from "./EthereumProvider";
import RestService from "./restService/RestService";
import BuyWithCrypto from "./BuyWithCrypto";
import erc20Abi from "./abiConfigs/erc20.json";

const WalletManager = {
    async connectWallet(provider: any, providerType: "metamask" | "coinbase"): Promise<string> {
        if (!provider) {
            return Promise.reject("no provider");
        }
        if (providerType === "metamask") {
            await provider.request({
                method: "wallet_requestPermissions",
                params: [
                    {
                        eth_accounts: {},
                    },
                ],
            });
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
    clearConnectInfo(): void {
        localStorage.removeItem("buywithcrypto-provider-type");
    },
    async requestTransfer(
        chainId: string /**in hex format */,
        value: number /**in eth */,
        fromAddr: string,
        toAddr: string,
        isErc20: boolean,
        productId?: string,
        onProgressChanged?: (progress: string) => void,
        extraInfo?: string
    ): Promise<any> {
        const currentProvider = EthereumProvider.getCurrentConnectedProvider();
        if (!currentProvider) {
            return Promise.reject("no selected provider");
        }
        const currentTokenConfig = (BuyWithCrypto.tokenConfigs ?? []).find(item => {
            if (item.chainId !== chainId) {
                return false;
            } else {
                if (isErc20) {
                    return item.type === "erc20";
                }
                return item.type === "origin";
            }
        });
        if (!currentTokenConfig?.symbol || currentTokenConfig?.symbol == "") {
            return Promise.reject("chain not support");
        }

        // check & switch chain
        const currentChainId = await currentProvider.request({
            method: "eth_chainId",
            params: [],
        });
        if (currentChainId != chainId) {
            // switch chain
            onProgressChanged?.("Switching chain");
            await currentProvider.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: chainId,
                    },
                ],
            });
        }
        //
        const valueInWei = ethers.utils.parseEther(`${value}`);
        const txParams = {
            from: fromAddr,
            to: toAddr,
            value: valueInWei,
            data: null,
        };
        const provider = new ethers.providers.Web3Provider(currentProvider, "any");
        const signer = provider.getSigner();

        let tx;
        if (isErc20) {
            if (!currentTokenConfig.contractAddr) {
                return Promise.reject("config not correct: no contract address");
            }
            if (!currentTokenConfig.decimals) {
                return Promise.reject("config not correct: no decimals");
            }
            const usdtContract = new ethers.Contract(currentTokenConfig.contractAddr, erc20Abi, signer);
            const sendValue = ethers.utils.parseUnits(`${value}`, currentTokenConfig.decimals);
            onProgressChanged?.("Verifying balance");
            const tokenBalance = await usdtContract.balanceOf(fromAddr);

            if (sendValue.gte(tokenBalance)) {
                return Promise.reject(`no enough token(${currentTokenConfig.code}) in acccount: ${fromAddr}`);
            }
            onProgressChanged?.("Paying");
            tx = await usdtContract.transfer(toAddr, sendValue);
        } else {
            onProgressChanged?.("Paying");
            tx = await signer.sendTransaction(txParams);
        }

        // tray save max 3 times
        try {
            onProgressChanged?.("Validating on chain");
            await tx.wait(); // wait until transaction minted
            // save transaction to server
            onProgressChanged?.("Saving payment info");
            const savedPaymentRecord = await RestService.savePaymentInfo(
                tx.hash,
                chainId,
                BuyWithCrypto.appId,
                isErc20,
                productId,
                extraInfo
            );
            return Promise.resolve(savedPaymentRecord.data);
        } catch (error) {
            try {
                onProgressChanged?.("Retrying save payment info first time");
                const savedPaymentRecord = await RestService.savePaymentInfo(
                    tx.hash,
                    chainId,
                    BuyWithCrypto.appId,
                    isErc20,
                    productId,
                    extraInfo
                );
                return Promise.resolve(savedPaymentRecord.data);
            } catch (error) {
                try {
                    onProgressChanged?.("Retrying save payment info 2nd time");
                    const savedPaymentRecord = await RestService.savePaymentInfo(
                        tx.hash,
                        chainId,
                        BuyWithCrypto.appId,
                        isErc20,
                        productId,
                        extraInfo
                    );
                    return Promise.resolve(savedPaymentRecord.data);
                } catch (error) {
                    const receiptId = error.data?.error?.receiptId;
                    return Promise.reject({
                        receiptId: receiptId,
                        errorMsg: "save payment info failed",
                    });
                }
            }
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
