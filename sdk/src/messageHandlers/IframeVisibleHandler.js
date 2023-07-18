const IframeVisibleHandler = data => {
    console.log("wallet visible request handler: ", data?.visible);
    if (data?.visible) {
        window._cambrianWalletBack && window._cambrianWalletBack.showWallet();
    } else {
        window._cambrianWalletBack && window._cambrianWalletBack.hideWallet();
    }
};

export default IframeVisibleHandler;
