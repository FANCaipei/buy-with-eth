const ethers = require("ethers");

const testDecodeInput = inputStr => {
    const result = ethers.utils.defaultAbiCoder.decode(
        [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
        ],
        ethers.utils.hexDataSlice(inputStr, 4)
    );
    console.log(result);
    const toAddr = result[0];
    const value = ethers.utils.formatUnits(result[1], 6);
    console.log(toAddr);
    console.log(value);
};

testDecodeInput(
    "0xa9059cbb0000000000000000000000000ed8d868f2397c2442378da279e441eb86b8cac7000000000000000000000000000000000000000000000000000000002fc8246b"
);
