import { ethers } from "ethers";

const GeneralUtils = {
    maskAddress(address: string) {
        if (!ethers.utils.isAddress(address)) {
            return "";
        }
        return `${address.slice(0, 6)}xxxx${address.slice(-6)}`;
    },
};

export default GeneralUtils;
