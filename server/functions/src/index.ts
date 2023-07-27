/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { BigNumber, ethers } from "ethers";
import axios from "axios";

const rpcUrlConfig: { [key: string]: string } = {
    "0x1": "https://mainnet.infura.io/v3/56f3c243604845ea85dbdb42cf8f6ce3",
    "0x89": "https://polygon-mainnet.infura.io/v3/56f3c243604845ea85dbdb42cf8f6ce3",
};

const nativeTokenSymbols: { [key: string]: string } = {
    "0x1": "ETH",
    "0x89": "MATIC",
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
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const txInfo = await provider.getTransaction(txHash);

    if (!txInfo) {
        return Promise.reject("Transaction not exist or has not been mined");
    }

    const result = {
        receiveAddress: "",
        value: -1,
        currentPrice: -1,
        valueInUSD: -1,
        chainId: chainId,
    };

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

    if (isErc20) {
        result.currentPrice = 1;
        result.valueInUSD = result.value;
    } else {
        try {
            const price = await getTokenPrice(nativeTokenSymbols[chainId]);
            result.currentPrice = price ?? -1;
            result.valueInUSD = price != null && price != 0 ? result.value * price : -1;
        } catch (error) {
            // do nothing
            logger.error(error);
        }
    }

    return result;
};

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

export const checkPaymentAndSave = onRequest(async (request, response) => {
    const { txHash, chainId, appId, isErc20 } = request.body ?? {};
    if (!txHash || !chainId || !appId) {
        response.status(400).send("Params invalid");
        return;
    }
    // TODO: get target paymentAddress with appId;
    const rpcUrl: string = rpcUrlConfig[chainId];
    if (!rpcUrl) {
        response.status(400).send(`Chain id not support: ${chainId}`);
        return;
    }
    try {
        const txInfo = await getTransactionDetails(rpcUrl, txHash, isErc20, chainId);
        if (!txInfo) {
            response.status(400).send(`Transaction not exist or has not been mined`);
            return;
        }
        // TODO: check receive address equals paymentAddress & save to database
        response.send(txInfo);
    } catch (error) {
        logger.error(error);
        response.status(500).send(error);
    }
});
