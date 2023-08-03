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
        productId?: string
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
        const tokenSymbol: string = currentTokenConfig.symbol.includes("USDT") ? "USDT" : currentTokenConfig.symbol;
        // check & switch chain
        const currentChainId = await currentProvider.request({
            method: "eth_chainId",
            params: [],
        });
        if (currentChainId != chainId) {
            // switch chain
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
        let paymentReceiptId = "";
        if (isErc20) {
            if (!currentTokenConfig.contractAddr) {
                return Promise.reject("config not correct: no contract address");
            }
            if (!currentTokenConfig.decimals) {
                return Promise.reject("config not correct: no decimals");
            }
            const usdtContract = new ethers.Contract(currentTokenConfig.contractAddr, erc20Abi, signer);
            const sendValue = ethers.utils.parseUnits(`${value}`, currentTokenConfig.decimals);
            const tokenBalance = await usdtContract.balanceOf(fromAddr);

            if (sendValue.gte(tokenBalance)) {
                return Promise.reject(`no enough token(${currentTokenConfig.code}) in acccount: ${fromAddr}`);
            }
            tx = await usdtContract.transfer(toAddr, sendValue);
        } else {
            tx = await signer.sendTransaction(txParams);
            paymentReceiptId = `${BuyWithCrypto.appId}#${tx.hash}#${chainId}#${tokenSymbol}#${isErc20 ? 1 : 0}#${
                productId ?? ""
            }`;
        }

        try {
            await tx.wait(); // wait until transaction minted
            // save transaction to server
            const savedPaymentRecord = await RestService.savePaymentInfo(
                tx.hash,
                chainId,
                BuyWithCrypto.appId,
                isErc20,
                productId
            );
            return Promise.resolve(savedPaymentRecord.data);
        } catch (error) {
            return Promise.reject({
                receiptId: paymentReceiptId,
                errorMsg: "transaction not confirmed or saved failed, you can verify payment with receiptId later",
            });
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
