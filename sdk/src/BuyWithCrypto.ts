import InitOption from "./types/InitOption";
import Utils from "./utils";

class BuyWithCrypto{
    static appId: string;
    static appKey: string;
    static logoUrl: string;
    static targetAddr: string;
    //.. other configs

    static async init(option: InitOption){
        if(!option.appId || !option.appKey){
            Utils.throwError('No appId or appKey provided');
        }
        BuyWithCrypto.appId = option.appId;
        BuyWithCrypto.appKey = option.appKey;
        // TODO: get config with appId & appKey
        BuyWithCrypto.logoUrl='';
        BuyWithCrypto.targetAddr='0x6978De6532Cd2C94D47430C22B1bCddb53fB23aa';
        
    }

    static isReady(): boolean {
        if(!BuyWithCrypto.appId || !BuyWithCrypto.appKey){
            Utils.throwError('No appId or appKey provided');
            return false;
        }

        return true;
    }

    static showConnectWalletUI() {
    }

    static connectWallet() {
        if(!BuyWithCrypto.isReady()){
            return;
        }
        //
    }

}

export default BuyWithCrypto;