import * as logger from "firebase-functions/logger";
import { BigNumber, ethers } from "ethers";
import axios from "axios";

const rpcUrlConfig: { [key: string]: string } = {
    "0x1": "https://mainnet.infura.io/v3/56f3c243604845ea85dbdb42cf8f6ce3",
    "0x89": "https://polygon-mainnet.infura.io/v3/56f3c243604845ea85dbdb42cf8f6ce3",
    // testnets
    "0xaa36a7": "https://sepolia.infura.io/v3/56f3c243604845ea85dbdb42cf8f6ce3", // sepolia
};

const nativeTokenSymbols: { [key: string]: string } = {
    "0x1": "ETH",
    "0x89": "MATIC",
    "0xaa36a7": "SepoliaETH",
};

const usdtInputValueDecodeFns: { [key: string]: (inputData: string) => { toAddr: string; value: number } } = {
    "0x1": (inputData: string): { toAddr: string; value: number } => {
        if (!inputData || inputData == "") {
            return {
                toAddr: "",
                value: -1,
            };
        }
        const transferInputAbi: any = [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
        ];
        const decimals = 6;
        const result = ethers.utils.defaultAbiCoder.decode(transferInputAbi, ethers.utils.hexDataSlice(inputData, 4));

        const toAddr = result["_to"];
        const value = parseFloat(ethers.utils.formatUnits(result["_value"], decimals));

        return {
            toAddr: toAddr,
            value: value,
        };
    },
    "0x89": (inputData: string): { toAddr: string; value: number } => {
        if (!inputData || inputData == "") {
            return {
                toAddr: "",
                value: -1,
            };
        }
        const transferInputAbi: any = [
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ];
        const decimals = 6;
        const result = ethers.utils.defaultAbiCoder.decode(transferInputAbi, ethers.utils.hexDataSlice(inputData, 4));

        const toAddr = result[0] ?? "";
        const value = parseFloat(ethers.utils.formatUnits(result[1] ?? BigNumber.from(0), decimals));

        return {
            toAddr: toAddr,
            value: value,
        };
    },
};

const getTokenPrice = async (cryptoSymbol: string): Promise<number | null> => {
    const { data } = await axios.get<any>(`https://api.coinbase.com/v2/prices/${cryptoSymbol}-USD/spot`, {
        headers: {
            Accept: "application/json",
        },
    });
    const p = parseFloat(data?.data?.amount);
    return isNaN(p) ? null : p;
};

/**
 * @param rpcUrl
 * @param txHash
 * @returns Returns the transaction with hash or null if the transaction is unknown.
 */
const getTransactionDetails = async (
    rpcUrl: string,
    txHash: string,
    isErc20: boolean,
    chainId: string
): Promise<{
    receiveAddress: string;
    value: number;
    currentPrice: number;
    valueInUSD: number;
}> => {
    const result = {
        receiveAddress: "",
        value: -1,
        currentPrice: -1,
        valueInUSD: -1,
        chainId: chainId,
    };

    try {
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const queryResult = await Promise.allSettled([
            provider.getTransaction(txHash),
            getTokenPrice(isErc20 ? "USDT" : nativeTokenSymbols[chainId]),
        ]);
        const txInfo = queryResult[0]?.status === "fulfilled" ? queryResult[0].value : null;
        const price = queryResult[1]?.status === "fulfilled" ? queryResult[1].value : null;

        if (!txInfo) {
            return Promise.reject("Transaction not exist or has not been mined");
        }

        // extract target address
        result.receiveAddress = txInfo.to || "";
        // extract value
        result.value = parseFloat(ethers.utils.formatEther(txInfo.value));
        if (isErc20) {
            // extract target address & value from input
            const decodeResult = usdtInputValueDecodeFns[chainId](txInfo.data);
            result.receiveAddress = decodeResult.toAddr;
            result.value = decodeResult.value;
        }

        result.currentPrice = price ?? -1;
        result.valueInUSD = price != null && price != 0 ? result.value * price : -1;
    } catch (error) {
        // do nothing
        logger.error(error);
    }

    return result;
};

export { rpcUrlConfig, nativeTokenSymbols, getTokenPrice, getTransactionDetails };
