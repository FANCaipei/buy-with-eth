import InitOption from "./types/InitOption";
import Utils from "./utils";

class BuyWithCrypto{
    appId: string;
    appKey: string;
    logoUrl: string;
    targetAddr: string;
    //.. other configs

    constructor(option: InitOption, forceReInit:boolean = false){
        if(!option.appId || !option.appKey){
            Utils.throwError('No appId or appKey provided');
        }
        if(!(window as any).buyWithCrypto || forceReInit){
            this.appId = option.appId;
            this.appKey = option.appKey;
            // TODO: get config with appId & appKey
            this.logoUrl='';
            this.targetAddr='0x6978De6532Cd2C94D47430C22B1bCddb53fB23aa';
        }
        else{
            return (window as any).buyWithCrypto;
        }
    }


}

export default BuyWithCrypto;